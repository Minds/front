import {
  Component,
  Injector,
  SkipSelf,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import {
  ActivatedRoute,
  Router,
  RouterEvent,
  NavigationEnd,
} from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { Navigation as NavigationService } from '../../../services/navigation';
import { MindsActivityObject } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { PosterComponent } from '../poster/poster.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { FeaturesService } from '../../../services/features.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'm-newsfeed--subscribed',
  providers: [ClientMetaService, FeedsService],
  templateUrl: 'subscribed.component.html',
})
export class NewsfeedSubscribedComponent {
  newsfeed: Array<Object>;
  feed: BehaviorSubject<Array<Object>> = new BehaviorSubject([]);
  prepended: Array<any> = [];
  offset: string | number = '';
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;

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

  @ViewChild('poster', { static: true }) private poster: PosterComponent;

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
    @SkipSelf() injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.clientMetaService
      .inherit(injector)
      .setSource('feed/subscribed')
      .setMedium('feed');
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

    this.load(true, true);

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['message']) {
        this.message = params['message'];
      }

      this.newUserPromo = !!params['newUser'];
    });

    this.context.set('activity');
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.reloadFeedSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  load(refresh: boolean = false, forceSync: boolean = false) {
    if (isPlatformServer(this.platformId)) return;
    if (this.featuresService.has('es-feeds')) {
      this.loadFromService(refresh, forceSync);
    } else {
      this.loadLegacy(refresh);
    }
  }

  loadNext() {
    if (this.featuresService.has('es-feeds')) {
      if (
        this.feedsService.canFetchMore &&
        !this.feedsService.inProgress.getValue() &&
        this.feedsService.offset.getValue()
      ) {
        this.feedsService.fetch(); // load the next 150 in the background
      }
      this.feedsService.loadMore();
    } else {
      this.loadLegacy();
    }
  }

  async loadFromService(refresh: boolean = false, forceSync: boolean = false) {
    if (!refresh) {
      return;
    }

    if (refresh) {
      this.moreData = true;
      this.offset = 0;
      this.newsfeed = [];
    }

    this.inProgress = true;

    try {
      this.feedsService
        .setEndpoint(`api/v2/feeds/subscribed/activities`)
        .setLimit(12)
        .fetch();
    } catch (e) {
      console.error('SortedComponent', e);
    }
  }

  /**
   * Load newsfeed
   */
  loadLegacy(refresh: boolean = false) {
    if (this.inProgress) return;

    if (refresh) {
      this.offset = '';
      this.feedsService.clear();
    }

    this.feedsService.inProgress.next(true);
    if (!this.offset) {
      this.feedsService.setOffset(0);
    } else {
      this.feedsService.setOffset(this.feedsService.rawFeed.getValue().length);
    }
    this.inProgress = true;

    this.client
      .get(
        'api/v1/newsfeed',
        { limit: 12, offset: this.offset },
        { cache: true }
      )
      .then((data: MindsActivityObject) => {
        if (!data.activity) {
          this.moreData = false;
          this.feedsService.inProgress.next(false);
          return false;
        }

        const feedItems = [];
        for (const entity of data.activity) {
          feedItems.push({
            urn: entity.urn,
            guid: entity.guid,
            owner_guid: entity.owner_guid,
            entity: entity,
          });
        }

        if (this.feedsService.rawFeed.getValue() && !refresh) {
          this.feedsService.rawFeed.next([
            ...this.feedsService.rawFeed.getValue(),
            ...feedItems,
          ]);
        } else {
          this.feedsService.rawFeed.next(feedItems);
        }

        this.feedsService.inProgress.next(false);
        //this.feedsService.setOffset(this.feedsService.offset.getValue() + 12); // Hacky!
        this.offset = data['load-next'];
        this.inProgress = false;
      })
      .catch(e => {
        console.error(e);
        this.inProgress = false;
      });
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
    for (i in this.newsfeed) {
      if (this.newsfeed[i] === activity) {
        this.newsfeed.splice(i, 1);
        return;
      }
    }
  }

  canDeactivate() {
    if (!this.poster || !this.poster.attachment) return true;
    const progress = this.poster.attachment.getUploadProgress();
    if (progress > 0 && progress < 100) {
      return confirm('Your file is still uploading. Are you sure?');
    }

    return true;
  }
}
