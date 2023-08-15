import { Injectable, Self } from '@angular/core';
import { FeedsService } from '../../../common/services/feeds.service';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { BoostLocation } from '../../boost/modal-v2/boost-modal-v2.types';
import { Session } from '../../../services/session';

/**
 * @description extra options for boost feed.
 */
export type BoostFeedOpts = {
  servedByGuid?: string;
  force_boost_enabled?: boolean;
};

@Injectable({ providedIn: 'root' })
export class BoostFeedService {
  public feed$: Observable<
    BehaviorSubject<Object>[]
  > = this.feedsService.feed.pipe(shareReplay());

  private initialised: boolean = false;
  private servedByGuid: string = null;

  constructor(
    @Self() private feedsService: FeedsService,
    private session: Session
  ) {}

  /**
   * Initialize boost feed. If serving GUID differs to one in class state, will trigger a reload.
   * @param { BoostFeedOpts } opts - opts to pass in to determine which feed to load.
   * @returns { Promise<void> }
   */
  public async init(opts: BoostFeedOpts = {}): Promise<void> {
    if (this.initialised && this.servedByGuid === opts.servedByGuid) {
      return;
    }

    this.initialised = true;
    this.servedByGuid = opts.servedByGuid;

    let params: Object = {
      location: BoostLocation.NEWSFEED,
    };

    if (opts.servedByGuid) {
      params['served_by_guid'] = this.servedByGuid;
    }

    await this.feedsService
      .setEndpoint('api/v3/boosts/feed')
      .setParams(params)
      .setLimit(12)
      .setOffset(0)
      .fetch();
  }

  public refreshFeed(): void {
    if (this.feedsService.inProgress.getValue()) {
      return;
    }

    this.feedsService.clear();
    this.feedsService.fetch();
  }

  /**
   * Load next items in feed - will hydrate next 12 or get next 150 if needed.
   * @returns { void }
   */
  public loadNext(): void {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue() >= this.feedsService.feedLength
    ) {
      this.feedsService.fetch(); // load the next 150 in the background
    }
    this.feedsService.loadMore();
  }

  public reset(): BoostFeedService {
    this.feedsService.clear();
    this.initialised = false;

    return this;
  }
}
