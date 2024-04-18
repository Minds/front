import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
} from '@angular/core';
import { CommonModule } from '../../../../../../common/common.module';
import {
  ChatMessageEdge,
  ChatRichEmbedNode,
} from '../../../../../../../graphql/generated.engine';
import { ChatDatePipe } from '../../../../pipes/chat-date-pipe';
import { RouterModule } from '@angular/router';
import { GrowShrinkFastNoMarginShift } from '../../../../../../animations';
import { WINDOW } from '../../../../../../common/injection-tokens/common-injection-tokens';
import { ChatRoomMessageDropdownComponent } from './chat-room-message-dropdown/chat-room-message-dropdown.component';
import { ChatRoomMessageRichEmbedComponent } from './chat-room-message-rich-embed/chat-room-message-rich-embed.component';

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

  constructor(
    public cd: ChangeDetectorRef,
    @Inject(WINDOW) private window: Window,
    protected elementRef: ElementRef
  ) {}

  /**
   * Handle message click.
   * @returns { void }
   */
  protected handleMessageClick(): void {
    if (!this.isNextMessageFromSameSender) return;
    this.isManuallyExpanded = !this.isManuallyExpanded;
  }

  /**
   * Handles middle mouse click on an avatar by opening the users channel
   * in a new tab.
   */
  protected openSenderChannelInNewTab(): void {
    this.window.open(`/${this.senderUsername}`, '_blank');
  }
}
