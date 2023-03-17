import { Injectable, Self } from '@angular/core';
import { FeedsService } from '../../../common/services/feeds.service';
import { DynamicBoostExperimentService } from '../../experiments/sub-services/dynamic-boost-experiment.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoostLocation } from '../../boost/modal-v2/boost-modal-v2.types';
import { Session } from '../../../services/session';

/**
 * @description extra options for boost feed.
 */
export type BoostFeedOpts = {
  servedByGuid?: string;
};

@Injectable({ providedIn: 'root' })
export class BoostFeedService {
  public feed$: Observable<BehaviorSubject<Object>[]> = this.feedsService.feed;

  private initialised: boolean = false;
  private servedByGuid: string = null;

  constructor(
    @Self() private feedsService: FeedsService,
    private dynamicBoostExperiment: DynamicBoostExperimentService,
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

    const dynamicBoostExperimentActive: boolean = this.dynamicBoostExperiment.isActive();

    let params = dynamicBoostExperimentActive
      ? {
          location: BoostLocation.NEWSFEED,
        }
      : {
          rating: this.session.getLoggedInUser()?.boost_rating,
          rotator: 1,
        };

    if (opts.servedByGuid) {
      params['served_by_guid'] = this.servedByGuid;
    }

    params['show_boosts_after_x'] = 604800; // 1 week

    const endpoint: string = dynamicBoostExperimentActive
      ? 'api/v3/boosts/feed'
      : 'api/v2/boost/feed';

    await this.feedsService
      .setEndpoint(endpoint)
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

  public reset(): BoostFeedService {
    this.feedsService.clear();
    this.initialised = false;

    return this;
  }
}
