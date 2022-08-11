import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  Self,
  SkipSelf,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FeedItemType } from '../feed/feed.component';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import {
  FeedsService,
  InjectItem,
} from '../../../common/services/feeds.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Client, Upload } from '../../../services/api';
import { ContextService } from '../../../services/context.service';
import { Navigation as NavigationService } from '../../../services/navigation';
import { ScrollRestorationService } from '../../../services/scroll-restoration.service';
import { ComposerComponent } from '../../composer/composer.component';
import { ExperimentsService } from '../../experiments/experiments.service';
import { PersistentFeedExperimentService } from '../../experiments/sub-services/persistent-feed-experiment.service';
import { NewsfeedBoostRotatorComponent } from '../boost-rotator/boost-rotator.component';
import { NewsfeedService } from '../services/newsfeed.service';
import { DismissalService } from './../../../common/services/dismissal.service';
import { FeedAlgorithmHistoryService } from './../services/feed-algorithm-history.service';
import { FeaturedContentService } from '../../../common/components/featured-content/featured-content.service';

export enum FeedAlgorithm {
  top = 'top',
  latest = 'latest',
}

const commonInjectItems: InjectItem[] = [
  {
    type: FeedItemType.feedNotice,
    indexes: i => i > 0 && i % 6 === 0,
  },
  {
    type: FeedItemType.featuredContent,
    indexes: i => (i > 0 && i % 5 === 0) || i === 3,
  },
  {
    type: FeedItemType.channelRecommendations,
    indexes: (i, feedLength) =>
      feedLength <= 3 ? i === feedLength - 1 : i === 2,
  },
];

@Injectable()
export class LatestFeedService extends FeedsService {
  endpoint = 'api/v2/feeds/subscribed/activities';
  countEndpoint = 'api/v3/newsfeed/subscribed/latest/count';
  limit = new BehaviorSubject(12);
  injectItems = [
    ...commonInjectItems,
    {
      type: FeedItemType.topHighlights,
      indexes: [3],
    },
  ];
}

@Injectable()
export class TopFeedService extends FeedsService {
  endpoint = 'api/v3/newsfeed/feed/unseen-top';
  limit = new BehaviorSubject(12);
  injectItems = commonInjectItems;
}

@Component({
  selector: 'm-newsfeed--subscribed',
  providers: [LatestFeedService, TopFeedService, FeaturedContentService],
  templateUrl: 'subscribed.component.html',
})
export class NewsfeedSubscribedComponent
  implements OnInit, OnDestroy, AfterViewInit {
  prepended: Array<any> = [];
  offset: string | number = '';
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;
  algorithm: FeedAlgorithm;
  message: string = '';
  newUserPromo: boolean = false;
  postMeta: any = {
    title: '',
    description: '',
    thumbnail: '',
    url: '',
    active: false,
    attachment_guid: null,
  };
  paramsSubscription: Subscription;
  reloadFeedSubscription: Subscription;
  routerSubscription: Subscription;

  /**
   * Listening for new posts.
   */
  private feedsUpdatedSubscription: Subscription;

  @ViewChild('composer') private composer: ComposerComponent;
  @ViewChild('boostRotator')
  private boostRotator: NewsfeedBoostRotatorComponent;
  @ViewChildren('feedViewChildren', { read: ElementRef })
  feedViewChildren: QueryList<ElementRef>;
  /**
   * Whether top highlights is dismissed
   */
  isTopHighlightsDismissed$ = this.dismissal.isDismissed('top-highlights');
  /**
   * Whether channel recommendation is dismissed
   */
  isChannelRecommendationDismissed$ = this.dismissal.isDismissed(
    'channel-recommendation:feed'
  );

  public persistentFeedExperimentActive: boolean;
  /**
   * whether the scroll should be restored
   */
  public shouldRestoreScroll = false;

  /**
   * whether the scroll has been restored on this page
   */
  public isScrollRestored = false;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    private feedAlgorithmHistory: FeedAlgorithmHistoryService,
    private context: ContextService,
    @Self() public latestFeedService: LatestFeedService,
    @Self() public topFeedService: TopFeedService,
    protected newsfeedService: NewsfeedService,
    protected clientMetaService: ClientMetaService,
    public feedsUpdate: FeedsUpdateService,
    private toast: ToasterService,
    private experiments: ExperimentsService,
    private scrollRestoration: ScrollRestorationService,
    @SkipSelf() injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dismissal: DismissalService,
    public changeDetectorRef: ChangeDetectorRef,
    persistentFeedExperiment: PersistentFeedExperimentService
  ) {
    if (isPlatformServer(this.platformId)) return;

    const storedfeedAlgorithm = this.feedAlgorithmHistory.lastAlorithm;
    if (storedfeedAlgorithm) {
      this.algorithm = storedfeedAlgorithm;
    }
    this.persistentFeedExperimentActive = persistentFeedExperiment.isActive();
    if (this.persistentFeedExperimentActive) {
      this.topFeedService.setCachingEnabled(true);
      this.latestFeedService.setCachingEnabled(true);
    }
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showBoostRotator = false;
        this.load();
        setTimeout(() => {
          this.showBoostRotator = true;
        }, 100);
      });

    this.reloadFeedSubscription = this.newsfeedService.onReloadFeed.subscribe(
      () => {
        this.load();
      }
    );

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['algorithm']) {
        if (params['algorithm'] in FeedAlgorithm) {
          this.changeFeedAlgorithm(params['algorithm']);
        } else {
          this.router.navigate([`/newsfeed/subscriptions/${this.algorithm}`]);
        }
      }
      this.load();

      if (params['message']) {
        this.message = params['message'];
      }

      this.newUserPromo = !!params['newUser'];
    });

    // catch Zendesk errors and make them domain specific.
    this.route.queryParams.subscribe(params => {
      if (params.kind === 'error') {
        if (
          /User is invalid: External minds-guid:\d+ has already been taken/.test(
            params.message
          )
        ) {
          this.toast.error('Your email is already linked to a support account');
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
    });

    this.feedsUpdatedSubscription = this.feedsUpdate.postEmitter.subscribe(
      newPost => {
        this.prepend(newPost);
      }
    );

    this.context.set('activity');

    if (this.persistentFeedExperimentActive) {
      this.shouldRestoreScroll = !!this.scrollRestoration.getOffsetForRoute(
        this.router.url
      );
    }
  }

  ngAfterViewInit() {
    if (this.shouldRestoreScroll) {
      this.scrollRestoration.restoreScroll(this.router.url).then(() => {
        this.isScrollRestored = true;
      });
    }
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.reloadFeedSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    this.feedsUpdatedSubscription.unsubscribe();
  }

  /**
   * returns feedService based on algorithm
   **/
  get feedService(): FeedsService {
    if (this.algorithm === 'top') {
      return this.topFeedService;
    }

    return this.latestFeedService;
  }

  async load() {
    if (isPlatformServer(this.platformId)) return;

    this.moreData = true;
    this.offset = 0;
    this.showBoostRotator = false;
    this.inProgress = true;

    let queryParams = {
      algorithm: this.algorithm,
    };

    if (this.experiments.hasVariation('newsfeed-group-posts', true)) {
      queryParams['include_group_posts'] = true;
    }

    try {
      switch (this.algorithm) {
        case 'top':
          await this.topFeedService.setLimit(12).fetch(true);
          break;
        case 'latest':
          this.prepended = [];
          await Promise.all([
            this.topFeedService.setLimit(3).fetch(true),
            this.latestFeedService.fetch(true),
          ]);
          break;
      }
    } catch (e) {
      console.error('Load Feed', e);
    }

    this.inProgress = false;
    this.showBoostRotator = true;
  }

  loadNext() {
    if (
      this.feedService.canFetchMore &&
      !this.feedService.inProgress.getValue() &&
      this.feedService.offset.getValue()
    ) {
      this.feedService.fetch(); // load the next 150 in the background
    }
    this.feedService.loadMore();
  }

  prepend(activity: any) {
    if (this.newUserPromo) {
      this.autoBoost(activity);
      activity.boostToggle = false;
      activity.boosted = true;
    }
    this.prepended.unshift(activity);

    this.newUserPromo = false;
  }

  autoBoost(activity: any) {
    this.client.post(
      'api/v2/boost/activity/' + activity.guid + '/' + activity.owner_guid,
      {
        newUserPromo: true,
        impressions: 200,
        destination: 'Newsfeed',
      }
    );
  }

  delete(activity) {
    let i: any;

    for (i in this.prepended) {
      if (this.prepended[i] === activity) {
        this.prepended.splice(i, 1);
        return;
      }
    }

    this.feedService.deleteItem(activity, (item, obj) => {
      return item.urn === obj.urn;
    });
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
    this.feedAlgorithmHistory.lastAlorithm = algo;

    switch (algo) {
      case 'top':
        this.topFeedService.clear(true);
        break;
      case 'latest':
        this.latestFeedService.clear(true);
        this.topFeedService.clear(true);
    }
  }

  /**
   * smooth scrolls to top and changes feed algorithm
   **/
  onShowMoreTopFeed() {
    if (isPlatformServer(this.platformId)) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setTimeout(() => {
      this.changeFeedAlgorithm(FeedAlgorithm.top);
      this.load();
    }, 500);
  }

  /**
   * determines whether to show top feed highlights or not
   * @param { number } index the index of the feed
   */
  shouldShowTopHighlights(index: number) {
    // only on latest
    if (this.algorithm !== 'latest') {
      return false;
    }

    // before 4th post
    return index === 3;
  }

  /**
   * whether channel recommendation should be shown
   * @param { string } location the location where the widget is to be shown
   * @param { number } index the index of the feed
   * @returns { boolean }
   */
  public shouldShowChannelRecommendation(location: string, index?: number) {
    if (this.feedService.inProgress && !this.feedService.feedLength) {
      return false;
    }

    switch (location) {
      case 'emptyState':
        return !this.feedService.feedLength;
      case 'feed':
      default:
        // if the newsfeed length was less than equal to 3,
        // show the widget after last item
        if (this.feedService.feedLength <= 3) {
          return index === this.feedService.feedLength - 1;
        }

        // show after the 3rd post
        return index === 2;
    }
  }

  /**
   * scrolls to under the boost rotator. Used as an alternative to scrollToTop but
   * keeping scrolling consistency by not avoiding the rotator.
   */
  scrollToUnderBoostRotator(): void {
    if (isPlatformServer(this.platformId)) return;

    if (!this.boostRotator) {
      window.scrollTo({
        behavior: 'smooth',
        top: 0,
      });
      return;
    }

    window.scrollTo({
      behavior: 'smooth',
      top:
        this.boostRotator.rotatorEl.nativeElement?.offsetTop +
          this.boostRotator.height || 0,
    });
  }
}
