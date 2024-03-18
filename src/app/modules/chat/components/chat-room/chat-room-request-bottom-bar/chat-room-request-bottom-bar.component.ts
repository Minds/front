import { CommonModule as NgCommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import { EmojiPickerModule } from '../../../../../common/components/emoji-picker/emoji-picker.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToasterService } from '../../../../../common/services/toaster.service';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  firstValueFrom,
  lastValueFrom,
  map,
} from 'rxjs';
import {
  ChatRoomInviteRequestActionEnum,
  ChatRoomTypeEnum,
  ReplyToRoomInviteRequestGQL,
  ReplyToRoomInviteRequestMutation,
} from '../../../../../../graphql/generated.engine';
import { MutationResult } from 'apollo-angular';
import { Router } from '@angular/router';
import { ChatRequestsListService } from '../../../services/chat-requests-list.service';

/**
 * Bottom bar for chat room in request mode.
 */
@Component({
  selector: 'm-chatRoom__bottom--request',
  styleUrls: ['./chat-room-request-bottom-bar.component.ng.scss'],
  templateUrl: './chat-room-request-bottom-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    EmojiPickerModule,
  ],
  standalone: true,
})
export class ChatRoomRequestBottomBarComponent {
  /** The GUID of the room. */
  @Input() protected roomGuid: string;

  /** Type of the chat room. */
  @Input() protected roomType: ChatRoomTypeEnum;

  /** Enum for use in template. */
  protected readonly ChatRoomTypeEnum: typeof ChatRoomTypeEnum = ChatRoomTypeEnum;

  /** Whether a block action is in progress. */
  protected readonly blockInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Whether a reject action is in progress. */
  protected readonly rejectInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Whether an accept action is in progress. */
  protected readonly acceptInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Whether ANY action is in progress. */
  protected anyActionInProgress$: Observable<boolean> = combineLatest([
    this.blockInProgress$,
    this.rejectInProgress$,
    this.acceptInProgress$,
  ]).pipe(
    map(
      ([blockInProgress, rejectInProgress, acceptInProgress]: [
        boolean,
        boolean,
        boolean
      ]): boolean => {
        return blockInProgress || rejectInProgress || acceptInProgress;
      }
    )
  );

  constructor(
    private replyToRoomInviteRequestGql: ReplyToRoomInviteRequestGQL,
    private toaster: ToasterService,
    private chatRequestsListService: ChatRequestsListService,
    private router: Router
  ) {}

  /**
   * Handles the block button click.
   * @returns { Promise<void> }
   */
  protected async onBlockClick(): Promise<void> {
    if (await firstValueFrom(this.anyActionInProgress$)) return;
    this.blockInProgress$.next(true);

    if (
      await this.submitAction(ChatRoomInviteRequestActionEnum.RejectAndBlock)
    ) {
      this.toaster.success('User has been blocked');
      this.chatRequestsListService.refetch();
      this.router.navigateByUrl('/chat/requests');
    }

    this.blockInProgress$.next(false);
  }

  /**
   * Handles the reject button click.
   * @returns { Promise<void> }
   */
  protected async onRejectClick(): Promise<void> {
    if (await firstValueFrom(this.anyActionInProgress$)) return;
    this.rejectInProgress$.next(true);

    if (await this.submitAction(ChatRoomInviteRequestActionEnum.Reject)) {
      this.toaster.success('Request rejected');
      this.chatRequestsListService.refetch();
      this.router.navigateByUrl('/chat/requests');
    }

    this.rejectInProgress$.next(false);
  }

  /**
   * Handles the accept button click.
   * @returns { Promise<void> }
   */
  protected async onAcceptClick(): Promise<void> {
    if (await firstValueFrom(this.anyActionInProgress$)) return;
    this.acceptInProgress$.next(true);

    if (await this.submitAction(ChatRoomInviteRequestActionEnum.Accept)) {
      this.router.navigateByUrl(`/chat/rooms/${this.roomGuid}`);
    }

    this.rejectInProgress$.next(false);
  }

  /**
   * Submits the action.
   * @param { ChatRoomInviteRequestActionEnum } action - The action to submit.
   * @returns { Promise<boolean> } Whether the action was successful.
   */
  protected async submitAction(
    action: ChatRoomInviteRequestActionEnum
  ): Promise<boolean> {
    try {
      const result: MutationResult<ReplyToRoomInviteRequestMutation> = await lastValueFrom(
        this.replyToRoomInviteRequestGql.mutate({
          roomGuid: this.roomGuid,
          action: action,
        })
      );

      if (!result) {
        throw new Error('No result returned');
      }

      if (result.errors?.length) {
        throw new Error(result.errors[0].message);
      }

      return result?.data?.replyToRoomInviteRequest;
    } catch (e) {
      console.error(e);
      this.toaster.error('Failed to perform the action. Please try later.');
      return false;
    }
  }
}
