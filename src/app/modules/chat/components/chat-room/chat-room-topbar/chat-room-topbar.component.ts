import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import {
  ChatRoomEdge,
  ChatRoomTypeEnum,
} from '../../../../../../graphql/generated.engine';
import { RouterModule } from '@angular/router';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';
import {
  ChatRoomAvatarsService,
  ChatRoomListAvatarObject,
} from '../../../services/chat-room-avatars.service';

/**
 * Top section of a chat room, containing the room name, and submenu icon.
 */
@Component({
  selector: 'm-chatRoom__top',
  styleUrls: ['./chat-room-topbar.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-room-topbar.component.html',
  imports: [NgCommonModule, CommonModule, RouterModule],
  standalone: true,
})
export class ChatRoomTopComponent {
  /** Chat room edge. */
  @Input() protected set chatRoomEdge(chatRoomEdge: ChatRoomEdge) {
    this.roomName = chatRoomEdge?.node?.name;

    this.avatars =
      chatRoomEdge?.node?.roomType === ChatRoomTypeEnum.GroupOwned &&
      chatRoomEdge.node?.groupGuid
        ? this.chatRoomAvatarsService.getGroupAvatarObjects(
            chatRoomEdge.node?.groupGuid
          )
        : this.chatRoomAvatarsService.getUserAvatarObjects(
            chatRoomEdge.members?.edges
          );
  }

  /** Whether topbar for a chat room in request mode. */
  @Input() protected requestMode: boolean = false;

  /** Name of the chat room. */
  protected roomName: string;

  /** Avatars to be shown for the chat room. */
  protected avatars: ChatRoomListAvatarObject[] = [];

  /** Fires on details icon click. */
  @Output('detailsIconClick')
  protected detailsIconClickEmitter: EventEmitter<void> =
    new EventEmitter<void>();

  constructor(
    public cd: ChangeDetectorRef,
    private chatRoomAvatarsService: ChatRoomAvatarsService,
    @Inject(WINDOW) private window: Window
  ) {}

  /**
   * Opening a path in a new tab.
   * @param { string } navigationPath - The path to open.
   * @returns { void }
   */
  protected openInNewTab(navigationPath: string): void {
    this.window.open(navigationPath, '_blank');
  }
}
