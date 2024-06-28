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
  AddMembersToChatRoomGQL,
  AddMembersToChatRoomMutation,
  ChatRoomEdge,
  ChatRoomMemberEdge,
  ChatRoomTypeEnum,
} from '../../../../../../graphql/generated.engine';
import { RouterModule } from '@angular/router';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';
import {
  ChatRoomAvatarsService,
  ChatRoomListAvatarObject,
} from '../../../services/chat-room-avatars.service';
import { EditChatRoomModalService } from '../edit-chat-room-modal/edit-chat-room-modal.service';
import { SingleChatRoomService } from '../../../services/single-chat-room.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { UserSelectModalService } from '../../user-select-modal/user-select-modal.service';
import { MindsUser } from '../../../../../interfaces/entities';
import { MutationResult } from 'apollo-angular';

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
    this.roomGuid = chatRoomEdge?.node?.guid;

    this.avatars =
      chatRoomEdge?.node?.roomType === ChatRoomTypeEnum.GroupOwned &&
      chatRoomEdge.node?.groupGuid
        ? this.chatRoomAvatarsService.getGroupAvatarObjects(
            chatRoomEdge.node?.groupGuid
          )
        : this.chatRoomAvatarsService.getUserAvatarObjects(
            chatRoomEdge.members?.edges
          );

    this.memberEdges = chatRoomEdge.members.edges;

    this.showEditRoomButton =
      chatRoomEdge.node.isUserRoomOwner &&
      chatRoomEdge?.node?.roomType === ChatRoomTypeEnum.MultiUser;

    this.showAddUsersButton =
      chatRoomEdge?.node?.roomType === ChatRoomTypeEnum.MultiUser &&
      !chatRoomEdge.node.isChatRequest;
  }

  /** Whether topbar for a chat room in request mode. */
  @Input() protected requestMode: boolean = false;

  /** Name of the chat room. */
  protected roomName: string;

  /** Guid of the chat room. */
  protected roomGuid: string;

  /** Avatars to be shown for the chat room. */
  protected avatars: ChatRoomListAvatarObject[] = [];

  /** Edges for members of the chat room. */
  protected memberEdges: ChatRoomMemberEdge[] = [];

  /** Fires on details icon click. */
  @Output('detailsIconClick')
  protected detailsIconClickEmitter: EventEmitter<void> =
    new EventEmitter<void>();

  /** Whether edit room button should be shown. */
  protected showEditRoomButton: boolean = false;

  /** Whether add users button should be shown. */
  protected showAddUsersButton: boolean = false;

  constructor(
    public cd: ChangeDetectorRef,
    private chatRoomAvatarsService: ChatRoomAvatarsService,
    private editChatRoomModalService: EditChatRoomModalService,
    private singleChatRoomService: SingleChatRoomService,
    private userSelectModalService: UserSelectModalService,
    private addMembersToChatRoomGql: AddMembersToChatRoomGQL,
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

  /**
   * Handle edit chat room click.
   * @returns { Promise<void> }
   */
  protected async onEditChatNameClick(): Promise<void> {
    await this.editChatRoomModalService.open(
      await firstValueFrom(this.singleChatRoomService.chatRoom$)
    );
  }

  /**
   * Handle add to chat click.
   * @returns { void }
   */
  protected handleAddToChatClick(): void {
    this.userSelectModalService.open({
      saveFunction: async (selectedUsers: MindsUser[]): Promise<boolean> => {
        const result: MutationResult<AddMembersToChatRoomMutation> =
          await lastValueFrom(
            this.addMembersToChatRoomGql.mutate({
              roomGuid: this.roomGuid,
              memberGuids: selectedUsers.map((user) => user.guid),
            })
          );
        this.singleChatRoomService.refetch();
        return result?.data?.addMembersToChatRoom ?? false;
      },
      title: 'Add to chat',
      ctaText: 'Add members',
      emptyStateText: 'Try searching for users.',
      excludedUserGuids: this.memberEdges.map(
        (edge: ChatRoomMemberEdge) => edge.node.guid
      ),
    });
  }
}
