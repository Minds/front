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
  Self,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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
import { FeedsService } from '../../../common/services/feeds.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { isPlatformServer } from '@angular/common';
import { ComposerComponent } from '../../composer/composer.component';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { TopFeedExperimentService } from '../../experiments/sub-services/top-feed-experiment.service';

const FEED_ALGORITHM_STORAGE_KEY = 'feed:algorithm';
type FeedAlgorithm = 'top' | 'latest';

@Injectable()
export class LatestFeedService extends FeedsService {}

@Injectable()
export class TopFeedService extends FeedsService {}

@Component({
  selector: 'm-newsfeed--subscribed',
  providers: [LatestFeedService, TopFeedService],
  templateUrl: 'subscribed.component.html',
  styleUrls: ['subscribed.component.ng.scss'],
})
export class NewsfeedSubscribedComponent implements OnInit, OnDestroy {
  feed: BehaviorSubject<Array<Object>> = new BehaviorSubject([]);
  prepended: Array<any> = [];
  offset: string | number = '';
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;
  algorithm: FeedAlgorithm = 'latest';

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
    public topFeedExperiment: TopFeedExperimentService,
    @Self() public latestFeedService: LatestFeedService,
    @Self() public topFeedService: TopFeedService,
    protected newsfeedService: NewsfeedService,
    protected clientMetaService: ClientMetaService,
    public feedsUpdate: FeedsUpdateService,
    private toast: FormToastService,
    @SkipSelf() injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) return;

    if (this.topFeedExperiment.isActive()) {
      const storedfeedAlgorithm = this.storage.get(FEED_ALGORITHM_STORAGE_KEY);
      if (storedfeedAlgorithm) {
        this.algorithm = storedfeedAlgorithm as FeedAlgorithm;
      }
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

    this.load();

    this.paramsSubscription = this.route.params.subscribe(params => {
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

  async load() {
    if (isPlatformServer(this.platformId)) return;

    this.moreData = true;
    this.offset = 0;
    this.latestFeedService.clear(false);

    if (this.algorithm === 'top') {
      this.topFeedService.clear(true);
    }

    this.inProgress = true;

    try {
      if (this.algorithm === 'top') {
        await this.topFeedService
          .setEndpoint(`api/v3/newsfeed/feed/unseen-top`)
          .setLimit(3)
          .fetch(true);
      }

      await this.latestFeedService
        .setEndpoint(`api/v2/feeds/subscribed/activities`)
        .setLimit(12)
        .fetch(true);
    } catch (e) {
      console.error('SortedComponent', e);
    }

    this.inProgress = false;
  }

  loadNext() {
    if (
      this.latestFeedService.canFetchMore &&
      !this.latestFeedService.inProgress.getValue() &&
      this.latestFeedService.offset.getValue()
    ) {
      this.latestFeedService.fetch(); // load the next 150 in the background
    }
    this.latestFeedService.loadMore();
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

    this.latestFeedService.deleteItem(activity, (item, obj) => {
      return item.urn === obj.urn;
    });
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.composer) {
      return this.composer.canDeactivate();
    }
  }

  /**
   * change feed type
   **/
  changeFeedAlgorithm(type: 'latest' | 'top') {
    this.algorithm = type;
    this.storage.set(FEED_ALGORITHM_STORAGE_KEY, type);
    this.load();
  }
}
