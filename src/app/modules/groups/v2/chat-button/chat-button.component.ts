import { Component, Input } from '@angular/core';
import { CreateChatRoomService } from '../../../chat/services/create-chat-room.service';
import { ChatRoomTypeEnum } from '../../../../../graphql/generated.engine';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Router } from '@angular/router';

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
    private createChatRoomService: CreateChatRoomService,
    private toasterService: ToasterService,
    private router: Router
  ) {}

  /**
   * Handles the click event.
   * @returns { Promise<void> }
   */
  protected async handleClick(): Promise<void> {
    this.actionInProgress$.next(true);

    try {
      const chatRoomGuid: string =
        await this.createChatRoomService.createChatRoom(
          [],
          ChatRoomTypeEnum.GroupOwned,
          this.groupGuid
        );

      if (!chatRoomGuid) {
        throw new Error('An error occurred, please try again later.');
      }

      this.router.navigateByUrl(`/chat/rooms/${chatRoomGuid}`);
    } catch (e: unknown) {
      console.error(e);
      this.actionInProgress$.next(false);
      this.toasterService.error(e);
    }
  }
}
