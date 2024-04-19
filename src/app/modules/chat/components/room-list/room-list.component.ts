import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ChatPendingRequestsWidgetComponent } from './pending-requests-widget/pending-requests-widget.component';
import { StartChatModalService } from '../start-chat-modal/start-chat-modal.service';
import { ChatRoomsListService } from '../../services/chat-rooms-list.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  of,
} from 'rxjs';
import {
  ChatRoomEdge,
  PageInfo,
} from '../../../../../graphql/generated.engine';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ChatRoomListItemComponent } from './room-list-item/room-list-item.component';
import { CommonModule } from '../../../../common/common.module';
import { ChatActionCardComponent } from '../action-cards/action-card.component';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { TotalChatRoomInviteRequestsService } from '../../services/total-chat-room-invite-requests.service';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * List of chat rooms.
 */
@Component({
  selector: 'm-chat__roomList',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TotalChatRoomInviteRequestsService],
  imports: [
    NgCommonModule,
    CommonModule,
    ChatPendingRequestsWidgetComponent,
    ChatRoomListItemComponent,
    ChatActionCardComponent,
  ],
  standalone: true,
})
export class ChatRoomListComponent implements OnInit, OnDestroy {
  /** Whether a request is in progress to load / load more. */
  protected readonly inProgress$: Observable<boolean> =
    this.chatRoomsListService.inProgress$.pipe(distinctUntilChanged());

  /** Whether the component has been intiialized. */
  protected readonly initialized$: Observable<boolean> = combineLatest([
    this.chatRoomsListService.initialized$,
    this.totalChatRequestsService.initialized$,
  ]).pipe(
    map(([chatRoomsInit, totalChatInit]: [boolean, boolean]) => {
      return chatRoomsInit && totalChatInit;
    })
  );

  /** Whether the paginated list has a next page. */
  protected readonly hasNextPage$: Observable<boolean> =
    this.chatRoomsListService.pageInfo$
      .pipe(map((pageInfo: PageInfo) => pageInfo?.hasNextPage))
      .pipe(distinctUntilChanged());

  protected edges$: Observable<ChatRoomEdge[]> =
    this.chatRoomsListService.edges$;

  /** Router events subscription. */
  private routerEventsSubscription: Subscription;

  /** Total chat requests from service. */
  protected hasPendingRequests$: Observable<boolean> =
    this.totalChatRequestsService.totalRequests$.pipe(
      map((totalRequests: number): boolean => Boolean(totalRequests))
    );

  constructor(
    private startChatModal: StartChatModalService,
    private chatRoomsListService: ChatRoomsListService,
    private totalChatRequestsService: TotalChatRoomInviteRequestsService,
    private permissionsService: PermissionsService,
    private toaster: ToasterService,
    private route: ActivatedRoute,
    private router: Router,
    protected elementRef: ElementRef
  ) {}

  /** ID of the currently selected room. */
  protected readonly currentRoomId$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.chatRoomsListService.init();
    this.totalChatRequestsService.init();

    this.chatRoomsListService.setIsViewingChatRoomList(true);
    this.currentRoomId$.next(this.route.snapshot.firstChild.params['roomId']);

    this.routerEventsSubscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: RouterEvent) => {
        this.currentRoomId$.next(
          this.route.snapshot.firstChild.params['roomId']
        );
      });
  }

  ngOnDestroy(): void {
    this.chatRoomsListService.setIsViewingChatRoomList(false);
    this.routerEventsSubscription?.unsubscribe();
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
    if (!this.permissionsService.canCreateChatRoom()) {
      this.toaster.warn("You don't have permission to create a chat room");
      return;
    }
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
