import { CommonModule as NgCommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '../../../../../../../common/common.module';
import { RouterModule } from '@angular/router';
import { ChatRoomMembersListItemDropdownComponent } from './chat-room-members-list-item-dropdown/chat-room-members-list-item-dropdown.component';
import { ChatRoomMemberEdge } from '../../../../../../../../graphql/generated.engine';

/**
 * Chat room members list item. - shows avatar, username, and an actions dropdown.
 */
@Component({
  selector: 'm-chatRoom__membersListItem',
  styleUrls: ['./chat-members-list-item.component.ng.scss'],
  templateUrl: './chat-members-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule,
    ChatRoomMembersListItemDropdownComponent,
  ],
  standalone: true,
})
export class ChatMembersListItemComponent {
  /** Member edge to display. */
  @Input() protected memberEdge: ChatRoomMemberEdge;
}
