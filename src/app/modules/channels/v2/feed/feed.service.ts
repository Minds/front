import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import {
  FeedFilterSort,
  FeedFilterType,
} from '../../../../common/components/feed-filter/feed-filter.component';
import { distinctUntilChanged, map, switchAll, filter } from 'rxjs/operators';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ApiService } from '../../../../common/api/api.service';
import { Router } from '@angular/router';
import { NewPostsService } from '../../../../common/services/new-posts.service';

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
   * Scheduled count observable
   */
  readonly scheduledCount$: Observable<number>;

  /**
   * Filter change subscription
   */
  protected filterChangeSubscription: Subscription;

  /**
   * Constructor. Sets the main observable subscription.
   * @param service
   * @param api
   */
  constructor(
    public service: FeedsService,
    protected newPostsService: NewPostsService,
    protected api: ApiService,
    protected router: Router
  ) {
    //ojm
    // this.service.feed.subscribe(feed => {
    //   const firstItem: any = feed[0];
    //   if (firstItem) {
    //     this.newPostsService.setTimestamp(firstItem.getValue().time_created);
    //     console.log('ojm firstitm2', firstItem.getValue());
    //   }
    // });

    // Fetch when GUID or filter change
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

        const guid = values[0];
        const sort = values[1] === 'scheduled' ? 'scheduled' : 'container';
        const type = values[2];

        const endpoint = `api/v2/feeds/${sort}/${guid}/${type}`;

        this.service
          .setEndpoint(endpoint)
          .setLimit(12)
          .fetch();

        // ojm
        // START POLLING
        this.newPostsService
          .setPollIntervalMs(5000) // ojm temp
          // .setPollIntervalMs(60000) // poll every minute
          .setEndpoint(endpoint)
          .poll();
      });

    // Fetch scheduled count when GUID changes
    this.scheduledCount$ = this.guid$.pipe(
      distinctUntilChanged(),
      filter(guid => !!guid),
      map(guid => this.api.get(`api/v2/feeds/scheduled/${guid}/count`)),
      switchAll(),
      map(response => response.count)
    );
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

  /**
   * Handles activity deletion
   */
  onDelete(entity: any) {
    if (!entity || !entity.guid) {
      return;
    }

    this.service.deleteItem(entity, (item, entity) => item.urn === entity.urn);
  }
}
