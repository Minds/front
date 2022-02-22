import { ApiService } from './../../../common/api/api.service';
import { StorageV2 } from './../../../services/storage/v2';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  Injector,
  SkipSelf,
  ViewChildren,
  QueryList,
  ElementRef,
  Injectable,
  AfterViewInit,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { Navigation as NavigationService } from '../../../services/navigation';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { FeaturesService } from '../../../services/features.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { isPlatformServer } from '@angular/common';
import { ComposerComponent } from '../../composer/composer.component';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { ExperimentsService } from '../../experiments/experiments.service';
import { ApiResourceService } from '../../../common/api/api-resource.service';
import { ScrollRestorationService } from '../../../services/scroll-restoration.service';

@Injectable()
export class SubscribedFeedResource extends ApiResourceService<any> {
  constructor(protected api: ApiService, protected storage: StorageV2) {
    super({
      url: 'api/v2/feeds/subscribed/activities',
      cachePolicy: ApiResourceService.CachePolicy.cacheOnly,
      cacheStorage: ApiResourceService.CacheStorage.Memory,
      params: {
        limit: 12,
      },
    });
  }
}

@Component({
  selector: 'm-newsfeed--subscribed',
  providers: [FeedsService, SubscribedFeedResource],
  templateUrl: 'subscribed.component.html',
})
export class NewsfeedSubscribedComponent implements OnInit, OnDestroy {
  prepended: Array<any> = [];
  offset: string | number = '';
  showBoostRotator: boolean = true;
  moreData: boolean = true;
  algorithm: string = 'latest';

  attachment_preview;

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

  @ViewChild('composer') private composer: ComposerComponent;
  @ViewChildren('feedViewChildren', { read: ElementRef })
  feedViewChildren: QueryList<ElementRef>;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    private storage: Storage,
    private context: ContextService,
    protected featuresService: FeaturesService,
    public feedsService: FeedsService,
    protected newsfeedService: NewsfeedService,
    protected clientMetaService: ClientMetaService,
    public feedsUpdate: FeedsUpdateService,
    private toast: FormToastService,
    private experiments: ExperimentsService,
    private subscribedFeed: SubscribedFeedResource,
    private scrollRestoration: ScrollRestorationService,
    @SkipSelf() injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.feedsService.setResource(this.subscribedFeed);
  }

  ngAfterViewInit() {
    // TODO: this is not smooth enough. just for demo
    this.feedViewChildren.changes.subscribe(feedChanges => {
      if (feedChanges.length && !this.isScrollRestored) {
        window.scrollTo({
          top: this.scrollRestoration.getOffsetForRoute(this.router.url),
        });

        this.isScrollRestored = true;
      }
    });
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showBoostRotator = false;
        this.load(true, true);
        setTimeout(() => {
          this.showBoostRotator = true;
        }, 100);
      });

    this.reloadFeedSubscription = this.newsfeedService.onReloadFeed.subscribe(
      () => {
        this.load(true, true);
      }
    );

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['algorithm']) {
        this.algorithm = params['algorithm'];
        this.load(true, true);
      }

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

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.reloadFeedSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    this.feedsUpdatedSubscription.unsubscribe();
  }

  load(refresh: boolean = false, forceSync: boolean = false) {
    if (isPlatformServer(this.platformId)) return;

    this.loadFromService(refresh, forceSync);
  }

  loadNext() {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue()
    ) {
      this.feedsService.fetch(); // load the next 150 in the background
    }
    this.feedsService.loadMore();
  }

  async loadFromService(refresh: boolean = false, forceSync: boolean = false) {
    if (!refresh) {
      return;
    }

    if (refresh) {
      this.moreData = true;
      this.offset = 0;
      this.feedsService.clear(true);
    }

    let queryParams = {
      algorithm: this.algorithm,
    };

    if (this.experiments.hasVariation('newsfeed-group-posts', true)) {
      queryParams['include_group_posts'] = true;
    }

    try {
      this.feedsService.fetch(refresh);
    } catch (e) {
      console.error('SortedComponent', e);
    }
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

    this.feedsService.deleteItem(activity, (item, obj) => {
      return item.urn === obj.urn;
    });
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.composer) {
      return this.composer.canDeactivate();
    }
  }

  /**
   * whether channel recommendation should be shown
   * @param { string } location the location where the widget is to be shown
   * @param { number } index the index of the feed
   * @returns { boolean }
   */
  public shouldShowChannelRecommendation(location: string, index?: number) {
    return false;
    // if (!this.experiments.hasVariation('channel-recommendations', true)) {
    //   return false;
    // }

    switch (location) {
      case 'emptyState':
        return this.feedsService.feedLength === 0;
      case 'feed':
      default:
        // if the newsfeed length was less than equal to 3,
        // show the widget after last item
        if (this.feedsService.feedLength <= 3) {
          return this.feedsService.feedLength - 1;
        }

        // show after the 3rd post
        return index === 2;
    }
  }
}
