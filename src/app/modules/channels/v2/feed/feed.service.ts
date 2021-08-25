import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Observable,
  Subscription,
} from 'rxjs';
import {
  FeedFilterSort,
  FeedFilterType,
} from '../../../../common/components/feed-filter/feed-filter.component';
import {
  distinctUntilChanged,
  map,
  switchAll,
  filter,
  catchError,
} from 'rxjs/operators';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ApiService } from '../../../../common/api/api.service';
import { Router } from '@angular/router';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { ChannelsV2Service } from '../channels-v2.service';

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
    protected api: ApiService,
    protected router: Router,
    private toast: FormToastService,
    protected channelsService: ChannelsV2Service
  ) {
    // Fetch when GUID or filter change
    this.filterChangeSubscription = combineLatest([
      this.guid$,
      this.sort$,
      this.type$,
      this.channelsService.query$,
    ])
      .pipe(distinctUntilChanged((a, b) => a.join(':') === b.join(':')))
      .subscribe(values => {
        this.service.clear();

        if (!values[0] || !values[1] || !values[2]) {
          return;
        }

        const endpoint = `api/v2/feeds`;
        const guid = values[0];
        let sort = values[1] === 'scheduled' ? 'scheduled' : 'container';
        const type = values[2];
        const query = values[3];

        if (query) {
          sort = 'container';

          const params: any = {
            period: '1y',
            all: 1,
            query: query,
            sync: 1,
            force_public: 1,
          };
          this.service.setParams(params);
        } else {
          this.service.setParams({ query: '' });
        }

        this.service
          .setEndpoint(`${endpoint}/${sort}/${guid}/${type}`)
          .setLimit(12)
          .fetch();
      });

    // Fetch scheduled count when GUID changes
    this.scheduledCount$ = this.guid$.pipe(
      distinctUntilChanged(),
      filter(guid => !!guid),
      map(guid => this.api.get(`api/v2/feeds/scheduled/${guid}/count`)),
      switchAll(),
      map(response => response.count),
      catchError(e => {
        if (this.router.url.indexOf('/scheduled') !== -1) {
          this.toast.error(e.message ?? e);
        }
        return EMPTY;
      })
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
