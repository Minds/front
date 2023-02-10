import { Injectable, Self } from '@angular/core';
import { FeedsService } from '../../../common/services/feeds.service';
import { DynamicBoostExperimentService } from '../../experiments/sub-services/dynamic-boost-experiment.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoostLocation } from '../../boost/modal-v2/boost-modal-v2.types';
import { Session } from '../../../services/session';

@Injectable({ providedIn: 'root' })
export class BoostFeedService {
  public feed$: Observable<BehaviorSubject<Object>[]> = this.feedsService.feed;

  private initialised: boolean = false;

  constructor(
    @Self() private feedsService: FeedsService,
    private dynamicBoostExperiment: DynamicBoostExperimentService,
    private session: Session
  ) {}

  public async init(): Promise<void> {
    if (this.initialised) return;

    this.initialised = true;

    const dynamicBoostExperimentActive: boolean = this.dynamicBoostExperiment.isActive();

    let params = dynamicBoostExperimentActive
      ? {
          location: BoostLocation.NEWSFEED,
        }
      : {
          rating: this.session.getLoggedInUser()?.boost_rating,
          rotator: 1,
        };

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
}
