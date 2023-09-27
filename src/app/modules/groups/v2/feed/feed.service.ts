import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ApiService } from '../../../../common/api/api.service';
import { Router } from '@angular/router';
import { GroupService } from '../group.service';
import {
  DEFAULT_GROUP_FEED_ALGORITHM,
  DEFAULT_GROUP_FEED_TYPE_FILTER,
  GroupFeedAlgorithm,
  GroupFeedTypeFilter,
  isOfTypeGroupFeedAlgorithm,
} from '../group.types';

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
  readonly type$: BehaviorSubject<GroupFeedTypeFilter> = new BehaviorSubject<
    GroupFeedTypeFilter
  >(DEFAULT_GROUP_FEED_TYPE_FILTER);

  /**
   * Filter change subscription
   */
  protected filterChangeSubscription: Subscription;

  /**
   * Sorting algorithm
   */
  sort$: Observable<GroupFeedAlgorithm> = this.groupService.view$.pipe(
    map(view => {
      if (isOfTypeGroupFeedAlgorithm(view)) {
        return view;
      } else {
        return DEFAULT_GROUP_FEED_ALGORITHM;
      }
    })
  );

  constructor(
    public service: FeedsService,
    protected api: ApiService,
    protected router: Router,
    protected groupService: GroupService
  ) {
    // Fetch when group or filter changes
    this.filterChangeSubscription = combineLatest([
      this.groupService.group$,
      this.sort$,
      this.type$,
      this.groupService.query$,
    ])
      .pipe(distinctUntilChanged(deepDiff))
      .subscribe(([group, sort, type, query]) => {
        this.service.clear();

        const endpoint = `api/v2/feeds/container`;

        const params: any = {
          query: query ? query : '',
        };

        if (query) {
          params['all'] = 1;
          params['period'] = 'all';
          params['sync'] = 1;
          params['force_public'] = 1;
        } else {
          // Ignore sort algorithm for search query posts
          params['algorithm'] = sort === 'top' ? 'groupTop' : sort;
        }

        this.service.setParams(params);

        this.service
          .setEndpoint(`${endpoint}/${group.guid}/${type}`)
          .setLimit(12)
          .fetch();
      });
  }

  ngOnDestroy() {
    if (this.filterChangeSubscription) {
      this.filterChangeSubscription.unsubscribe();
    }

    for (const subscription of this.subscriptions) {
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
