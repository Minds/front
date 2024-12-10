import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfigsService } from '../../common/services/configs.service';
import {
  DiscoveryFeedsContentFilter,
  DiscoveryFeedsContentType,
  DiscoveryFeedsService,
} from '../discovery/feeds/feeds.service';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  interval,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  delayWhen,
  distinctUntilChanged,
  filter,
  map,
  tap,
} from 'rxjs/operators';
import { MetaService } from '../../common/services/meta.service';

import * as _ from 'lodash';
import {
  CountSearchGQL,
  FetchSearchGQL,
  FetchSearchQuery,
  FetchSearchQueryVariables,
  PageInfo,
  SearchFilterEnum,
  SearchMediaTypeEnum,
  SearchNsfwEnum,
} from '../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { FeedsService } from '../../common/services/feeds.service';
import { PermissionsService } from '../../common/services/permissions.service';
import { ComposerModalService } from '../composer/components/modal/modal.service';
import { SiteService } from '../../common/services/site.service';
import { Session } from '../../services/session';

const PAGE_SIZE = 12;

const CHANNELS_AND_GROUPS_PAGE_SIZE = 36;

@Component({
  selector: 'm-search',
  templateUrl: './search.component.html',
  styleUrls: ['search.component.ng.scss'],
  providers: [
    DiscoveryFeedsService,
    FeedsService, // The settings modal relies on this
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  query: string = '';
  filter: DiscoveryFeedsContentFilter = 'top';
  mediaType: DiscoveryFeedsContentType = 'all';
  nsfw: number[] = [];

  /**
   * True/False if the feed is fetching new data
   */
  inProgress = true;

  /**
   * First run indicator, this flag will improve the first load time
   */
  isFirstRun = true;

  /**
   * The page size will be PAGE_SIZE on init
   * fetchMore() will increase this, which will allow more data to be rendered
   */
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(PAGE_SIZE);

  /**
   * This is the main query that collects the search data
   * Future calls should be made to fetchMore() or refetch()
   */
  searchQuery: QueryRef<FetchSearchQuery, FetchSearchQueryVariables>;

  /**
   * Contains only the data part of the response
   */
  searchData: Observable<FetchSearchQuery['search']>;

  /**
   * Edges are feed items. These include 'nodes' of infeed notices, activity posts, boosts etc
   * If there is no cursor found, we will wait 100ms to prevent the navigation freezing
   *
   * Note: This observable will return the entire cached list, pageSize$ should be used for pagination
   */
  edges$: Observable<FetchSearchQuery['search']['edges']>;

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
   * New posts count
   */
  newResultsCount: number = 0;

  /**
   * The cursor to use for polling for new results
   */
  newResultsCursor: string;

  /**
   * Various subscriptions
   */
  subscriptions: Subscription[] = [];

  readonly cdnUrl: string;

  /**
   * When in an explore tab context, explore tabs are shown instead of search tabs.
   */
  public exploreTabContext: boolean = false;

  /**
   * Show a notice when the feed is empty
   */
  showEmptyFeedNotice$: Observable<boolean>;

  constructor(
    private fetchSearch: FetchSearchGQL,
    private countSearch: CountSearchGQL,
    private route: ActivatedRoute,
    private router: Router,
    configs: ConfigsService,
    private metaService: MetaService,
    private cd: ChangeDetectorRef,
    private legacyDiscoveryFeedsService: DiscoveryFeedsService,
    protected permissions: PermissionsService,
    private composerModal: ComposerModalService,
    private injector: Injector,
    private site: SiteService,
    protected session: Session
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.nsfw = this.legacyDiscoveryFeedsService.nsfw$
      .getValue()
      .filter((n) => n.selected)
      .map((n) => n.value);

    // Allow setting of filter via route data.
    if (this.route.snapshot.data?.['filter']) {
      this.filter = this.route.snapshot.data['filter'];
    }

    /**
     * This is the initial query
     */
    this.searchQuery = this.fetchSearch.watch(
      {
        query: this.query,
        filter: this.toFilterEnum(this.filter),
        mediaType: this.toMediaTypeEnum(this.mediaType),
        nsfw: this.toNsfwEnumArray(this.nsfw),
        limit: this.getResultsLimit(),
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all',
      }
    );

    this.edges$ = this.searchQuery.valueChanges.pipe(
      delayWhen(() => (this.isFirstRun ? interval(100) : of(undefined))), // wait 100ms if first page
      map((result) => {
        if (result.errors) {
          console.error(result.errors);
        }

        if (!result.data?.search) {
          return [];
        }

        const edges = _.cloneDeep(result.data.search.edges); // Clone as we need to modify the data (apollo wont let us do this)

        for (let edge of edges) {
          // We need to patch up activities to support legacy data model
          if (
            ['ActivityNode', 'GroupNode', 'UserNode', 'BoostNode'].indexOf(
              edge.node.__typename
            ) > -1
          ) {
            try {
              // @ts-ignore
              if (typeof edge.node.legacy === 'string') {
                // @ts-ignore
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

    this.showEmptyFeedNotice$ = this.edges$.pipe(
      map((edges) => {
        const hasActivityEdge =
          edges && edges.some((edge) => edge.__typename === 'ActivityEdge');
        return !this.inProgress && !hasActivityEdge;
      })
    );

    this.searchData = this.searchQuery.valueChanges.pipe(
      filter((result) => !!result.data?.search),
      map((result) => result.data.search)
    );

    this.totalEdgeCount$ = this.searchData.pipe(
      map((search) => {
        return search.edges.length;
      })
    );

    this.pageInfo$ = this.searchQuery.valueChanges.pipe(
      map((result) => {
        const search = result.data?.search;
        if (!search?.pageInfo) {
          return <PageInfo>{
            hasNextPage: false,
            hasPreviousPage: false,
          };
        }
        return search.pageInfo;
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

    if (this.route.snapshot?.data && this.route.snapshot.data['explore']) {
      this.exploreTabContext = true;
    }

    this.subscriptions = [
      // Setup the filters from query params
      this.route.queryParamMap
        .pipe(distinctUntilChanged())
        .subscribe((params: ParamMap) => {
          this.query = params.get('q');

          const filterParam: DiscoveryFeedsContentFilter = <
            DiscoveryFeedsContentFilter
          >params.get('f');
          if (filter) {
            this.filter = filterParam;
          }

          const mediaTypeParam: DiscoveryFeedsContentType = <
            DiscoveryFeedsContentType
          >params.get('t');
          if (mediaTypeParam) {
            this.mediaType = mediaTypeParam;
          }

          // Fix for legeacy media type selector
          this.legacyDiscoveryFeedsService.type$.next(this.mediaType);

          this.isFirstRun = true;

          this.searchQuery.refetch({
            ...this.searchQuery.variables,
            query: this.query,
            filter: this.toFilterEnum(this.filter),
            mediaType: this.toMediaTypeEnum(this.mediaType),
            nsfw: this.toNsfwEnumArray(this.nsfw),
            limit: this.getResultsLimit(),
          });
          this.setSeo();
        }),
      // Loading state
      this.searchQuery.valueChanges.subscribe((result) => {
        this.inProgress = result.loading;
      }),
      // Update the url when we change type
      combineLatest([
        this.legacyDiscoveryFeedsService.type$,
        this.legacyDiscoveryFeedsService.nsfw$,
      ])
        .pipe(distinctUntilChanged(), debounceTime(300))
        .subscribe(([type, nsfw]) => {
          // Remap NSFW to valid integers
          nsfw = nsfw.filter((n) => n.selected).map((n) => n.value);

          // Is NSFW different to local state?
          if (nsfw !== this.nsfw) {
            this.nsfw = nsfw;

            // Refetch only if 'type' is unchanged
            if (type === this.mediaType) {
              this.searchQuery.refetch({
                ...this.searchQuery.variables,
                nsfw: this.toNsfwEnumArray(this.nsfw),
              });
            }
          }

          // Is media type different to local state?
          if (type !== this.mediaType) {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { q: this.query, f: this.filter, t: type },
              queryParamsHandling: 'merge',
            });
          }
        }),
    ];
  }

  private getResultsLimit(): number {
    if (
      this.toFilterEnum(this.filter) === SearchFilterEnum.User ||
      this.toFilterEnum(this.filter) === SearchFilterEnum.Group
    ) {
      return CHANNELS_AND_GROUPS_PAGE_SIZE;
    }

    return PAGE_SIZE;
  }

  /**
   * The latest post component will periodically call this function
   */
  async fetchNewResultsCount() {
    if (!this.newResultsCursor) {
      this.newResultsCursor = (
        await firstValueFrom(this.pageInfo$)
      ).startCursor;
    }

    const result = await firstValueFrom(
      this.countSearch.fetch(
        {
          query: this.query,
          filter: this.toFilterEnum(this.filter),
          mediaType: this.toMediaTypeEnum(this.mediaType),
          nsfw: this.toNsfwEnumArray(this.nsfw),
          cursor: this.newResultsCursor,
        },
        {
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true,
          errorPolicy: 'all',
        }
      )
    );

    if (result.data.search.count) {
      this.newResultsCount = result.data.search.count;
    }
  }

  /**
   * The latest post component will call this when clicked
   * It resets the counter and refreshes the feed
   */
  async refreshResults() {
    this.scrollToTop();

    // Reset the count
    this.newResultsCount = 0;

    // Reset the cursor
    this.newResultsCursor = undefined;

    // Refetch the feed
    await this.searchQuery.refetch();

    // Reset the count again (poller race condition)
    this.newResultsCount = 0;
  }

  setSeo() {
    const siteTitle = this.site.title;
    this.metaService.setTitle(`${this.query} - ${siteTitle}`, false);
    this.metaService.setDescription(`Discover ${this.query} on ${siteTitle}.`);
    this.metaService.setCanonicalUrl(
      `/search?q=${this.query}&f=${this.filter}&t=${this.mediaType}`
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
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

    const result = await this.searchQuery.fetchMore({
      variables: {
        cursor: pageInfo.endCursor,
      },
    });

    // Set the new page size limit
    this.pageSize$.next(currentPageSize + result.data.search.edges.length);
  }

  /**
   * Open composer modal
   * @returns { Promise<void> } - awaitable.
   */
  public async openComposerModal(): Promise<void> {
    try {
      await this.composerModal.setInjector(this.injector).present();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * scrolls to top
   */
  public scrollToTop(): void {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }

  detectChanges(): void {
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  trackByFn(i: number, entry) {
    return entry.node.id;
  }

  private toFilterEnum(string: DiscoveryFeedsContentFilter): SearchFilterEnum {
    switch (string) {
      case 'top':
        return SearchFilterEnum.Top;
      case 'latest':
        return SearchFilterEnum.Latest;
      case 'channels':
        return SearchFilterEnum.User;
      case 'groups':
        return SearchFilterEnum.Group;
      default:
        throw 'Invalid filter provided';
    }
  }

  private toMediaTypeEnum(
    string: DiscoveryFeedsContentType
  ): SearchMediaTypeEnum {
    switch (string) {
      case 'all':
        return SearchMediaTypeEnum.All;
      case 'blogs':
        return SearchMediaTypeEnum.Blog;
      case 'videos':
        return SearchMediaTypeEnum.Video;
      case 'images':
        return SearchMediaTypeEnum.Image;
      case 'audio':
        return SearchMediaTypeEnum.Audio;
      default:
        throw 'Invalid filter provided';
    }
  }

  private toNsfwEnumArray(nsfw: number[]): SearchNsfwEnum[] {
    return nsfw.map((n) => {
      switch (n) {
        case 1:
          return SearchNsfwEnum.Nudity;
        case 2:
          return SearchNsfwEnum.Pornography;
        case 3:
          return SearchNsfwEnum.Profanity;
        case 4:
          return SearchNsfwEnum.Violence;
        case 5:
          return SearchNsfwEnum.RaceReligion;
        case 6:
          return SearchNsfwEnum.Other;
      }
    });
  }
}
