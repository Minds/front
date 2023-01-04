import { Injectable } from '@angular/core';
import { filter, first, switchMap, mergeMap, skip, take } from 'rxjs/operators';
import { FeedsService } from '../../services/feeds.service';
import { Subscription } from 'rxjs';
import { DynamicBoostExperimentService } from '../../../modules/experiments/sub-services/dynamic-boost-experiment.service';
import { BoostLocation } from '../../../modules/boost/modal-v2/boost-modal-v2.types';

@Injectable()
export class FeaturedContentService {
  offset = 0;
  maximumOffset = 0;
  feedLength = 0;
  protected feedSubscription: Subscription;

  constructor(
    protected feedsService: FeedsService,
    private dynamicBoostExperiment: DynamicBoostExperimentService
  ) {
    this.onInit();
  }

  onInit() {
    this.feedSubscription = this.feedsService.feed.subscribe(feed => {
      this.feedLength = feed.length;
      this.maximumOffset = this.feedLength - 1;
    });

    const dynamicBoostExperimentActive: boolean = this.dynamicBoostExperiment.isActive();
    let params = dynamicBoostExperimentActive
      ? {
          location: BoostLocation.NEWSFEED,
          show_boosts_after_x: 604800,
        }
      : {
          show_boosts_after_x: 604800, // 1 week
        };

    const endpoint: string = dynamicBoostExperimentActive
      ? 'api/v3/boosts/feed'
      : 'api/v2/boost/feed';

    this.feedsService
      .setLimit(12)
      .setOffset(0)
      .setParams(params)
      .setEndpoint(endpoint)
      .fetch();
  }

  async fetch() {
    return await this.feedsService.feed
      .pipe(
        filter(entities => entities.length > 0),
        mergeMap(feed => feed), // Convert feed array to stream
        skip(this.offset++),
        take(1),
        switchMap(async entity => {
          if (!entity) {
            return false;
          } else {
            const resolvedEntity = await entity.pipe(first()).toPromise();
            this.resetOffsetAtEndOfStream();
            return resolvedEntity;
          }
        })
      )
      .toPromise();
  }

  protected resetOffsetAtEndOfStream() {
    if (this.offset >= this.maximumOffset) {
      this.offset = 0;
      this.fetchNextFeed();
    }
  }

  protected fetchNextFeed() {
    if (!this.feedsService.inProgress.getValue()) {
      this.feedsService.clear();
      this.feedsService.fetch();
    }
  }
}
