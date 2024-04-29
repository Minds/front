import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  Input,
} from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import {
  ChatRoomEdge,
  ChatRoomMemberEdge,
  ChatRoomTypeEnum,
} from '../../../../../../graphql/generated.engine';
import { MindsAvatarObject } from '../../../../../common/components/avatar/avatar';
import { ChatDatePipe } from '../../../pipes/chat-date-pipe';
import { Router, RouterModule } from '@angular/router';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';
import {
  ChatRoomAvatarsService,
  ChatRoomListAvatarObject,
} from '../../../services/chat-room-avatars.service';

const MULTI_USER_AVATARS_TO_SHOW: number = 2;

/**
 * Individual item in the room list.
 */
@Component({
  selector: 'm-chat__roomListItem',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgCommonModule, ChatDatePipe, RouterModule],
  standalone: true,
  host: {
    '(click)': 'navigateToChat()',
  },
})
export class ChatRoomListItemComponent {
  /** Name of the room. */
  protected roomName: string;

  /** Type of chat room. */
  protected roomType: ChatRoomTypeEnum;

  /** Avatar object of the chat participants. */
  protected avatars: MindsAvatarObject[] = [];

  /** Timestamp of the last message. */
  protected timestamp: number;

  /** Last message sent to the chat. */
  protected lastMessage: string;

  /** GUID of the room. */
  protected roomGuid: string;

  /** GUID of the chat room group, if it is a group chat. */
  protected groupGuid: string;

  /** True/False if unread messages exist in this room */
  protected unreadMessages: boolean;

  /** Whether the room is active. Binds active class when input value is true. */
  @HostBinding('class.m-chat__roomListItem--active')
  @Input()
  protected active: boolean = false;

  /** Navigation link for on item click. */
  @Input() protected navigationLink: string;

  /**
   * Set class variables based upon the edge passed via input.
   */
  @Input() set edge(edge: ChatRoomEdge) {
    this.roomName = edge.node.name;
    this.roomType = edge.node.roomType;
    this.groupGuid = edge.node.groupGuid;

    this.avatars = this.getAvatarObjects(edge.members?.edges);

    this.timestamp = Number(
      Boolean(edge.lastMessageCreatedTimestamp)
        ? edge.lastMessageCreatedTimestamp
        : edge.node.timeCreatedUnix
    );

    this.lastMessage = edge.lastMessagePlainText;
    this.roomGuid = edge.node?.guid;
    this.unreadMessages = edge.unreadMessagesCount > 0;
  }

  constructor(
    private router: Router,
    private chatRoomAvatarsService: ChatRoomAvatarsService,
    @Inject(WINDOW) private window: Window
  ) {}

  /**
   * Get the avatar objects for the chat room.
   * @param { ChatRoomMemberEdge[] } members - The members of the chat room.
   * @returns { ChatRoomListAvatarObject[] } - The avatar objects for the chat room.
   */
  private getAvatarObjects(
    members: ChatRoomMemberEdge[]
  ): ChatRoomListAvatarObject[] {
    return this.roomType === ChatRoomTypeEnum.GroupOwned && this.groupGuid
      ? this.chatRoomAvatarsService.getGroupAvatarObjects(this.groupGuid)
      : this.chatRoomAvatarsService.getUserAvatarObjects(
          members,
          MULTI_USER_AVATARS_TO_SHOW
        );
  }

  /**
   * Navigate to the chat room.
   * @returns { void }
   */
  protected navigateToChat(): void {
    this.router.navigateByUrl(
      this.navigationLink ?? `/chat/rooms/${this.roomGuid}`
    );
  }

  /**
   * Opening a path in a new tab.
   * @param { string } navigationPath - The path to open.
   * @returns { void }
   */
  protected openInNewTab(navigationPath: string): void {
    this.window.open(navigationPath, '_blank');
  }
}
