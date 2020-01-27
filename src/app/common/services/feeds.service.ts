import { Injectable } from '@angular/core';

import { Client } from '../../services/api/client';
import { Session } from '../../services/session';

import { EntitiesService } from './entities.service';
import { BlockListService } from './block-list.service';

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { switchMap, map, tap, first } from 'rxjs/operators';

/**
 * Enables the grabbing of data through observable feeds.
 */
@Injectable()
export class FeedsService {
  limit: BehaviorSubject<number> = new BehaviorSubject(12);
  offset: BehaviorSubject<number> = new BehaviorSubject(0);
  fallbackAt: number | null = null;
  fallbackAtIndex: BehaviorSubject<number | null> = new BehaviorSubject(null);
  pageSize: Observable<number>;
  pagingToken: string = '';
  canFetchMore: boolean = true;
  endpoint: string = '';
  params: any = { sync: 1 };
  castToActivities: boolean = false;
  exportUserCounts: boolean = false;

  rawFeed: BehaviorSubject<Object[]> = new BehaviorSubject([]);
  feed: Observable<BehaviorSubject<Object>[]>;
  inProgress: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hasMore: Observable<boolean>;

  constructor(
    protected client: Client,
    protected session: Session,
    protected entitiesService: EntitiesService,
    protected blockListService: BlockListService
  ) {
    this.pageSize = this.offset.pipe(
      map(offset => this.limit.getValue() + offset)
    );

    this.feed = this.rawFeed.pipe(
      tap(feed => {
        if (feed.length) this.inProgress.next(true);
      }),
      switchMap(async feed => {
        return feed.slice(0, await this.pageSize.pipe(first()).toPromise());
      }),
      switchMap(feed =>
        this.entitiesService
          .setCastToActivities(this.castToActivities)
          .setExportUserCounts(this.exportUserCounts)
          .getFromFeed(feed)
      ),
      tap(feed => {
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
      tap(feed => {
        if (feed.length)
          // We should have skipped but..
          this.inProgress.next(false);
      })
    );

    this.hasMore = combineLatest(
      this.rawFeed,
      this.inProgress,
      this.offset
    ).pipe(
      map(values => {
        const feed = values[0];
        const inProgress = values[1];
        const offset = values[2];
        return inProgress || feed.length > offset;
      })
    );
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
   * Fetches the data.
   */
  fetch(): Promise<any> {
    if (!this.offset.getValue()) {
      this.inProgress.next(true);
    }
    return this.client
      .get(this.endpoint, {
        ...this.params,
        ...{
          limit: 150, // Over 12 scrolls
          as_activities: this.castToActivities ? 1 : 0,
          export_user_counts: this.exportUserCounts ? 1 : 0,
          from_timestamp: this.pagingToken,
        },
      })
      .then((response: any) => {
        if (!this.offset.getValue()) {
          this.inProgress.next(false);
        }
        if (!response.entities && response.activity) {
          response.entities = response.activity;
        }
        if (response.entities.length) {
          this.fallbackAt = response['fallback_at'];
          this.fallbackAtIndex.next(null);
          this.rawFeed.next(this.rawFeed.getValue().concat(response.entities));
          this.pagingToken = response['load-next'];
        } else {
          this.canFetchMore = false;
        }
      })
      .catch(e => console.log(e));
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
   * To clear data.
   */
  clear(): FeedsService {
    this.fallbackAt = null;
    this.fallbackAtIndex.next(null);
    this.offset.next(0);
    this.pagingToken = '';
    this.rawFeed.next([]);
    return this;
  }

  async destroy() {}

  static _(
    client: Client,
    session: Session,
    entitiesService: EntitiesService,
    blockListService: BlockListService
  ) {
    return new FeedsService(client, session, entitiesService, blockListService);
  }
}
