import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ApiService } from '../../../../common/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../group.service';
import {
  DEFAULT_GROUP_FEED_ALGORITHM,
  DEFAULT_GROUP_FEED_TYPE_FILTER,
  GroupFeedAlgorithm,
  GroupFeedTypeFilter,
  isOfTypeGroupFeedAlgorithm,
} from '../group.types';
import { Client } from '../../../../services/api';

// Compare objs
const deepDiff = (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr);

/**
 * Group feed component service, handles filtering and pagination
 */
@Injectable()
export class GroupFeedService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  /**
   * Filter type state
   */
  readonly type$: BehaviorSubject<GroupFeedTypeFilter> =
    new BehaviorSubject<GroupFeedTypeFilter>(DEFAULT_GROUP_FEED_TYPE_FILTER);

  /**
   * Sorting algorithm
   */
  sort$: Observable<GroupFeedAlgorithm> = this.groupService.view$.pipe(
    map((view) => {
      if (isOfTypeGroupFeedAlgorithm(view)) {
        return view;
      } else {
        return DEFAULT_GROUP_FEED_ALGORITHM;
      }
    })
  );

  /**
   * How many posts are scheduled
   */
  readonly scheduledCount$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  /**
   * True if the user wants to see scheduled posts instead of the feed
   */
  readonly viewScheduled$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    public service: FeedsService,
    protected api: ApiService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected groupService: GroupService,
    private client: Client
  ) {
    this.subscriptions.push(
      this.groupService.query$.subscribe((query) => {
        // Reset scheduled filter
        if (query) {
          if (this.viewScheduled$.getValue()) {
            this.viewScheduled$.next(false);
          }
        }
      }),
      this.type$.subscribe((type) => {
        // Reset scheduled filter
        if (type !== DEFAULT_GROUP_FEED_TYPE_FILTER) {
          if (this.viewScheduled$.getValue()) {
            this.viewScheduled$.next(false);
          }
        }
      }),
      this.viewScheduled$.subscribe((viewScheduled) => {
        // Scheduled doesn't go with query or type filter
        if (viewScheduled) {
          if (this.groupService.query$.getValue()) {
            this.groupService.query$.next('');
          }
          if (this.type$.getValue() !== DEFAULT_GROUP_FEED_TYPE_FILTER) {
            this.type$.next(DEFAULT_GROUP_FEED_TYPE_FILTER);
            this.onTypeChange(DEFAULT_GROUP_FEED_TYPE_FILTER);
          }
        }
      }),
      combineLatest([
        this.groupService.group$,
        this.sort$,
        this.type$,
        this.groupService.query$,
        this.viewScheduled$,
      ])
        .pipe(debounceTime(0), distinctUntilChanged(deepDiff))
        .subscribe(([group, sort, type, query, viewScheduled]) => {
          this.service.clear();

          const params: any = {
            query: query ? query : '',
          };

          // Reset some params if there's a search query
          if (query) {
            params['all'] = 1;
            params['period'] = 'all';
            params['sync'] = 1;
            params['force_public'] = 1;
          } else {
            // Only explicitly set algorithm when there's not a search query
            params['algorithm'] = sort === 'top' ? 'groupTop' : sort;
          }

          let endpoint = `api/v2/feeds/container`;

          if (viewScheduled) {
            endpoint = 'api/v2/feeds/scheduled';
          }

          this.service.setParams(params);

          this.service
            .setEndpoint(`${endpoint}/${group.guid}/${type}`)
            .setLimit(12)
            .fetch();

          if (this.groupService.isMember$.getValue()) {
            this.getScheduledCount();
          }
        })
    );
  }

  /**
   * Toggle view scheduled posts
   */
  toggleScheduled(): void {
    this.viewScheduled$.next(!this.viewScheduled$.getValue());
  }

  /**
   * Type changes change the route
   * @param type
   */
  onTypeChange(type: GroupFeedTypeFilter) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        filter: type,
      },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Get count of scheduled posts
   */
  async getScheduledCount() {
    const url = `api/v2/feeds/scheduled/${this.groupService.guid$.getValue()}/count`;
    const response: any = await this.client.get(url);
    this.scheduledCount$.next(response?.count || 0);
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
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
