import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '../../../../../../common/common.module';
import {
  ChatImageNode,
  ChatMessageEdge,
  ChatRichEmbedNode,
} from '../../../../../../../graphql/generated.engine';
import { ChatDatePipe } from '../../../../pipes/chat-date-pipe';
import { RouterModule } from '@angular/router';
import { GrowShrinkFastNoMarginShift } from '../../../../../../animations';
import { WINDOW } from '../../../../../../common/injection-tokens/common-injection-tokens';
import { ChatRoomMessageDropdownComponent } from './chat-room-message-dropdown/chat-room-message-dropdown.component';
import { ChatRoomMessageRichEmbedComponent } from './chat-room-message-rich-embed/chat-room-message-rich-embed.component';
import { MarkdownModule } from 'ngx-markdown';

/**
 * Message component for the chat room.
 *
 * TODO: When adding media in future, be sure to update all implementations of this component,
 * including in the admin queue.
 */
@Component({
  selector: 'm-chatRoom__message',
  styleUrls: ['./chat-room-message.component.ng.scss'],
  templateUrl: './chat-room-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GrowShrinkFastNoMarginShift],
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule,
    ChatDatePipe,
    ChatRoomMessageDropdownComponent,
    ChatRoomMessageRichEmbedComponent,
    MarkdownModule,
  ],
  standalone: true,
})
export class ChatRoomMessageComponent {
  /** Whether the message is from the currently logged in user. */
  private _isFromLoggedInUser: boolean = false;

  /** Whether the alignment of the message is left. */
  @HostBinding('class.m-chatRoom__message--left')
  protected isLeftAligned: boolean = false;

  /** Whether the alignment of the message is right. */
  @HostBinding('class.m-chatRoom__message--right')
  protected isRightAligned: boolean = true;

  /** Whether next message in a sequence is from the same sender. */
  @HostBinding('class.m-chatRoom__message--nextMessageIsFromSameSender')
  @Input()
  protected isNextMessageFromSameSender: boolean = false;

  /** The image container */
  @ViewChild('imageContainer', { read: ElementRef })
  imageContainerEl: ElementRef;

  /** Whether preceding message in a sequence is from the same sender. */
  @Input() protected isPreviousMessageFromSameSender: boolean = false;

  /** Name of the sender. */
  @Input() protected senderName: string;

  /** Plain text of the message. */
  @Input() protected plainText: string;

  /** Time created for the message (unix). */
  @Input() protected timeCreatedUnix: number;

  /** GUID of the sender. */
  @Input() protected senderGuid: string;

  /** Username of the sender. */
  @Input() protected senderUsername: string;

  /** Full message edge. - can be omitted if no dropdown menu is required. */
  @Input() protected messageEdge: ChatMessageEdge;

  /** Optional rich embed node for chat message. */
  @Input() protected richEmbed: ChatRichEmbedNode;

  /** Optional image node for chat message. */
  @Input() protected image: ChatImageNode;

  /** Whether the message is from another chat participant. */
  @Input() protected set isMessageOwner(isFromLoggedInUser: boolean) {
    this._isFromLoggedInUser = isFromLoggedInUser;
    this.isLeftAligned = !isFromLoggedInUser;
    this.isRightAligned = isFromLoggedInUser;
  }

  /** Whether the message is from another chat participant. */
  get isFromLoggedInUser(): boolean {
    return this._isFromLoggedInUser;
  }

  /** Whether the message is manually expanded. */
  protected isManuallyExpanded: boolean = false;

  imageHeight: number;
  imageWidth: number;

  constructor(
    public cd: ChangeDetectorRef,
    @Inject(WINDOW) private window: Window,
    protected elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.calculateImageDimensions();
  }

  protected calculateImageDimensions(): void {
    if (!this.image) {
      return;
    }

    const imageAspectRatio =
      this.image.height && this.image.width
        ? this.image.height / this.image.width
        : 1;

    this.imageWidth = Math.min(344, this.image.width || 344);
    this.imageHeight = this.imageWidth * imageAspectRatio;

    if (this.imageHeight > 800) {
      this.imageHeight = 800;
      this.imageWidth = this.imageHeight / imageAspectRatio;
    }
  }

  /**
   * Handle message click.
   * @returns { void }
   */
  protected handleMessageClick(): void {
    if (!this.isNextMessageFromSameSender || this.image) return;
    this.isManuallyExpanded = !this.isManuallyExpanded;
  }

  /**
   * Handle message text click.
   * @param { MouseEvent } $event - The click event.
   * @returns { void }
   */
  protected handleMessageTextClick($event: MouseEvent) {
    if (($event.target as HTMLElement).tagName === 'A') {
      $event.stopPropagation();
    }
  }

  /**
   * Handles middle mouse click on an avatar by opening the users channel
   * in a new tab.
   */
  protected openSenderChannelInNewTab(): void {
    this.window.open(`/${this.senderUsername}`, '_blank');
  }

  /**
   * Handles image click by opening the image in a new tab.
   * In future, we may want to display these in a modal.
   * @returns { void }
   */
  protected handleImageClick(): void {
    this.window.open(this.image.url, '_blank');
  }
}
