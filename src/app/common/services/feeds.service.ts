import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  interval,
  Observable,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  filter,
  first,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';
import { ApiService } from '../api/api.service';
import { BlockListService } from './block-list.service';
import { EntitiesService } from './entities.service';
import { StorageV2 } from '../../services/storage/v2';
import { FeedItemType } from '../../modules/newsfeed/feed/feed.component';
import { Location } from '@angular/common';

export const NEW_POST_POLL_INTERVAL = 30000;

export type InjectItem = {
  /**
   * the indexes in the feed this item should be inserted
   */
  indexes: number[] | ((index: number, feedLength: number) => boolean);
  type: FeedItemType;
};

export enum FeedAlgorithm {
  top = 'top',
  latest = 'latest',
  forYou = 'for-you',
  groups = 'groups',
}

/**
 * Enables the grabbing of data through observable feeds.
 */
@Injectable()
export class FeedsService implements OnDestroy {
  /**
   * a unique identifier for this feed that will change everytime the feed is refreshed.
   * This is used to help persisting feed items consistently
   */
  id$: BehaviorSubject<number> = new BehaviorSubject(undefined);
  limit: BehaviorSubject<number> = new BehaviorSubject(12);
  offset: BehaviorSubject<number> = new BehaviorSubject(0);
  fallbackAt: number | null = null;
  fallbackAtIndex: BehaviorSubject<number | null> = new BehaviorSubject(null);
  pageSize: Observable<number>;
  pagingToken: string = '';
  canFetchMore: boolean = true;
  endpoint: string = '';
  countEndpoint: string = '';
  params: any = { sync: 1 };
  castToActivities: boolean = false;
  exportUserCounts: boolean = false;
  fromTimestamp: string = '';
  /**
   * whether or not to filter out unseen entities
   */
  unseen: boolean = false;

  rawFeed: BehaviorSubject<Object[]> = new BehaviorSubject([]);
  feed: Observable<BehaviorSubject<Object>[]>;
  inProgress: BehaviorSubject<boolean> = new BehaviorSubject(true);
  fetchInProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasMore: Observable<boolean>;
  blockListSubscription: Subscription;
  /**
   * whether counting is in progress
   */
  countInProgress$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  /**
   * The subscription for the new posts polling interval
   */
  newPostWatcherSubscription: Subscription;
  /**
   * The number indicating how many new posts exist since we last checked at {newPostsLastCheckedAt}
   */
  newPostsCount$: BehaviorSubject<number> = new BehaviorSubject(0);
  /**
   * The last time we checked for new posts
   */
  newPostsLastCheckedAt: number;
  /**
   * feed length
   */
  feedLength: number;
  /**
   * whether the feed is rehydrated. Used to not rehydrate again
   */
  rehydrated = false;
  /**
   * whether the feed is rehydrated. Used to not rehydrate again
   */
  cachingEnabled = false;
  /**
   * a list of items that are injected in this feed
   */
  injectItems: InjectItem[] = [];
  /**
   * the subscription for the persist functionality
   */
  persistSubscription: Subscription;

  constructor(
    protected client: Client,
    protected api: ApiService,
    protected session: Session,
    protected entitiesService: EntitiesService,
    protected blockListService: BlockListService,
    protected storage: StorageV2,
    protected location: Location
  ) {
    this.pageSize = this.offset.pipe(
      map((offset) => this.limit.getValue() + offset)
    );
    this.feed = this.rawFeed.pipe(
      tap((feed) => {
        if (feed.length) this.inProgress.next(true);
      }),
      switchMap(async (feed) => {
        return feed.slice(0, await this.pageSize.pipe(first()).toPromise());
      }),
      switchMap((feed) =>
        this.entitiesService
          .setCastToActivities(this.castToActivities)
          .setExportUserCounts(this.exportUserCounts)
          .getFromFeed(feed)
      ),
      tap((feed) => {
        if (feed.length && this.fallbackAt) {
          for (let i = 0; i < feed.length; i++) {
            const entity: any = feed[i].getValue();

            if (
              entity &&
              entity.time_created &&
              entity.time_created < this.fallbackAt
            ) {
              this.fallbackAtIndex.next(i);
              break;
            }
          }
        }
      }),
      tap((feed) => {
        this.feedLength = feed.length;

        if (feed.length)
          // We should have skipped but..
          this.inProgress.next(false);
      })
    );

    // Trigger a re-run of the above pipe on blockedList emission.
    this.blockListSubscription = blockListService.blocked.subscribe((block) => {
      this.rawFeed.next(this.rawFeed.getValue());
    });

    this.hasMore = combineLatest(
      this.rawFeed,
      this.inProgress,
      this.offset
    ).pipe(
      map((values) => {
        const feed = values[0];
        const inProgress = values[1];
        const offset = values[2];
        return inProgress || feed.length > offset;
      })
    );
  }

  ngOnDestroy(): void {
    this.blockListSubscription?.unsubscribe();
    this.newPostWatcherSubscription?.unsubscribe();
    this.persistSubscription?.unsubscribe();
  }

  /**
   * Sets the endpoint for this instance.
   * @param { string } endpoint - the endpoint for this instance. For example `api/v1/entities/owner`.
   */
  setEndpoint(endpoint: string): FeedsService {
    this.endpoint = endpoint;
    return this;
  }

  /**
   * Sets the count endpoint for this instance.
   * @param { string } endpoint - the count endpoint for this instance
   */
  setCountEndpoint(endpoint: string): FeedsService {
    this.countEndpoint = endpoint;
    return this;
  }

  /**
   * Sets the limit to be returned per next() call.
   * @param { number } limit - the limit to retrieve.
   */
  setLimit(limit: number): FeedsService {
    this.limit.next(limit);
    return this;
  }

  /**
   * Sets parameters to be used.
   * @param { Object } params - parameters to be used.
   */
  setParams(params): FeedsService {
    this.params = params;
    if (!params.sync) {
      this.params.sync = 1;
    }
    return this;
  }

  /**
   * Sets the offset of the request
   * @param { number } offset - the offset of the request.
   */
  setOffset(offset: number): FeedsService {
    this.offset.next(offset);
    return this;
  }

  /**
   * Sets castToActivities
   * @param { boolean } cast - whether or not to set as_activities to true.
   */
  setCastToActivities(cast: boolean): FeedsService {
    this.castToActivities = cast;
    return this;
  }

  /**
   * Sets exportUserCounts
   * @param { boolean } export - whether or not to export user's subscribers_count and subscriptions_count.
   */
  setExportUserCounts(value: boolean): FeedsService {
    this.exportUserCounts = value;
    return this;
  }

  /**
   * Sets fromTimestamp
   * NOTE: "from" refers to the starting point (top) of the feed,
   * not chronological time. Since by default feeds start with the most recent activity,
   * "from" should be the most recent date
   * @param {string } export - whether or not to export user's subscribers_count and subscriptions_count.
   */
  setFromTimestamp(value: string): FeedsService {
    this.fromTimestamp = value;
    return this;
  }

  /**
   * Sets unseen
   * @param { boolean } value - whether or not to filter out unseen entities
   */
  setUnseen(value: boolean): FeedsService {
    this.unseen = value;
    return this;
  }

  /**
   * Sets whether the feed should use cache or not
   * @param { boolean } value
   */
  setCachingEnabled(value: boolean) {
    this.cachingEnabled = value;
    return this;
  }

  /**
   * Fetches the data.
   */
  fetch(refresh: boolean = false): Promise<any> {
    /**
     * if caching was enabled try to rehydrate and check for new posts
     */
    if (this.cachingEnabled && !this.rehydrated) {
      const rehydratedFeed = this._rehydrateAndPersist();

      if (rehydratedFeed) {
        this.checkForNewPosts();

        return;
      }
    }

    this.fetchInProgress$.next(true);
    if (!this.offset.getValue()) {
      this.inProgress.next(true);
    }

    const endpoint = this.endpoint;

    let fromTimestamp = this.pagingToken
      ? this.pagingToken
      : this.fromTimestamp;

    const oldCount = this.newPostsCount$.getValue();
    const oldTimestamp = this.newPostsLastCheckedAt;

    if (refresh) {
      fromTimestamp = '';
      this.newPostsLastCheckedAt = Date.now();
      this.newPostsCount$.next(0);
    }

    if (!this.newPostsLastCheckedAt) {
      this.newPostsLastCheckedAt = Date.now();
    }

    return this.client
      .get(this.endpoint, {
        ...this.params,
        ...{
          limit: 150, // Over 12 scrolls
          as_activities: this.castToActivities ? 1 : 0,
          export_user_counts: this.exportUserCounts ? 1 : 0,
          unseen: this.unseen,
          from_timestamp: fromTimestamp,
        },
      })
      .then((response: any) => {
        if (this.endpoint !== endpoint) {
          // Avoid race conditions if endpoint changes
          return;
        }

        if (!response.entities && response.activity) {
          response.entities = response.activity;
        } else if (!response.entities && response.users) {
          response.entities = response.users;
        } else if (!response.entities && response.boosts) {
          response.entities = response.boosts;
        }

        if (response.entities?.length) {
          this.fallbackAt = response['fallback_at'];
          this.fallbackAtIndex.next(null);
          if (refresh) {
            this.rawFeed.next(response.entities);
            this.id$.next(Math.random());
          } else {
            if (!this.id$.getValue()) {
              this.id$.next(Math.random());
            }
            this.rawFeed.next(
              this.rawFeed.getValue().concat(response.entities)
            );
          }
          this.pagingToken = response['load-next'];

          if (!this.pagingToken && !response['has_more']) {
            this.canFetchMore = false;
          }
        } else {
          this.canFetchMore = false;
        }
      })
      .catch((e) => {
        this.newPostsLastCheckedAt = oldTimestamp;
        this.newPostsCount$.next(oldCount);
      })
      .finally(() => {
        if (!this.offset.getValue()) {
          this.inProgress.next(false);
        }
        this.fetchInProgress$.next(false);
      });
  }

  /**
   * Counts posts created from a timestamp on
   */
  count(fromTimestamp: number = Date.now()): Observable<number> {
    if (!this.countEndpoint) {
      throw new Error('[FeedsService] countEndpoint missing');
    }

    this.countInProgress$.next(true);

    return this.api
      .get(this.countEndpoint, {
        ...this.params,
        ...{
          limit: 100,
          from_timestamp: fromTimestamp,
        },
      })
      .pipe(tap(() => this.countInProgress$.next(false)))
      .pipe(map((response) => response?.count));
  }

  /**
   * To be called upload loading more data
   */
  loadMore(): FeedsService {
    if (!this.inProgress.getValue()) {
      this.setOffset(this.limit.getValue() + this.offset.getValue());
      this.rawFeed.next(this.rawFeed.getValue());
    }
    return this;
  }

  /**
   * Loads next batch. Used by infinite scroll component
   */
  loadNext() {
    if (
      this.canFetchMore &&
      !this.inProgress.getValue() &&
      this.offset.getValue()
    ) {
      this.fetch(); // load the next 150 in the background
    }

    this.loadMore();
  }

  deleteItem(obj: any, comparatorFn: (item, obj) => boolean): FeedsService {
    const feed: any[] = this.rawFeed.getValue();
    feed.forEach((item, index) => {
      if (comparatorFn(item, obj)) {
        feed.splice(index, 1);
      }
    });
    this.rawFeed.next(feed);
    return this;
  }

  /**
   * To clear data.
   */
  clear(clearFeed: boolean = true): FeedsService {
    this.fallbackAt = null;
    this.fallbackAtIndex.next(null);
    this.offset.next(0);
    this.pagingToken = '';
    this.newPostsLastCheckedAt = null;
    this.newPostsCount$.next(0);
    if (clearFeed) {
      this.rawFeed.next([]);
    }
    return this;
  }

  async destroy() {}

  static _(
    client: Client,
    api: ApiService,
    session: Session,
    entitiesService: EntitiesService,
    blockListService: BlockListService,
    storage: StorageV2,
    location: Location
  ) {
    return new FeedsService(
      client,
      api,
      session,
      entitiesService,
      blockListService,
      storage,
      location
    );
  }

  /**
   * Checks for new posts and updates the counter
   * @returns { void }
   */
  private async checkForNewPosts() {
    if (!this.countEndpoint) return null;

    const count = await this.count(this.newPostsLastCheckedAt).toPromise();
    if (count) {
      this.newPostsCount$.next(this.newPostsCount$.getValue() + count);
    }
    this.newPostsLastCheckedAt = Date.now();
  }

  /**
   * watch for new posts by polling the count endpoint
   * @returns { Function } a function to unsubscribe the subscription
   */
  public watchForNewPosts(): () => void {
    this.newPostWatcherSubscription?.unsubscribe();
    this.newPostWatcherSubscription = interval(NEW_POST_POLL_INTERVAL)
      // only poll when tab is active
      .pipe(filter(() => document.hasFocus()))
      .pipe(switchMap(() => this.count(this.newPostsLastCheckedAt)))
      .subscribe((count) => {
        if (count) {
          this.newPostsCount$.next(this.newPostsCount$.getValue() + count);
        }
        this.newPostsLastCheckedAt = Date.now();
      });
    return () => this.newPostWatcherSubscription?.unsubscribe();
  }

  /**
   * persists the feed state to memory
   * @returns { void }
   */
  private _persist(feed = this.rawFeed.getValue()) {
    if (!feed?.length) return;

    return this.storage.memory.setFeedState(
      this.endpoint,
      this.location.path(),
      {
        rawFeed: feed,
        id: this.id$.getValue(),
        fallbackAt: this.fallbackAt,
        pagingToken: this.pagingToken,
        newPostsLastCheckedAt: this.newPostsLastCheckedAt,
        fallbackAtIndex: this.fallbackAtIndex.getValue(),
        offset: this.offset.getValue(),
        limit: this.limit.getValue(),
        newPostsCount: this.newPostsCount$.getValue(),
      }
    );
  }

  /**
   * rehydrates the feed state from memory
   * @returns { void }
   */
  private _rehydrateAndPersist(update = true) {
    const inMemoryFeedState = this.storage.memory.getFeedState(
      this.endpoint,
      this.location.path()
    );

    if (inMemoryFeedState && update) {
      this.id$.next(inMemoryFeedState.id);
      this.fallbackAt = inMemoryFeedState.fallbackAt;
      this.fallbackAtIndex.next(inMemoryFeedState.fallbackAtIndex);
      this.offset.next(inMemoryFeedState.offset);
      this.pagingToken = inMemoryFeedState.pagingToken;
      this.newPostsLastCheckedAt = inMemoryFeedState.newPostsLastCheckedAt;
      this.limit.next(inMemoryFeedState.limit);
      this.newPostsCount$.next(inMemoryFeedState.newPostsCount);
      this.rawFeed.next(inMemoryFeedState.rawFeed || []);
      this.rehydrated = true;
    }

    if (!this.persistSubscription) {
      this.persistSubscription = this.feed
        .pipe(debounceTime(1000))
        .subscribe((feed) => {
          if (feed.length) {
            this._persist(
              feed.map((entity$) => {
                // TODO: better type
                const entity: any = entity$.getValue();
                return {
                  guid: entity.guid,
                  owner_guid: entity.ownerObj?.guid,
                  timestamp: null,
                  urn: entity.urn,
                  entity,
                };
              })
            );
          }
        });
    }

    return inMemoryFeedState;
  }
}
