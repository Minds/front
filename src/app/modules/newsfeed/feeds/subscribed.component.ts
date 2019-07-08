import { Component, Injector, SkipSelf, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { MindsTitle } from '../../../services/ux/title';
import { Navigation as NavigationService } from '../../../services/navigation';
import { MindsActivityObject } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { PosterComponent } from '../poster/poster.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { FeaturesService } from "../../../services/features.service";
import { FeedsService } from "../../../common/services/feeds.service";
import { NewsfeedService } from "../services/newsfeed.service";
import { ClientMetaService } from "../../../common/services/client-meta.service";

@Component({
  selector: 'm-newsfeed--subscribed',
  providers: [ ClientMetaService ],
  templateUrl: 'subscribed.component.html',
})

export class NewsfeedSubscribedComponent {

  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: string | number = '';
  showBoostRotator: boolean = true;
  inProgress: boolean = false;
  moreData: boolean = true;
  minds;

  attachment_preview;

  message: string = '';
  newUserPromo: boolean = false;
  postMeta: any = {
    title: '',
    description: '',
    thumbnail: '',
    url: '',
    active: false,
    attachment_guid: null
  };

  paramsSubscription: Subscription;
  reloadFeedSubscription: Subscription;

  @ViewChild('poster', { static: true }) private poster: PosterComponent;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    private storage: Storage,
    private context: ContextService,
    protected featuresService: FeaturesService,
    protected feedsService: FeedsService,
    protected newsfeedService: NewsfeedService,
    protected clientMetaService: ClientMetaService,
    @SkipSelf() injector: Injector,
  ) {
    this.title.setTitle('Newsfeed');

    this.clientMetaService
      .inherit(injector)
      .setSource('feed/subscribed')
      .setMedium('feed');
  }

  ngOnInit() {
    this.reloadFeedSubscription = this.newsfeedService.onReloadFeed.subscribe(() => {
      this.load(true, true);
    });

    this.load(true, true);
    this.minds = window.Minds;

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['message']) {
        this.message = params['message'];
      }

      this.newUserPromo = !!params['newUser'];

      if (params['ts']) {
        this.showBoostRotator = false;
        this.load(true);
        setTimeout(() => {
          this.showBoostRotator = true;
        }, 300);
      }
    });

    this.context.set('activity');
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.reloadFeedSubscription.unsubscribe();
  }

  load(refresh: boolean = false, forceSync: boolean = false) {
    if (this.featuresService.has('es-feeds')) {
      this.loadFromService(refresh, forceSync);
    } else {
      this.loadLegacy(refresh);
    }
  }

  async loadFromService(refresh: boolean = false, forceSync: boolean = false) {
    if (forceSync) {
      this.inProgress = true;
      // TODO: Find a selective way to do it, in the future
      await this.feedsService.destroy();
      refresh = true;
    }

    if (!refresh && this.inProgress) {
      return;
    }

    if (refresh) {
      this.moreData = true;
      this.offset = 0;
      this.newsfeed = [];
    }

    this.inProgress = true;

    try {
      const limit = 12;

      const { entities, next } = await this.feedsService.get({
        endpoint: `api/v2/feeds/subscribed/activities`,
        timebased: true,
        limit,
        offset: <number> this.offset,
        syncPageSize: limit * 20,
        forceSync,
      });

      if (!entities || !entities.length) {
        this.moreData = false;
        this.inProgress = false;

        return false;
      }

      if (this.newsfeed && !refresh) {
        this.newsfeed.push(...entities);
      } else {
        this.newsfeed = entities;
      }

      this.offset = next;

      if (!this.offset) {
        this.moreData = false;
      }
    } catch (e) {
      console.error('SortedComponent', e);
    }

    this.inProgress = false;
  }

  /**
   * Load newsfeed
   */
  loadLegacy(refresh: boolean = false) {
    if (this.inProgress)
      return false;

    if (refresh) {
      this.offset = '';
    }

    this.inProgress = true;

    this.client.get('api/v1/newsfeed', { limit: 12, offset: this.offset }, { cache: true })
      .then((data: MindsActivityObject) => {
        if (!data.activity) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }
        if (this.newsfeed && !refresh) {
          this.newsfeed = this.newsfeed.concat(data.activity);
        } else {
          this.newsfeed = data.activity;
        }
        this.offset = data['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
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
    this.client.post('api/v2/boost/activity/' + activity.guid + '/' + activity.owner_guid,
      {
        newUserPromo: true,
        impressions: 200,
        destination: 'Newsfeed'
      });
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
    if (!this.poster || !this.poster.attachment)
      return true;
    const progress = this.poster.attachment.getUploadProgress();
    if (progress > 0 && progress < 100) {
      return confirm('Your file is still uploading. Are you sure?');
    }

    return true;
  }

}

