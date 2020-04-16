import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import {
  FeedFilterSort,
  FeedFilterType,
} from '../../../../common/components/feed-filter/feed-filter.component';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FeedsService } from '../../../../common/services/feeds.service';

/**
 * Feed component service, handles filtering and pagination
 */
@Injectable()
export class FeedService {
  /**
   * Channel GUID state
   */
  readonly guid$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Type state
   */
  readonly sort$: BehaviorSubject<FeedFilterSort> = new BehaviorSubject<
    FeedFilterSort
  >('latest');

  /**
   * Filter type state
   */
  readonly type$: BehaviorSubject<FeedFilterType> = new BehaviorSubject<
    FeedFilterType
  >('activities');

  /**
   * Filter change subscription
   */
  protected filterChangeSubscription: Subscription;

  /**
   * Constructor. Sets the main observable subscription.
   */
  constructor(public service: FeedsService) {
    this.filterChangeSubscription = combineLatest([
      this.guid$,
      this.sort$,
      this.type$,
    ])
      .pipe(distinctUntilChanged((a, b) => a.join(':') === b.join(':')))
      .subscribe(values => {
        this.service.clear();

        if (!values[0] || !values[1] || !values[2]) {
          return;
        }

        const endpoint = `api/v2/feeds`;
        const guid = values[0];
        const sort = values[1] === 'scheduled' ? 'scheduled' : 'container';
        const type = values[2];

        this.service
          .setEndpoint(`${endpoint}/${sort}/${guid}/${type}`)
          .setLimit(12)
          .fetch();
      });
  }

  /**
   * Service cleanup
   */
  ngOnDestroy() {
    if (this.filterChangeSubscription) {
      this.filterChangeSubscription.unsubscribe();
    }
  }

  /**
   * Load next batch of entities
   */
  loadNext() {
    if (
      this.service.canFetchMore &&
      !this.service.inProgress.getValue() &&
      this.service.offset.getValue()
    ) {
      this.service.fetch(); // load the next 150 in the background
    }

    this.service.loadMore();
  }
}
