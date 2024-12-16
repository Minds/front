import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../../../../common/common.module';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  ChatMessageEdge,
  ChatRoomEdge,
  ChatRoomTypeEnum,
} from '../../../../../../../../graphql/generated.engine';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { ReportCreatorComponent } from '../../../../../../report/creator/creator.component';
import { ChatMessagesService } from '../../../../../services/chat-messages.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { SingleChatRoomService } from '../../../../../services/single-chat-room.service';
import { NgxFloatUiContentComponent } from 'ngx-float-ui';

/**
 * Message component dropdown for the chat room. Allows a user to perform actions
 * such as report and delete on a message.
 */
@Component({
  selector: 'm-chatRoomMessage__dropdown',
  styleUrls: ['./chat-room-message-dropdown.component.ng.scss'],
  templateUrl: './chat-room-message-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, CommonModule],
  standalone: true,
})
export class ChatRoomMessageDropdownComponent {
  /** Whether the dropdown displayed is to be for the owner of the message. */
  @Input() protected isMessageOwner: boolean = false;

  /** Edge of message. */
  @Input() protected messageEdge: ChatMessageEdge;

  /** Element to trigger ellipsis to show on hover. */
  @Input() protected hoverSourceElement: ElementRef;

  /** Viewchild of dropdown menu. */
  @ViewChild('dropdownMenuContent')
  dropdownMenuContent: NgxFloatUiContentComponent;

  /** Whether deletion is in progress. */
  protected deleteInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether the acting user can moderate this chat. */
  protected readonly canModerate$: Observable<boolean> =
    this.singleChatRoomService.chatRoom$.pipe(
      map((chatRoom: ChatRoomEdge): boolean => {
        return (
          chatRoom.node.roomType === ChatRoomTypeEnum.GroupOwned &&
          chatRoom.node.isUserRoomOwner
        );
      })
    );

  /**
   * Whether to force the showing of the dropdown. This is helpful so that
   * we can still show the ellipsis when the menu is open, but the
   * hover source element is not hovered.
   */
  protected dropdownMenuShown: boolean = false;

  constructor(
    private modalService: ModalService,
    private chatMessageService: ChatMessagesService,
    private singleChatRoomService: SingleChatRoomService
  ) {}

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
   * Handle on report click event. Will open the report modal.
   * @returns { Promise<void> }
   */
  protected async onReportClick(): Promise<void> {
    this.dropdownMenuContent.hide();

    await this.modalService.present(ReportCreatorComponent, {
      data: {
        entity: {
          urn: this.messageEdge.node.id,
          ...this.messageEdge.node,
        },
      },
    }).result;
  }

  /**
   * Handle on delete click event.
   * @returns { Promise<void> }
   */
  protected async onDeleteClick(): Promise<void> {
    this.dropdownMenuContent.hide();
    this.deleteInProgress$.next(true);
    await this.chatMessageService.removeChatMessage(this.messageEdge);
    this.deleteInProgress$.next(false);
  }
}
