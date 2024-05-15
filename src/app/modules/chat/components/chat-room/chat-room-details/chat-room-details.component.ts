import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ChatMembersListComponent } from './chat-members-list/chat-members-list.component';
import { TotalChatRoomMembersService } from '../../../services/total-chat-room-members.service';
import {
  Observable,
  Subscription,
  firstValueFrom,
  last,
  map,
  take,
  takeLast,
  throttleTime,
} from 'rxjs';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ChatRoomMembersService } from '../../../services/chat-room-members.service';
import { CommonModule } from '../../../../../common/common.module';
import { ChatRoomNotificationSettingsComponent } from './chat-room-notification-settings/chat-room-notification-settings.component';
import {
  ChatRoomEdge,
  ChatRoomRoleEnum,
  ChatRoomTypeEnum,
} from '../../../../../../graphql/generated.engine';
import { SingleChatRoomService } from '../../../services/single-chat-room.service';
import { ChatRoomUserActionsService } from '../../../services/chat-room-user-actions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatRoomsListService } from '../../../services/chat-rooms-list.service';
import {
  ModalRef,
  ModalService,
} from '../../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../../modals/confirm-v2/confirm.component';
import { EditChatRoomModalService } from '../edit-chat-room-modal/edit-chat-room-modal.service';

/**
 * Details panel for a given chat room.
 */
@Component({
  selector: 'm-chatRoom__details',
  styleUrls: ['./chat-room-details.component.ng.scss'],
  templateUrl: './chat-room-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    CommonModule,
    ChatMembersListComponent,
    ChatRoomNotificationSettingsComponent,
  ],
  standalone: true,
})
export class ChatRoomDetailsComponent implements OnInit {
  // Enums for use in template.
  protected readonly ChatRoomTypeEnum: typeof ChatRoomTypeEnum =
    ChatRoomTypeEnum;
  protected readonly ChatRoomRoleEnum: typeof ChatRoomRoleEnum =
    ChatRoomRoleEnum;

  /** GUID of the chat room. */
  @Input() protected roomGuid: string;

  /** Handle back button click. */
  @Output('backClick') protected backClickEmitter: EventEmitter<void> =
    new EventEmitter<void>();

  /** Count of members that the room has. */
  protected readonly membersCount$: Observable<number> =
    this.totalChatRoomMembersService.membersCount$;

  /** Whether member service is initialized. */
  protected readonly initialized$: Observable<boolean> =
    this.chatRoomMembersService.initialized$;

  /** Chat room details are being shown for. */
  protected readonly chatRoom$: Observable<ChatRoomEdge> =
    this.singleChatRoomService.chatRoom$;

  /** Type of the chat room. */
  protected readonly chatRoomType$: Observable<ChatRoomTypeEnum> =
    this.chatRoom$.pipe(
      map((chatRoom: ChatRoomEdge) => chatRoom?.node?.roomType)
    );

  /** Whether the currently logged in user is the room owner. */
  protected readonly isUserRoomOwner$: Observable<boolean> =
    this.chatRoom$.pipe(
      map((chatRoom: ChatRoomEdge): boolean => chatRoom?.node?.isUserRoomOwner)
    );

  constructor(
    private totalChatRoomMembersService: TotalChatRoomMembersService,
    private chatRoomMembersService: ChatRoomMembersService,
    private singleChatRoomService: SingleChatRoomService,
    private userActionsService: ChatRoomUserActionsService,
    private chatRoomsListService: ChatRoomsListService,
    private editChatRoomModalService: EditChatRoomModalService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.chatRoomMembersService.init(this.roomGuid);
  }

  /**
   * Handle block user click.
   * @returns { Promise<void> }
   */
  protected async onBlockUserClick(): Promise<void> {
    const chatRoom: ChatRoomEdge = await firstValueFrom(this.chatRoom$);

    if (chatRoom.node.roomType !== ChatRoomTypeEnum.OneToOne) {
      console.warn('Tried to block user in a non one to one chat room');
      return;
    }

    const modalRef: ModalRef<ConfirmV2Component> = this.modalService.present(
      ConfirmV2Component,
      {
        data: {
          title: 'Block user',
          body:
            'Are you sure you want to block this user? \n\n' +
            "Blocking ensures that you won't receive any message requests from this user going forward. Your chat history with this user will be deleted.",
          confirmButtonText: 'Block',
          confirmButtonColor: 'red',
          confirmButtonSolid: true,
          showCancelButton: false,
          onConfirm: async () => {
            modalRef.close();
            if (await this.userActionsService.blockUserByChatRoom(chatRoom)) {
              this.chatRoomsListService.refetch();
              this.navigateBack();
            }
          },
        },
        injector: this.injector,
      }
    );
  }

  /**
   * Handle delete chat click.
   * @returns { Promise<void> }
   */
  protected async onDeleteChatClick(): Promise<void> {
    const chatRoom: ChatRoomEdge = await firstValueFrom(this.chatRoom$);

    const modalRef: ModalRef<ConfirmV2Component> = this.modalService.present(
      ConfirmV2Component,
      {
        data: {
          title: 'Delete chat',
          body:
            'Are you sure you want to delete this chat?\n\n' +
            'This chat will be deleted for everyone in the chat. No one will be able to see it and all of the message history will be deleted.',
          confirmButtonText: 'Delete',
          confirmButtonColor: 'red',
          confirmButtonSolid: true,
          showCancelButton: false,
          onConfirm: async () => {
            modalRef.close();
            if (await this.userActionsService.deleteChatRoom(chatRoom)) {
              this.chatRoomsListService.refetch();
              this.navigateBack();
            }
          },
        },
        injector: this.injector,
      }
    );
  }

  /**
   * Handle leave chat click.
   * @returns { Promise<void> }
   */
  protected async onLeaveChatClick(): Promise<void> {
    const chatRoom: ChatRoomEdge = await firstValueFrom(this.chatRoom$);

    const modalRef: ModalRef<ConfirmV2Component> = this.modalService.present(
      ConfirmV2Component,
      {
        data: {
          title: 'Leave chat',
          body:
            'Are you sure you want to leave this chat?\n\n' +
            'This chat will be removed from your chat list.',
          confirmButtonText: 'Leave',
          confirmButtonColor: 'red',
          confirmButtonSolid: true,
          showCancelButton: false,
          onConfirm: async () => {
            modalRef.close();
            if (await this.userActionsService.leaveChatRoom(chatRoom)) {
              this.chatRoomsListService.refetch();
              this.navigateBack();
            }
          },
        },
        injector: this.injector,
      }
    );
  }

  /**
   * Handle edit chat room click.
   * @returns { Promise<void> }
   */
  protected async onEditChatNameClick(): Promise<void> {
    await this.editChatRoomModalService.open(
      await firstValueFrom(this.chatRoom$)
    );
  }

  private navigateBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
