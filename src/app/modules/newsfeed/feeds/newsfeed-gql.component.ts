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
  Event,
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
import { filter, startWith, tap, delayWhen, map, reduce } from 'rxjs/operators';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { ContextService } from '../../../services/context.service';
import { Navigation as NavigationService } from '../../../services/navigation';
import { ComposerComponent } from '../../composer/composer.component';
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
import { BoostFeedService } from '../services/boost-feed.service';
import { ExperimentsService } from '../../experiments/experiments.service';
import { FeedAlgorithm } from '../../../common/services/feeds.service';
import { FeedNoticeDismissalService } from '../../notices/services/feed-notice-dismissal.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import { FeedBoostCtaExperimentService } from '../../experiments/sub-services/feed-boost-cta-experiment.service';

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
  prepended$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  /**
   * True/False if the feed is fetching new data
   */
  inProgress: boolean = true;

  isFirstRun = true;

  /**
   * The chosen algorithm, set by the router
   */
  algorithm$: BehaviorSubject<FeedAlgorithm> =
    new BehaviorSubject<FeedAlgorithm>(null);

  /**
   * Active subscriptions that should be unsubscribed from on destroy
   */
  private subscriptions: Subscription[];

  @ViewChild('composer') private composer: ComposerComponent;

  /**
   * Whether top highlights is dismissed
   */
  isTopHighlightsDismissed$ = this.dismissal.dismissed('top-highlights');

  /**
   * Whether publisher recommendations is dismissed
   */
  isPublisherRecommendationsDismissed$ = this.dismissal.dismissed(
    'channel-recommendation:feed'
  );

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
   * True if we have at least one activity edge in memory
   * (used to determine whether we have an empty feed)
   */
  hasActivityEdges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

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
   * True after the first load has been completed
   */
  init$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Show a notice when the feed is empty
   */
  showEmptyFeedNotice$: Observable<boolean>;

  siteUrl: string;

  /** Whether feed boost cta experiment is active. */
  protected isFeedBoostCtaExperimentActive: boolean = false;

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
    private feedNoticeDismissalService: FeedNoticeDismissalService,
    public changeDetectorRef: ChangeDetectorRef,
    private fetchNewsfeed: FetchNewsfeedGQL,
    protected boostFeedService: BoostFeedService,
    protected experimentsService: ExperimentsService,
    private feedBoostCtaExperimentService: FeedBoostCtaExperimentService,
    protected permissions: PermissionsService,
    protected isTenant: IsTenantService,
    protected session: Session,
    configs: ConfigsService
  ) {
    if (isPlatformServer(this.platformId)) return;

    this.siteUrl = configs.get('site_url');

    const storedfeedAlgorithm = this.feedAlgorithmHistory.lastAlgorithm;
    if (storedfeedAlgorithm) {
      this.algorithm$.next(storedfeedAlgorithm);
    }

    this.feedQuery = this.fetchNewsfeed.watch(
      {
        algorithm: this.algorithm$.getValue(),
        limit: PAGE_SIZE,
        inFeedNoticesDelivered: this.getDismissedFeedNoticeIds(),
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all',
      }
    );

    this.feedData = this.feedQuery.valueChanges.pipe(
      filter((result) => !!result.data?.newsfeed),
      map((result) => result.data.newsfeed)
    );

    this.edges$ = this.feedQuery.valueChanges.pipe(
      delayWhen(() => (this.isFirstRun ? interval(100) : of(undefined))), // wait 100ms if first page
      map((result) => {
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
            this.hasActivityEdges$.next(true);

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
        this.init$.next(true);

        return edges;
      }),
      tap(() => {
        // Do not delay on future runs
        this.isFirstRun = false;
      })
    );

    this.totalEdgeCount$ = this.feedData.pipe(
      map((newsfeed) => {
        return newsfeed.edges.length;
      })
    );

    this.pageInfo$ = this.feedQuery.valueChanges.pipe(
      map((result) => {
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
      map((edges) =>
        edges
          .filter((edge) => edge.__typename === 'FeedNoticeEdge')
          .map((edge) => (<FeedNoticeNode>edge.node).key)
      ),
      map((keys) => {
        // use a set to remove duplicates.
        return [
          ...new Set<string>([...keys, ...this.getDismissedFeedNoticeIds()]),
        ];
      })
    );

    this.showEmptyFeedNotice$ = combineLatest([
      this.init$,
      this.hasActivityEdges$,
      this.prepended$,
      this.algorithm$,
    ]).pipe(
      map(([init, hasActivityEdges, prepended, algorithm]) => {
        const hasVisiblePrepended =
          algorithm === 'latest' && prepended.length > 0;
        return init && !hasActivityEdges && !hasVisiblePrepended;
      })
    );
  }

  ngOnInit() {
    this.boostFeedService.init(); // Kick off the loading

    this.isFeedBoostCtaExperimentActive =
      this.feedBoostCtaExperimentService.isActive();

    this.subscriptions = [
      /**
       * Ensures we only start to load after the component has been initialised
       */
      this.router.events
        .pipe(
          filter(
            (event: Event | RouterEvent) => event instanceof NavigationEnd
          ),
          startWith(this.router)
        )
        .subscribe(() => {
          this.load();
        }),
      /**
       * Set the algorithm to use
       */
      this.route.params.subscribe((params) => {
        if (params['algorithm']) {
          if (Object.values(FeedAlgorithm).includes(params['algorithm'])) {
            this.changeFeedAlgorithm(params['algorithm']);
          } else {
            this.router.navigate([
              `/newsfeed/subscriptions/${this.algorithm$.getValue()}`,
            ]);
          }
        }
      }),
      /**
       * Subscribe for new posts
       */
      this.feedsUpdate.postEmitter.subscribe((newPost) => {
        this.prepend(newPost);
      }),
    ];

    this.context.set('activity');
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.feedQuery?.valueChanges.subscribe((result) => {
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
    if (activity?.containerObj && !this.isTenant.is()) {
      return;
    }

    const current = this.prepended$.value;

    const prepended = [activity, ...current];

    this.prepended$.next(prepended);
  }

  /**
   * Removes a deleted activity from the prepended array,
   * if applicable
   * @param activity
   */
  delete(activity) {
    const prepended = this.prepended$.value;
    const index = prepended.findIndex((item) => item.guid === activity.guid);

    if (index !== -1) {
      prepended.splice(index, 1);

      this.prepended$.next([...prepended]);
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
    this.init$.next(false);
    this.hasActivityEdges$.next(false);

    this.algorithm$.next(algo);
    this.feedAlgorithmHistory.lastAlgorithm = algo;

    // Reset the page size to the default
    this.pageSize$.next(PAGE_SIZE);

    // Fetch new data
    this.feedQuery.refetch({
      limit: PAGE_SIZE,
      algorithm: algo,
    });

    // Reset any prepended posts
    this.prepended$.next([]);
  }

  /**
   * scrolls to under the boost rotator. Used as an alternative to scrollToTop but
   * keeping scrolling consistency by not avoiding the rotator.
   */
  scrollToTop(): void {
    if (isPlatformServer(this.platformId)) return;

    window.scrollTo({
      behavior: 'smooth',
      top: 0,
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

  /**
   * Gets all dismissed feed notice ids.
   * @returns { string[] } string array for of all dismissed feed notice IDs.
   */
  private getDismissedFeedNoticeIds(): string[] {
    return this.feedNoticeDismissalService.getAllDismissedNoticeIds() ?? [];
  }

  /**
   * Copy invite link to clipboard
   */
  protected copyInviteLinkToClipboard(): void {
    const url = this.isTenant.is()
      ? this.siteUrl
      : `${this.siteUrl}?referrer=${this.session.getLoggedInUser().username}`;

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toast.success('Link copied to clipboard');
  }

  /**
   * Redirect to discovery channel suggestions list
   */
  protected clickedDiscoverChannels(): void {
    this.router.navigate(['/discovery/suggestions/user'], {
      queryParams: { explore: true },
    });
  }

  /**
   * Redirect to discovery group suggestions list
   */
  protected clickedDiscoverGroups(): void {
    this.router.navigate(['/discovery/suggestions/group'], {
      queryParams: { explore: true },
    });
  }

  /**
   * Redirect to group create page
   */
  protected clickedCreateGroup(): void {
    this.router.navigate(['/groups/create'], {
      queryParams: { explore: true },
    });
  }
}
