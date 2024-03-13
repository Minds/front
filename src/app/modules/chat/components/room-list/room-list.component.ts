import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { ChatPendingRequestsWidgetComponent } from './pending-requests-widget/pending-requests-widget.component';
import { StartChatModalService } from '../start-chat-modal/start-chat-modal.service';
import { ChatRoomsListService } from '../../services/chat-rooms-list.service';
import { Observable, distinctUntilChanged, map, of } from 'rxjs';
import {
  ChatRoomEdge,
  PageInfo,
} from '../../../../../graphql/generated.engine';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ChatRoomListItemComponent } from './room-list-item/room-list-item.component';
import { CommonModule } from '../../../../common/common.module';
import { ChatActionCardComponent } from '../action-cards/action-card.component';
import { ActivatedRoute, Params } from '@angular/router';

/**
 * List of chat rooms.
 */
@Component({
  selector: 'm-chat__roomList',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    CommonModule,
    ChatPendingRequestsWidgetComponent,
    ChatRoomListItemComponent,
    ChatActionCardComponent,
  ],
  standalone: true,
})
export class ChatRoomListComponent implements OnInit {
  /** Whether a request is in progress to load / load more. */
  protected readonly inProgress$: Observable<
    boolean
  > = this.chatRoomsListService.inProgress$.pipe(distinctUntilChanged());

  /** Whether the component has been intiialized. */
  protected readonly initialized$: Observable<
    boolean
  > = this.chatRoomsListService.initialized$.pipe(distinctUntilChanged());

  /** Whether the paginated list has a next page. */
  protected readonly hasNextPage$: Observable<
    boolean
  > = this.chatRoomsListService.pageInfo$
    .pipe(map((pageInfo: PageInfo) => pageInfo?.hasNextPage))
    .pipe(distinctUntilChanged());

  protected edges$: Observable<ChatRoomEdge[]> = this.chatRoomsListService
    .edges$;

  /**
   * TODO: Wire this up to pending requests. We may want to have this variable
   * be the amount of requests and pass that through to the widget in the template.
   * Or share a replay out from a service to use in the widget, and just map it here.
   */
  protected hasPendingRequests$ = of(false);

  constructor(
    private startChatModal: StartChatModalService,
    private chatRoomsListService: ChatRoomsListService,
    private route: ActivatedRoute,
    protected elementRef: ElementRef
  ) {}

  /** ID of the currently selected room. */
  protected readonly currentRoomId$: Observable<
    string
  > = this.route.firstChild.params.pipe(
    distinctUntilChanged(),
    map((params: Params): string => params['roomId'] ?? '')
  );

  ngOnInit(): void {
    this.chatRoomsListService.init();
  }

  /**
   * Fetches more data from the server.
   * @returns { void }
   */
  protected fetchMore(): void {
    this.chatRoomsListService.fetchMore();
  }

  /**
   * Hande on start chat click.
   * @returns { Promise<void> }
   */
  protected async onStartChatClick(): Promise<void> {
    const result: string = await this.startChatModal.open(true);
    if (result) {
      this.chatRoomsListService.refetch();
    }
  }

  /**
   * Track by function for the list.
   * @param { ChatRoomEdge } edge The edge to track by.
   * @returns { string } The id of the edge.
   */
  protected trackBy(edge: ChatRoomEdge): string {
    return edge?.node?.id;
  }
}
