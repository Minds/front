import { Component, Input } from '@angular/core';
import {
  ChatRoomEdge,
  PermissionsEnum,
} from '../../../../../graphql/generated.engine';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Router } from '@angular/router';
import { GroupChatRoomService } from '../services/group-chat-rooms.service';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';
import { GroupService } from '../group.service';

/**
 * Button to create a chat room for a group.
 */
@Component({
  selector: 'm-group__chatButton',
  template: `
    <m-button
      class="m-button-v2 m-button-v2--iconOnly"
      title="Chat"
      i18n-title="@@GROUP_CHAT_BUTTON__CHAT"
      overlay="true"
      iconOnly="true"
      [disabled]="actionInProgress$ | async"
      (onAction)="handleClick()"
    >
      <m-icon
        [iconId]="(actionInProgress$ | async) ? 'more_horiz' : 'chat_bubble'"
        [sizeFactor]="0"
      ></m-icon>
    </m-button>
  `,
})
export class GroupChatButton {
  /** GUID of the group. */
  @Input() private groupGuid: string;

  /** Whether an action is in progress. */
  protected readonly actionInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private groupChatRoomService: GroupChatRoomService,
    private permissionIntentsService: PermissionIntentsService,
    private groupService: GroupService,
    private toasterService: ToasterService,
    private router: Router
  ) {}

  /**
   * Handles the click event.
   * @returns { Promise<void> }
   */
  protected async handleClick(): Promise<void> {
    if (
      this.groupService.isCoversationDisabled$.getValue() &&
      !this.permissionIntentsService.checkAndHandleAction(
        PermissionsEnum.CanCreateChatRoom
      )
    ) {
      return;
    }

    this.actionInProgress$.next(true);

    try {
      const result: ChatRoomEdge =
        await this.groupChatRoomService.createGroupChatRoom(this.groupGuid);

      if (!result?.node?.guid) {
        throw new Error('An error occurred, please try again later.');
      }

      this.router.navigateByUrl(`/chat/rooms/${result?.node?.guid}`);
    } catch (e: unknown) {
      console.error(e);
      this.actionInProgress$.next(false);
      this.toasterService.error(e);
    }
  }
}
