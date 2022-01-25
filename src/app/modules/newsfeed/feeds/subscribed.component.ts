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
import { FeaturesService } from '../../../services/features.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { isPlatformServer } from '@angular/common';
import { ComposerComponent } from '../../composer/composer.component';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { ExperimentsService } from '../../experiments/experiments.service';

@Component({
  selector: 'm-newsfeed--subscribed',
  providers: [FeedsService],
  templateUrl: 'subscribed.component.html',
})
export class NewsfeedSubscribedComponent implements OnInit, OnDestroy {
  feed: BehaviorSubject<Array<Object>> = new BehaviorSubject([]);
  prepended: Array<any> = [];
  offset: string | number = '';
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
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
    @SkipSelf() injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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

    this.inProgress = true;

    let queryParams = {
      algorithm: this.algorithm,
    };

    if (this.experiments.hasVariation('newsfeed-group-posts', true)) {
      queryParams['include_group_posts'] = true;
    }

    try {
      this.feedsService
        .setEndpoint(`api/v2/feeds/subscribed/activities`)
        .setParams({
          algorithm: this.algorithm,
        })
        .setLimit(12)
        .fetch(refresh);
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
}
