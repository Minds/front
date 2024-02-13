import { Component, Inject, OnInit } from '@angular/core';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import {
  FetchNewsfeedGQL,
  FetchNewsfeedQuery,
  FetchNewsfeedQueryVariables,
  PageInfo,
} from '../../../../graphql/generated.engine';
import { FeedAlgorithm } from '../../newsfeed/feed/feed.component';
import { QueryRef } from 'apollo-angular';
import { delayWhen, filter, map, tap } from 'rxjs/operators';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  interval,
  Observable,
  of,
} from 'rxjs';
import * as _ from 'lodash';

const ALGORITHM: FeedAlgorithm = FeedAlgorithm.top;
const PAGE_SIZE = 12;

@Component({
  selector: 'm-tenantGuestModeFeed',
  templateUrl: 'tenant-guest-mode-feed.component.html',
  styleUrls: ['./tenant-guest-mode-feed.component.ng.scss'],
})
export class TenantGuestModeFeedComponent implements OnInit {
  private isFirstRun = true;

  public inProgress = true;

  newsfeedEndText = $localize`:@@COMMON__FEED_END:End of your newsfeed`;

  /**
   * The page size will be PAGE_SIZE on init
   * fetchMore() will increase this, which will allow more data to be rendered
   */
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(PAGE_SIZE);

  /**
   * This is the main query that collects the feed data
   * Future calls should be made to fetchMore()
   */
  feedQuery: QueryRef<FetchNewsfeedQuery, FetchNewsfeedQueryVariables>;

  /**
   * Contains only the data part of the response
   */
  feedData: Observable<FetchNewsfeedQuery['newsfeed']>;

  /**
   * Edges are feed items. These include 'nodes' of infeed notices, activity posts, boosts etc
   * If there is no cursor found, we will wait 100ms to prevent the navigation freezing
   *
   * Note: This observable will return the entire cached list, pageSize$ should be used for pagination
   */
  edges$: Observable<FetchNewsfeedQuery['newsfeed']['edges']>;

  /**
   * Total number of edges we have in memory
   */
  totalEdgeCount$: Observable<number>;

  /**
   * Connection pagination information.
   * Contains the most recent cursors and paging stats
   */
  pageInfo$: Observable<PageInfo>;

  /**
   * Observable returns if the feed has any more items left
   * Combines the inmemory buffer and remote fetching
   */
  canShowMoreEdges$: Observable<boolean>;

  /**
   * Show a notice when the feed is empty
   */
  showEmptyFeedNotice$: Observable<boolean>;

  constructor(
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean,
    private fetchNewsfeed: FetchNewsfeedGQL
  ) {}

  ngOnInit(): void {
    this.feedQuery = this.fetchNewsfeed.watch(
      {
        algorithm: ALGORITHM,
        limit: PAGE_SIZE,
        inFeedNoticesDelivered: [],
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all',
      }
    );

    this.feedData = this.feedQuery.valueChanges.pipe(
      filter(result => !!result.data?.newsfeed),
      map(result => result.data.newsfeed)
    );

    this.edges$ = this.feedQuery.valueChanges.pipe(
      delayWhen(() => (this.isFirstRun ? interval(100) : of(undefined))), // wait 100ms if first page
      map(result => {
        if (result.errors) {
          console.error(result.errors);
        }

        if (!result.data?.newsfeed) {
          return [];
        }

        const edges = _.cloneDeep(result.data.newsfeed.edges); // Clone as we need to modify the data (apollo wont let us do this)

        for (const edge of edges) {
          // We need to patch up activities to support legacy data model
          if (
            edge.node.__typename === 'ActivityNode' ||
            edge.node.__typename === 'BoostNode'
          ) {
            try {
              if (typeof edge.node.legacy === 'string') {
                edge.node.legacy = JSON.parse(edge.node.legacy);
              }
            } catch (e) {
              console.error(edge);
              console.error(e);
            }
          }
        }

        return edges;
      }),
      tap(() => {
        this.isFirstRun = false; // Do not delay on future runs
        this.inProgress = false;
      })
    );

    this.totalEdgeCount$ = this.feedData.pipe(
      map(newsfeed => {
        return newsfeed.edges.length;
      })
    );

    this.pageInfo$ = this.feedQuery.valueChanges.pipe(
      map(result => {
        const newsfeed = result.data?.newsfeed;
        if (!newsfeed?.pageInfo) {
          return <PageInfo>{
            hasNextPage: false,
            hasPreviousPage: false,
          };
        }
        return newsfeed.pageInfo;
      })
    );

    this.canShowMoreEdges$ = combineLatest([
      this.pageSize$,
      this.totalEdgeCount$,
      this.pageInfo$,
    ]).pipe(
      map(([pageSize, totalEdgeCount, pageInfo]) => {
        if (pageSize < totalEdgeCount) {
          return true;
        }

        return pageInfo.hasNextPage;
      })
    );

    this.showEmptyFeedNotice$ = this.edges$.pipe(
      map(edges => {
        const hasActivityEdge =
          edges && edges.some(edge => edge.__typename === 'ActivityEdge');
        return !this.inProgress && !hasActivityEdge;
      })
    );
  }

  async fetchMore() {
    if (this.inProgress) {
      return; // Already loading
    }
    this.inProgress = true;

    const currentPageSize = this.pageSize$.getValue();
    const totalEdgeCount = await firstValueFrom(this.totalEdgeCount$);

    /**
     * If the currentPageSize is less than the total amount of edges with have in the local state,
     * increase the page size and skip further fetching
     */
    if (currentPageSize < totalEdgeCount) {
      const newPageSize = currentPageSize + PAGE_SIZE;
      this.pageSize$.next(newPageSize);
      this.inProgress = false;
      return;
    }

    const pageInfo: PageInfo = await firstValueFrom(this.pageInfo$);

    const result = await this.feedQuery.fetchMore({
      variables: {
        cursor: pageInfo.endCursor,
        inFeedNoticesDelivered: [],
      },
    });

    // Set the new page size limit
    this.pageSize$.next(currentPageSize + result.data.newsfeed.edges.length);
    this.inProgress = false;
  }

  /**
   * Improves the scroll performance
   */
  trackByFn(i: number, entry) {
    return entry.node.id;
  }
}
