import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  map,
  take,
} from 'rxjs';
import { FeedsService } from '../../../../common/services/feeds.service';
import { SupermindConsoleService } from '../services/console.service';
import { SupermindState } from '../../supermind.types';

/**
 * Feed of all Superminds for users to explore.
 */
@Component({
  selector: 'm-supermind__exploreFeed',
  styleUrls: ['explore-feed.component.ng.scss'],
  templateUrl: './explore-feed.component.html',
  providers: [FeedsService],
})
export class SupermindConsoleExploreFeedComponent implements OnInit, OnDestroy {
  /** Whether pending supermind notice should be shown. */
  public readonly showPendingSupermindNotice$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Whether pending count request is in progress. */
  public readonly pendingCountRequestInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(true);

  /** Whether the component should be considered in its initial load phase. */
  public loading$: Observable<boolean> = combineLatest([
    this.inProgress$,
    this.pendingCountRequestInProgress$,
    this.feedsService.feed,
  ]).pipe(
    map(
      ([feedLoadInProgress, pendingCountRequestInProgress, feed]: [
        boolean,
        boolean,
        any[]
      ]) => {
        return (
          pendingCountRequestInProgress ||
          (feedLoadInProgress && feed.length < 1)
        );
      }
    )
  );

  // subscription to pending count.
  private pendingCountSubscription: Subscription;

  constructor(
    private service: SupermindConsoleService,
    private feedsService: FeedsService
  ) {}

  ngOnInit(): void {
    this.loadFeed();

    this.pendingCountSubscription = this.service
      .countByListType$(SupermindState.CREATED, 'inbox')
      .pipe(take(1))
      .subscribe((count: number) => {
        this.showPendingSupermindNotice$.next(count > 0);
        this.pendingCountRequestInProgress$.next(false);
      });
  }

  ngOnDestroy(): void {
    this.pendingCountSubscription?.unsubscribe();
  }

  /**
   * Displayed feed of boosts.
   * @returns { Observable<BehaviorSubject<Object>[]> } - feed to be async piped.
   */
  public get feed$(): Observable<BehaviorSubject<Object>[]> {
    return this.feedsService.feed;
  }

  /**
   * Whether the service has more boosts to display.
   * @returns { Observable<boolean> } - true if more boosts can be retrieved.
   */
  public get hasMore$(): Observable<boolean> {
    return this.feedsService.hasMore;
  }

  /**
   * True if currently in progress.
   * @returns { Observable<boolean> } - true if service is currently in progress.
   */
  public get inProgress$(): Observable<boolean> {
    return this.feedsService.inProgress;
  }

  /**
   * Dispatched get request for feed through feedsService.
   * @param { boolean } refresh - true if feed is being refreshed.
   * @return { Promise<boolean> } true if load request completes without errors.
   */
  private async loadFeed(refresh: boolean = false): Promise<boolean> {
    try {
      if (refresh) {
        this.feedsService.clear();
      }

      this.feedsService
        .setEndpoint('api/v3/newsfeed/superminds')
        .setLimit(12)
        .setOffset(0)
        .fetch();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Loads next elements in feed.
   * @returns { Promise<void> } - awaitable.
   */
  public async loadNext(): Promise<void> {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue()
    ) {
      this.feedsService.fetch(); // load the next 150 in the background
    }
    this.feedsService.loadMore();
  }

  /**
   * Track by function to optimize feed rendering - consumed in template for loop.
   * @param { number } index - index of entity in list.
   * @param { guid: string } item - item in the list.
   * @returns { string } guid to track by.
   */
  public trackEntityBy(index: number, item: { guid: string }): string {
    return item?.guid ?? undefined;
  }
}
