import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
} from '@angular/core';
import { CommonModule } from '../../../../../../common/common.module';
import { ChatRoomMembersService } from '../../../../services/chat-room-members.service';
import { Observable, map } from 'rxjs';
import {
  ChatRoomMemberEdge,
  PageInfo,
} from '../../../../../../../graphql/generated.engine';
import { ChatMembersListItemComponent } from './chat-members-list-item/chat-members-list-item.component';

/**
 * List of members in a chat room.
 */
@Component({
  selector: 'm-chatRoom__membersList',
  styleUrls: ['./chat-members-list.component.ng.scss'],
  templateUrl: './chat-members-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, CommonModule, ChatMembersListItemComponent],
  standalone: true,
})
export class ChatMembersListComponent {
  /** GUID of the room. */
  @Input() protected roomGuid: string;

  /** Chat room members. - should be initialized by calling service init in the parent component. */
  protected readonly members$: Observable<ChatRoomMemberEdge[]> =
    this.chatRoomMembersService.edges$;

  /** Whether loading of chat members is initialized. */
  protected readonly initialized$: Observable<boolean> =
    this.chatRoomMembersService.initialized$;

  /** Whether loading of chat members is in progress. */
  protected readonly inProgress$: Observable<boolean> =
    this.chatRoomMembersService.inProgress$;

  /** Whether chat members list has a next page. */
  protected readonly hasNextPage$: Observable<boolean> =
    this.chatRoomMembersService.pageInfo$.pipe(
      map((pageInfo: PageInfo) => pageInfo?.hasNextPage)
    );

  constructor(
    private chatRoomMembersService: ChatRoomMembersService,
    protected elementRef: ElementRef
  ) {}

  /**
   * Fetch more chat members.
   * Called when user scrolls to the bottom of the list.
   * @returns { void }
   */
  protected fetchMore(): void {
    this.chatRoomMembersService.fetchMore();
  }
}
