import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import * as _ from 'lodash';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  firstValueFrom,
  interval,
  of,
} from 'rxjs';
import { filter, startWith, tap, delayWhen, map } from 'rxjs/operators';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { ContextService } from '../../../services/context.service';
import { Navigation as NavigationService } from '../../../services/navigation';
import { ComposerComponent } from '../../composer/composer.component';
import { NewsfeedBoostRotatorComponent } from '../boost-rotator/boost-rotator.component';
import { DismissalService } from '../../../common/services/dismissal.service';
import { FeedAlgorithmHistoryService } from '../services/feed-algorithm-history.service';
import { QueryRef } from 'apollo-angular';
import {
  FeedNoticeNode,
  FetchNewsfeedGQL,
  FetchNewsfeedQuery,
  FetchNewsfeedQueryVariables,
  PageInfo,
} from '../../../../graphql/generated.engine';
import { FeedAlgorithm } from './subscribed.component';
import { BoostFeedService } from '../services/boost-feed.service';

const PAGE_SIZE = 12;

@Component({
  selector: 'm-newsfeed__gql',
  templateUrl: 'newsfeed-gql.component.html',
})
export class NewsfeedGqlComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Posts that will display above the feed.
   * Eg. new posts made via the composer
   */
  prepended: Array<any> = [];

  /**
   * Will toggle the boost rotator on or off
   */
  showBoostRotator: boolean = false;

  /**
   * True/False if the feed is fetching new data
   */
  inProgress: boolean = true;

  isFirstRun = true;

  /**
   * The chosen algorithm, set by the router
   */
  algorithm: FeedAlgorithm;

  /**
   * Active subscriptions that should be unsubscribed from on destroy
   */
  private subscriptions: Subscription[];

  @ViewChild('composer') private composer: ComposerComponent;

  @ViewChild('boostRotator')
  private boostRotator: NewsfeedBoostRotatorComponent;

  /**
   * Whether top highlights is dismissed
   */
  isTopHighlightsDismissed$ = this.dismissal.dismissed('top-highlights');

  /**
   * Whether channel recommendation is dismissed
   */
  isChannelRecommendationDismissed$ = this.dismissal.dismissed(
    'channel-recommendation:feed'
  );

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
   * Local reference of feed notices we have seen, so we don't get them returned again
   */
  inFeedNoticesDelivered$: Observable<string[]>;

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

  constructor(
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    private feedAlgorithmHistory: FeedAlgorithmHistoryService,
    private context: ContextService,
    protected clientMetaService: ClientMetaService,
    public feedsUpdate: FeedsUpdateService,
    private toast: ToasterService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dismissal: DismissalService,
    public changeDetectorRef: ChangeDetectorRef,
    private fetchNewsfeed: FetchNewsfeedGQL,
    protected boostFeedService: BoostFeedService
  ) {
    if (isPlatformServer(this.platformId)) return;

    const storedfeedAlgorithm = this.feedAlgorithmHistory.lastAlgorithm;
    if (storedfeedAlgorithm) {
      this.algorithm = storedfeedAlgorithm;
    }

    this.feedQuery = this.fetchNewsfeed.watch(
      {
        algorithm: this.algorithm,
        limit: PAGE_SIZE,
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

        for (let edge of edges) {
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
      tap(() => (this.isFirstRun = false)) // Do not delay on future runs
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

    this.inFeedNoticesDelivered$ = this.edges$.pipe(
      map(edges =>
        edges
          .filter(edge => edge.__typename === 'FeedNoticeEdge')
          .map(edge => (<FeedNoticeNode>edge.node).key)
      )
    );
  }

  ngOnInit() {
    this.boostFeedService.init(); // Kick off the loading

    this.subscriptions = [
      /**
       * Ensures we only start to load after the component has been initialised
       */
      this.router.events
        .pipe(
          filter((event: RouterEvent) => event instanceof NavigationEnd),
          startWith(this.router)
        )
        .subscribe(() => {
          this.load();
          setTimeout(() => {
            this.showBoostRotator = this.isFirstRun && true;
          }, 50);
        }),
      /**
       * Set the algorithm to use
       */
      this.route.params.subscribe(params => {
        if (params['algorithm']) {
          if (Object.values(FeedAlgorithm).includes(params['algorithm'])) {
            this.changeFeedAlgorithm(params['algorithm']);
          } else {
            this.router.navigate([`/newsfeed/subscriptions/${this.algorithm}`]);
          }
        }
      }),
      /**
       * Catch Zendesk errors and make them domain specific
       */
      this.route.queryParams.subscribe(params => {
        if (params.kind === 'error') {
          if (
            /User is invalid: External minds-guid:\d+ has already been taken/.test(
              params.message
            )
          ) {
            this.toast.error(
              'Your email is already linked to a support account'
            );
            return;
          }

          if (
            params.message ===
            'Please use one of the options below to sign in to Zendesk.'
          ) {
            this.toast.error('Authentication method invalid');
            return;
          }

          this.toast.error(params.message ?? 'An unknown error has occurred');
        }
      }),
      /**
       * Subscribe for new psots
       */
      this.feedsUpdate.postEmitter.subscribe(newPost => {
        this.prepend(newPost);
      }),
    ];

    this.context.set('activity');
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.feedQuery.valueChanges.subscribe(result => {
        this.inProgress = result.loading;
      })
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async load() {
    if (isPlatformServer(this.platformId)) return;

    this.inProgress = true;

    /**
     * Rotating the boost rotator provides feedback that something has changes
     * to the user on shorter viewports that may not be able to see the feed
     * under the rotator.
     */
    if (this.boostRotator?.running) {
      this.boostRotator?.next();
    }

    if (!this.isFirstRun) {
      this.feedQuery.refetch();
    }
  }

  async fetchMore() {
    if (this.inProgress) return; // Already loading
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
        inFeedNoticesDelivered: await firstValueFrom(
          this.inFeedNoticesDelivered$
        ),
      },
    });

    // Set the new page size limit
    this.pageSize$.next(currentPageSize + result.data.newsfeed.edges.length);
  }

  prepend(activity: any) {
    this.prepended.unshift(activity);
  }

  delete(activity) {
    let i: any;

    for (i in this.prepended) {
      if (this.prepended[i] === activity) {
        this.prepended.splice(i, 1);
        return;
      }
    }
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.composer) {
      return this.composer.canDeactivate();
    }
  }

  /**
   * change feed algorithm
   **/
  changeFeedAlgorithm(algo: FeedAlgorithm) {
    this.algorithm = algo;
    this.feedAlgorithmHistory.lastAlgorithm = algo;

    // Hide the boost rotator
    this.showBoostRotator = false;

    // Reset the page size to the default
    this.pageSize$.next(PAGE_SIZE);

    // Fetch new data
    this.feedQuery.refetch({
      limit: PAGE_SIZE,
      algorithm: this.algorithm,
    });

    // Reset any prepended posts
    this.prepended = [];
  }

  /**
   * scrolls to under the boost rotator. Used as an alternative to scrollToTop but
   * keeping scrolling consistency by not avoiding the rotator.
   */
  scrollToUnderBoostRotator(): void {
    if (isPlatformServer(this.platformId)) return;

    // if boost rotator didn't exist, just scroll to top
    if (!this.boostRotator) {
      window.scrollTo({
        behavior: 'smooth',
        top: 0,
      });
      return;
    }

    const bottomOfBoostRotatorOffset =
      this.boostRotator.rotatorEl?.nativeElement?.offsetTop +
      this.boostRotator?.height;

    window.scrollTo({
      behavior: 'smooth',
      top: bottomOfBoostRotatorOffset || 0,
    });
  }

  /**
   * smooth scrolls to top and changes feed algorithm
   */
  onShowMoreTopFeed() {
    if (isPlatformServer(this.platformId)) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setTimeout(() => {
      this.changeFeedAlgorithm(FeedAlgorithm.top);
    }, 500);
  }

  /**
   * Improves the scroll performance
   */
  trackByFn(i: number, entry) {
    return entry.node.id;
  }
}
