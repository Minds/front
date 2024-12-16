import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../../../../../common/common.module';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  firstValueFrom,
  map,
} from 'rxjs';
import { Router } from '@angular/router';
import {
  ChatRoomEdge,
  ChatRoomMemberEdge,
  ChatRoomRoleEnum,
  ChatRoomTypeEnum,
} from '../../../../../../../../../graphql/generated.engine';
import { SingleChatRoomService } from '../../../../../../services/single-chat-room.service';
import { Session } from '../../../../../../../../services/session';
import { ChatRoomUserActionsService } from '../../../../../../services/chat-room-user-actions.service';
import { ChatRoomMembersService } from '../../../../../../services/chat-room-members.service';
import { TotalChatRoomMembersService } from '../../../../../../services/total-chat-room-members.service';
import { NgxFloatUiContentComponent } from 'ngx-float-ui';

/**
 * Dropdown menu for chat members list item. Options vary depending on role
 * and room members.
 */
@Component({
  selector: 'm-chatRoomMembersListItem__dropdown',
  styleUrls: ['./chat-room-members-list-item-dropdown.component.ng.scss'],
  templateUrl: './chat-room-members-list-item-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, CommonModule],
  standalone: true,
})
export class ChatRoomMembersListItemDropdownComponent implements OnInit {
  // Enums for use in template.
  protected readonly ChatRoomTypeEnum: typeof ChatRoomTypeEnum =
    ChatRoomTypeEnum;
  protected readonly ChatRoomRoleEnum: typeof ChatRoomRoleEnum =
    ChatRoomRoleEnum;

  /** Viewchild of dropdown menu. */
  @ViewChild('dropdownMenuContent')
  dropdownMenuContent: NgxFloatUiContentComponent;

  /** Member edge that dropdown is acting upon. */
  @Input() protected memberEdge: ChatRoomMemberEdge;

  /** Whether an action is in progress. */
  protected readonly actionInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether remove from chat option should be shown. */
  protected readonly showRemoveFromChatOption$: Observable<boolean> =
    combineLatest([
      this.totalChatRoomMembersService.membersCount$,
      this.singleChatRoomService.chatRoom$,
    ]).pipe(
      distinctUntilChanged(),
      map(([membersCount, chatRoom]: [number, ChatRoomEdge]): boolean => {
        return (
          (chatRoom.node.roomType === ChatRoomTypeEnum.GroupOwned ||
            chatRoom.node.roomType === ChatRoomTypeEnum.MultiUser) &&
          chatRoom.node.isUserRoomOwner &&
          membersCount > 2 &&
          this.memberEdge.role !== ChatRoomRoleEnum.Owner &&
          this.memberEdge.node.guid !== this.loggedInUserGuid
        );
      })
    );

  /**
   * Whether to force the showing of the dropdown.
   */
  protected dropdownMenuShown: boolean = false;

  /** Currently logged in user guid. */
  protected loggedInUserGuid: string;

  constructor(
    private router: Router,
    private session: Session,
    private singleChatRoomService: SingleChatRoomService,
    private userActions: ChatRoomUserActionsService,
    private chatRoomMembersService: ChatRoomMembersService,
    private totalChatRoomMembersService: TotalChatRoomMembersService
  ) {}

  ngOnInit(): void {
    this.loggedInUserGuid = this.session.getLoggedInUser().guid;
  }

  /**
   * Handle on float-ui shown event.
   * @returns { void }
   */
  protected onFloatUiShown(): void {
    this.dropdownMenuShown = true;
  }

  /**
   * Handle on float-ui hidden event.
   * @returns { void }
   */
  protected onFloatUiHidden(): void {
    this.dropdownMenuShown = false;
  }

  /**
   * Handle on view profile click by navigating to a users profile.
   */
  protected onViewProfileClick(): void {
    this.router.navigateByUrl(`/${this.memberEdge.node.username}`);
  }

  /**
   * Handle on remove member click, by removing a member and reinitialising appropriate services.
   * @returns { Promise<void> }
   */
  protected async onRemoveMemberClick(): Promise<void> {
    const chatRoom: ChatRoomEdge = await firstValueFrom(
      this.singleChatRoomService.chatRoom$
    );

    if (
      await this.userActions.removeFromChatRoom(chatRoom, this.memberEdge.node)
    ) {
      this.chatRoomMembersService.refetch();
      this.singleChatRoomService.refetch();
      this.totalChatRoomMembersService.refetch();
    }
  }
}
