import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import { EmojiPickerModule } from '../../../../../common/components/emoji-picker/emoji-picker.module';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {
  ChatMessageEdge,
  CreateChatMessageGQL,
  CreateChatMessageMutation,
  GetChatMessagesDocument,
  GetChatMessagesQuery,
} from '../../../../../../graphql/generated.engine';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { MutationResult } from 'apollo-angular';
import { ToasterService } from '../../../../../common/services/toaster.service';
import {
  ChatMessagesService,
  PAGE_SIZE,
} from '../../../services/chat-messages.service';
import { InMemoryCache } from '@apollo/client';
import { cloneDeep } from '@apollo/client/utilities';
import { Session } from '../../../../../services/session';
import { MindsUser } from '../../../../../interfaces/entities';
import { PermissionsService } from '../../../../../common/services/permissions.service';
import { ChatImageUploadService } from '../../../services/chat-image-upload.service';

/** Placeholder for message fields that cannot be optimistically predicted. */
export const OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER: string = 'optimistic';

/**
 * Bottom bar for chat room.
 */
@Component({
  selector: 'm-chatRoom__bottom',
  styleUrls: ['./chat-room-bottom-bar.component.ng.scss'],
  templateUrl: './chat-room-bottom-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    EmojiPickerModule,
  ],
  standalone: true,
})
export class ChatRoomBottomBarComponent implements OnInit {
  /** Form group containing the text area. */
  protected formGroup: FormGroup;

  protected readonly sendInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether the image upload is in progress. */
  protected readonly uploadInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  @Input() protected roomGuid: string;

  @Output() protected messageSent: EventEmitter<ChatMessageEdge> =
    new EventEmitter<ChatMessageEdge>();

  /** Text area viewchild */
  @ViewChild('textArea') protected textArea: ElementRef<HTMLTextAreaElement>;

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToasterService,
    private createMessageGQL: CreateChatMessageGQL,
    private chatMessageService: ChatMessagesService,
    private chatImageUploadService: ChatImageUploadService,
    private permissionService: PermissionsService,
    private session: Session
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      message: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Whether the user can upload chat media.
   * @returns { boolean } True if the user can upload chat media.
   */
  get canUploadChatMedia(): boolean {
    return this.permissionService.canUploadChatMedia();
  }

  /**
   * Todo, fires on emoji add.
   * @param { EmojiData } emoji - The emoji data.
   * @returns { void }
   */
  protected onEmojiAdd(emoji: EmojiData): void {
    const selectionStart: number = this.textArea.nativeElement.selectionStart;
    const currentMessage: string = this.formGroup.get('message').value;
    const preText = currentMessage.substring(0, selectionStart);
    const postText = currentMessage.substring(selectionStart);
    this.formGroup.get('message').setValue(preText + emoji.native + postText);
    this.textArea.nativeElement.focus();
  }

  /**
   * Handle enter key press - submit message unless shift is pressed (new line).
   * @param { KeyboardEvent } $event - The keyboard event.
   */
  protected onEnterPress($event: KeyboardEvent): void {
    if (!$event?.shiftKey) {
      $event.preventDefault();
      this.onSubmit();
    }
  }

  /**
   * Handles file selection for chat media.
   * @param { File } file - The file to upload.
   * @returns { Promise<void> }
   */
  protected async onFileSelect(file: File): Promise<void> {
    if (!file?.type?.startsWith('image/')) {
      this.toaster.warn('Only images are currently supported');
      return;
    }

    this.uploadInProgress$.next(true);

    try {
      await lastValueFrom(
        this.chatImageUploadService.upload(file, this.roomGuid)
      );
      this.chatMessageService.hasNewMessage$.next();
    } catch (e) {
      this.toaster.error('Failed to upload image');
      console.error('Failed to upload image:', e);
    } finally {
      this.uploadInProgress$.next(false);
    }
  }

  /**
   * Handle submit button click / message send.
   * @returns { Promise<void> }
   */
  protected async onSubmit(): Promise<void> {
    this.sendInProgress$.next(true);

    // This prevents mobile keyboards from closing on submit.
    this.textArea.nativeElement.focus();

    const formControl: AbstractControl<string> = this.formGroup.get('message');
    const message = formControl.value.trim();

    if (!message?.length) {
      this.sendInProgress$.next(false);
      return;
    }

    // optimistically reset the field.
    formControl.setValue('');
    formControl.markAsPristine();
    formControl.markAsUntouched();

    try {
      const result: MutationResult<CreateChatMessageMutation> =
        await lastValueFrom(
          this.createMessageGQL.mutate(
            {
              plainText: message,
              roomGuid: this.roomGuid,
            },
            {
              optimisticResponse:
                this.buildOptimisticCreateMessageResponse(message),
              update: this.handleCreateMessageUpdate.bind(this),
            }
          )
        );

      if (!result) {
        throw new Error('Failed to send message');
      }

      if (result.errors?.length) {
        throw new Error(result.errors[0].message);
      }
    } catch (e) {
      formControl.setValue(message); // revert field to original value.
      this.toaster.error(e);
      console.error(e);
    } finally {
      this.sendInProgress$.next(false);
    }
  }

  /**
   * Handle create message update. Will update the cache with the new message.
   * @param { InMemoryCache } cache - cache.
   * @param { MutationResult<CreateChatMessageMutation> } result - result of the updating mutation.
   * @param { unknown } options - options.
   * @returns { void }
   */
  private handleCreateMessageUpdate(
    cache: InMemoryCache,
    result: MutationResult<CreateChatMessageMutation>,
    options: unknown
  ): void {
    let newValue: GetChatMessagesQuery = cloneDeep(
      cache.readQuery<GetChatMessagesQuery>({
        query: GetChatMessagesDocument,
        variables: {
          first: PAGE_SIZE,
          roomGuid: this.roomGuid,
        },
      })
    );

    newValue.chatMessages.edges.push(
      result.data.createChatMessage as ChatMessageEdge
    );

    cache.writeQuery({
      query: GetChatMessagesDocument,
      variables: {
        first: PAGE_SIZE,
        roomGuid: this.roomGuid,
      },
      data: newValue,
    });

    this.chatMessageService.requestScrollToBottom();
  }

  /**
   * Build optimistic response for message submission.
   * @param { string } plainText - The plain text of the message.
   * @returns { CreateChatMessageMutation } - The optimistic response.
   */
  private buildOptimisticCreateMessageResponse(
    plainText: string
  ): CreateChatMessageMutation {
    const sender: MindsUser = this.session.getLoggedInUser();
    const optimisticSendDate: Date = new Date();

    const optimisticMessage: CreateChatMessageMutation = {
      __typename: 'Mutation',
      createChatMessage: {
        __typename: 'ChatMessageEdge',
        id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER + Date.now(),
        cursor: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
        node: {
          id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
          guid: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
          plainText: plainText,
          roomGuid: this.roomGuid,
          sender: {
            cursor: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
            id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
            type: 'user',
            node: {
              id: sender.guid,
              guid: sender.guid,
              username: sender.username,
              name: sender.name,
            },
          },
          timeCreatedUnix: (optimisticSendDate.valueOf() / 1000).toString(),
          timeCreatedISO8601: optimisticSendDate.toISOString(),
          richEmbed: null, // we could stub a rich embed response here in future to ease jump-in.
          image: null,
        },
      },
    };

    return optimisticMessage;
  }
}
