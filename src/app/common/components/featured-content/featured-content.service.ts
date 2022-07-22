import { Injectable } from '@angular/core';
import { filter, first, switchMap, mergeMap, skip, take } from 'rxjs/operators';
import { FeedsService } from '../../services/feeds.service';
import { Subscription } from 'rxjs';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { ApiResource } from '../../api/api-resource.service';

@Injectable()
export class FeaturedContentService {
  offset = 0;
  maximumOffset = 0;
  feedLength = 0;
  protected feedSubscription: Subscription;

  featuredContentFeedQuery = this.apiResource.query('api/v2/boost/feed', {
    cachePolicy: ApiResource.CachePolicy.cacheFirst,
    cacheStorage: ApiResource.CacheStorage.Memory,
  });

  constructor(
    protected feedsService: FeedsService,
    private experiments: ExperimentsService,
    private apiResource: ApiResource
  ) {
    this.onInit();
  }

  onInit() {
    this.feedSubscription = this.feedsService.feed.subscribe(feed => {
      this.feedLength = feed.length;
      this.maximumOffset = this.feedLength - 1;
    });

    this.feedsService.setParams({ show_boosts_after_x: 604800 }); // 1 week

    this.feedsService
      .setLimit(12)
      .setOffset(0)
      .setEndpoint('api/v2/boost/feed')
      .setFeedQuery(this.featuredContentFeedQuery)
      .fetch();
  }

  async fetch(slot: number) {
    return await this.feedsService.feed
      .pipe(
        filter(entities => entities.length > 0),
        mergeMap(feed => feed), // Convert feed array to stream
        skip(slot - 1), // TODO: fixme this isn't right
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
