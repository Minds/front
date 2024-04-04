import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
  RouterModule,
} from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs';
import {
  ChatRoomEdge,
  PageInfo,
} from '../../../../../graphql/generated.engine';
import { ChatRequestsListService } from '../../services/chat-requests-list.service';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../common/common.module';
import { ChatRoomListItemComponent } from '../room-list/room-list-item/room-list-item.component';

/**
 * Request list for chat.
 */
@Component({
  selector: 'm-chat__requestList',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    CommonModule,
    ChatRoomListItemComponent,
    RouterModule,
  ],
  standalone: true,
})
export class ChatRequestListComponent {
  /** Whether a request is in progress to load / load more. */
  protected readonly inProgress$: Observable<boolean> = this
    .chatRequestsListService.inProgress$;

  /** Whether the component has been intiialized. */
  protected readonly initialized$: Observable<boolean> = this
    .chatRequestsListService.initialized$;

  /** Whether the paginated list has a next page. */
  protected readonly hasNextPage$: Observable<
    boolean
  > = this.chatRequestsListService.pageInfo$
    .pipe(map((pageInfo: PageInfo) => pageInfo?.hasNextPage))
    .pipe(distinctUntilChanged());

  protected edges$: Observable<ChatRoomEdge[]> = this.chatRequestsListService
    .edges$;

  /** Router events subscription. */
  private routerEventsSubscription: Subscription;

  constructor(
    private chatRequestsListService: ChatRequestsListService,
    private route: ActivatedRoute,
    private router: Router,
    protected elementRef: ElementRef
  ) {}

  /** ID of the currently selected room. */
  protected readonly currentRoomId$: BehaviorSubject<
    string
  > = new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.chatRequestsListService.init();
    this.currentRoomId$.next(this.route.snapshot.firstChild.params['roomId']);

    this.routerEventsSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: RouterEvent) => {
        this.currentRoomId$.next(
          this.route.snapshot.firstChild.params['roomId']
        );
      });
  }

  ngOnDestroy(): void {
    this.routerEventsSubscription?.unsubscribe();
  }

  /**
   * Fetches more data from the server.
   * @returns { void }
   */
  protected fetchMore(): void {
    this.chatRequestsListService.fetchMore();
  }

  /**
   * Track by function for the list.
   * @param { ChatRoomEdge } edge The edge to track by.
   * @returns { string } The id of the edge.
   */
  protected trackBy(edge: ChatRoomEdge): string {
    return edge?.node?.id;
  }

  /**
   * Handles back icon click.
   * @returns { void }
   */
  protected onBackIconClick(): void {
    this.router.navigateByUrl('/chat/rooms');
  }
}
