import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { CommonModule } from '../../../../../../common/common.module';
import { ChatMessageEdge } from '../../../../../../../graphql/generated.engine';
import { ChatDatePipe } from '../../../../pipes/chat-date-pipe';
import { Session } from '../../../../../../services/session';
import { RouterModule } from '@angular/router';
import { GrowShrinkFast } from '../../../../../../animations';

/**
 * Message component for the chat room.
 */
@Component({
  selector: 'm-chatRoom__message',
  styleUrls: ['./chat-room-message.component.ng.scss'],
  templateUrl: './chat-room-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GrowShrinkFast],
  imports: [NgCommonModule, CommonModule, ChatDatePipe, RouterModule],
  standalone: true,
})
export class ChatRoomMessageComponent {
  /** Setter for message edge. */
  @Input() protected set messageEdge(messageEdge: ChatMessageEdge) {
    this.senderName = messageEdge.node?.sender?.node?.name;
    this.plainText = messageEdge.node.plainText;
    this.timeCreatedUnix = Number(messageEdge?.node?.timeCreatedUnix);
    this.senderGuid = messageEdge.node?.sender?.node?.guid;
    this.senderUsername = messageEdge.node?.sender?.node?.username;
    this.isFromOtherParticipant =
      this.session.getLoggedInUser()?.guid !== this.senderGuid;

    if (this.isFromOtherParticipant) {
      this.isLeft = true;
      this.isRight = false;
    } else {
      this.isLeft = false;
      this.isRight = true;
    }
  }

  /** Whether preceding message in sequence is from the same sender. */
  @Input() protected isPreviousMessageFromSameSender: boolean = false;

  /** Whether next message in sequence is from the same sender. */
  @HostBinding('class.m-chatRoom__message--nextMessageIsFromSameSender')
  @Input()
  protected isNextMessageFromSameSender: boolean = false;

  /** Whether the alignment of the message is left. */
  @HostBinding('class.m-chatRoom__message--left')
  protected isLeft: boolean = false;

  /** Whether the alignment of the message is right. */
  @HostBinding('class.m-chatRoom__message--right')
  protected isRight: boolean = true;

  /** Name of the sender. */
  protected senderName: string;

  /** Plain text of the message. */
  protected plainText: string;

  /** Time created for the message (unix). */
  protected timeCreatedUnix: number;

  /** GUID of the sender. */
  protected senderGuid: string;

  /** Username of the sender. */
  protected senderUsername: string;

  /** Whether the message is from another chat participant. */
  protected isFromOtherParticipant: boolean = false;

  /** Whether the message is manually expanded. */
  protected isManuallyExpanded: boolean = false;

  constructor(private session: Session) {}

  /**
   * Handle message click.
   * @returns { void }
   */
  protected handleMessageClick(): void {
    if (!this.isNextMessageFromSameSender) return;
    this.isManuallyExpanded = !this.isManuallyExpanded;
  }
}
