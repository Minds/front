import { Injectable, OnDestroy } from '@angular/core';
import { filter, first, mergeMap, skip, switchMap, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
  BoostFeedOpts,
  BoostFeedService,
} from '../../../modules/newsfeed/services/boost-feed.service';

/**
 * Used to get a boosted post to be displayed
 * via the featured content component
 */
@Injectable()
export class FeaturedContentService implements OnDestroy {
  offset = 0;
  maximumOffset = 0;
  feedLength = 0;
  protected feedSubscription: Subscription;

  constructor(protected boostFeedService: BoostFeedService) {}

  /**
   * Init the boost feed service and subscribe to feed.
   * @param { BoostFeedOpts } opts - extra boost opts for service.
   * @returns { Promise<void> }
   */
  public async onInit(opts: BoostFeedOpts = {}): Promise<void> {
    this.boostFeedService.init(opts);

    this.feedSubscription = this.boostFeedService.feed$.subscribe(feed => {
      this.feedLength = feed.length;
      this.maximumOffset = this.feedLength - 1;
    });
  }

  /**
   * Returns the first entity in the specified boost feed
   * */
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

  public ngOnDestroy() {
    this.boostFeedService.reset();
    this.feedSubscription?.unsubscribe();
  }
}
