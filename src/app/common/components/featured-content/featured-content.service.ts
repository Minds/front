import { Injectable } from '@angular/core';
import {
  filter,
  first,
  mergeMap,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DynamicBoostExperimentService } from '../../../modules/experiments/sub-services/dynamic-boost-experiment.service';
import { BoostFeedService } from '../../../modules/newsfeed/services/boost-feed.service';

@Injectable()
export class FeaturedContentService {
  offset = 0;
  maximumOffset = 0;
  feedLength = 0;
  protected feedSubscription: Subscription;

  constructor(
    protected boostFeedService: BoostFeedService,
    private dynamicBoostExperiment: DynamicBoostExperimentService
  ) {}

  public async onInit() {
    await this.boostFeedService.init();

    this.feedSubscription = this.boostFeedService.feed$.subscribe(feed => {
      this.feedLength = feed.length;
      this.maximumOffset = this.feedLength - 1;
    });
  }

  async fetch() {
    return await this.boostFeedService.feed$
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
    this.boostFeedService.refreshFeed();
  }
}
