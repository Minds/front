import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
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
import { IPageInfo, VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ApiResource } from '../../../common/api/api-resource.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { Client, Upload } from '../../../services/api';
import { ContextService } from '../../../services/context.service';
import { Navigation as NavigationService } from '../../../services/navigation';
import { ScrollRestorationService } from '../../../services/scroll-restoration.service';
import { ComposerComponent } from '../../composer/composer.component';
import { ExperimentsService } from '../../experiments/experiments.service';
import { NewsfeedBoostRotatorComponent } from '../boost-rotator/boost-rotator.component';
import { NewsfeedService } from '../services/newsfeed.service';
import { DismissalService } from './../../../common/services/dismissal.service';
import { EntityObservable } from './../../../common/services/entities.service';
import { FeedAlgorithmHistoryService } from './../services/feed-algorithm-history.service';

export enum FeedAlgorithm {
  top = 'top',
  latest = 'latest',
}

@Injectable()
export class LatestFeedService extends FeedsService {
  feedQuery = this.apiResource.query('api/v2/feeds/subscribed/activities', {
    cacheStorage: ApiResource.CacheStorage.Memory,
    cachePolicy: ApiResource.CachePolicy.fetchOnly,
    skip: true, // TODO: rename to autoFetch: false
  });
}

@Injectable()
export class TopFeedService extends FeedsService {
  feedQuery = this.apiResource.query('api/v3/newsfeed/feed/unseen-top', {
    cacheStorage: ApiResource.CacheStorage.Memory,
    cachePolicy: ApiResource.CachePolicy.fetchOnly,
    skip: true, // TODO: rename to autoFetch: false
  });
}

@Component({
  selector: 'm-newsfeed--subscribed',
  providers: [LatestFeedService, TopFeedService],
  templateUrl: 'subscribed.component.html',
})
export class NewsfeedSubscribedComponent
  implements OnInit, OnDestroy, AfterViewInit {
  prepended: Array<any> = [];
  offset: string | number = '';
  showBoostRotator: boolean = true;
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
  /**
   * whether we've restored the scroll position
   */
  isScrollRestored: boolean;

  @ViewChild('scroll')
  virtualScroller: VirtualScrollerComponent;
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
    private toast: FormToastService,
    private experiments: ExperimentsService,
    private scrollRestoration: ScrollRestorationService,
    @SkipSelf() injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dismissal: DismissalService
  ) {
    if (isPlatformServer(this.platformId)) return;

    const storedfeedAlgorithm = this.feedAlgorithmHistory.lastAlorithm;
    if (storedfeedAlgorithm) {
      this.algorithm = storedfeedAlgorithm;
    }

    this.latestFeedService
      .setEndpoint(`api/v2/feeds/subscribed/activities`)
      .setCountEndpoint('api/v3/newsfeed/subscribed/latest/count')
      .setLimit(12);
    this.topFeedService
      .setEndpoint(`api/v3/newsfeed/feed/unseen-top`)
      .setLimit(12);
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
  }

  // when an entity is updated in a way that their height is changed, invalidate the cachedMeasurement
  ngAfterViewInit() {
    // TODO: this is not smooth enough. just for demo
    this.feedViewChildren.changes.subscribe(feedChanges => {
      if (feedChanges.length && !this.isScrollRestored) {
        const scrollOffsetTop = this.scrollRestoration.getOffsetForRoute(
          this.router.url
        );

        if (scrollOffsetTop) {
          window.scrollTo({
            top: scrollOffsetTop,
          });
        }

        this.isScrollRestored = true;
      }
    });
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

    let queryParams = {
      algorithm: this.algorithm,
    };

    if (this.experiments.hasVariation('newsfeed-group-posts', true)) {
      queryParams['include_group_posts'] = true;
    }

    try {
      switch (this.algorithm) {
        case 'top':
          // this.topFeedService.clear(true); // TODO: readd
          await this.topFeedService.setLimit(12).fetch(true);
          break;
        case 'latest':
          // this.latestFeedService.clear(true); // TODO: readd
          // this.topFeedService.clear(true); // TODO: readd
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

    this.showBoostRotator = true;
  }

  loadNext(event: IPageInfo) {
    // only load next if we're in the proximity of the last 3 posts
    if (!this.feedService.feedLength) return;
    if (this.feedService.feedLength - event?.endIndex > 3) return;
    if (this.feedService.feedQuery?.loading$.getValue()) return;

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

  compareItems(item1: EntityObservable, item2: EntityObservable) {
    // @ts-ignore
    return item1?.getValue().guid === item2?.getValue().guid;
  }

  activityTrackBy(index: number, activity: any) {
    return activity?.guid || activity?.getValue().guid;
  }

  /**
   * called when activity size changed. we want to invalidate the
   * height measurement cache of the virtual scroller when the activity
   * height changed.
   * @param { ResizedEvent } event
   * @param { object } activity
   * @param { number } index
   * @returns { void }
   */
  onResized(event: any, index: number) {
    if (event.isFirst) return null;

    // this.virtualScroller.invalidateCachedMeasurementAtIndex(index);
  }
}
