import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { MindsTitle } from '../../../services/ux/title';
import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { SettingsService } from '../../settings/settings.service';
import { PosterComponent } from '../poster/poster.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { NewsfeedService } from '../services/newsfeed.service';
import { TopbarHashtagsService } from "../../hashtags/service/topbar.service";
import { NewsfeedHashtagSelectorService } from "../services/newsfeed-hashtag-selector.service";
import { FeedsService } from "../../../common/services/feeds.service";
import { FeaturesService } from "../../../services/features.service";

@Component({
  selector: 'm-newsfeed--sorted',
  templateUrl: 'sorted.component.html'
})

export class NewsfeedSortedComponent implements OnInit, OnDestroy {
  algorithm: string = 'hot';
  period: string = '12h';
  customType: string = 'activities';
  hashtag: string | null = null;
  all: boolean = false;
  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: number = 0;
  inProgress: boolean = false;
  moreData: boolean = true;
  rating: number = 1;
  minds;

  paramsSubscription: Subscription;
  ratingSubscription: Subscription;
  reloadFeedSubscription: Subscription;
  selectionChangeSubscription: Subscription;
  hashtagFilterChangeSubscription: Subscription;
  query: string = '';

  @ViewChild('poster') private poster: PosterComponent;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    protected storage: Storage,
    protected context: ContextService,
    protected session: Session,
    protected settingsService: SettingsService,
    protected overlayModal: OverlayModalService,
    protected newsfeedService: NewsfeedService,
    protected topbarHashtagsService: TopbarHashtagsService,
    protected newsfeedHashtagSelectorService: NewsfeedHashtagSelectorService,
    protected feedsService: FeedsService,
    protected featuresService: FeaturesService,
  ) {
    this.title.setTitle('Newsfeed');

    if (this.session.isLoggedIn()) {
      this.rating = this.session.getLoggedInUser().boost_rating;
    }

    this.ratingSubscription = settingsService.ratingChanged.subscribe((event) => {
      this.onRatingChanged(event);
    });

    this.reloadFeedSubscription = this.newsfeedService.onReloadFeed.subscribe(() => {
      this.load(true, true);
    });

    this.selectionChangeSubscription = this.topbarHashtagsService.selectionChange.subscribe(() => {
      this.load(true, true);
    });

    this.paramsSubscription = this.route.params.subscribe(params => {
      this.algorithm = params['algorithm'] || 'hot';
      this.period = params['period'] || '12h';
      this.customType = params['type'] || 'activities';
      this.query = params['query'] || '';

      if (typeof params['hashtag'] !== 'undefined') {
        this.hashtag = params['hashtag'] || null;
        this.all = false;
      } else if (typeof params['all'] !== 'undefined') {
        this.hashtag = null;
        this.all = true;
      } else if (params['query']) {
        this.all = true;
        this.updateSortRoute();
      } else {
        this.hashtag = null;
        this.all = false;
      }

      if (this.algorithm != 'top' 
        && (this.customType === 'channels' || this.customType === 'groups')
      ) {
        this.algorithm = 'top';
        this.updateSortRoute();
      } 

      this.load(true);
    });
  }

  ngOnInit() {
    this.minds = window.Minds;
    this.context.set('activity');

    this.hashtagFilterChangeSubscription = this.newsfeedHashtagSelectorService.subscribe(({ type, value }) => {
      switch (type) {
        case 'single':
          this.hashtag = value;
          this.all = false;
          this.query = '';
          break;

        case 'all':
          this.hashtag = null;
          this.all = true;
          this.query = '';
          break;

        case 'preferred':
          this.hashtag = null;
          this.all = false;
          this.query = '';
          break;
      }

      this.updateSortRoute();
    }, 300);
  }

  ngOnDestroy() {
    if (this.ratingSubscription) {
      this.ratingSubscription.unsubscribe();
    }

    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }

    if (this.reloadFeedSubscription) {
      this.reloadFeedSubscription.unsubscribe();
    }

    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }

    if (this.hashtagFilterChangeSubscription) {
      this.hashtagFilterChangeSubscription.unsubscribe();
    }
  }

  /**
   * @param {Boolean} refresh
   * @param {Boolean} forceSync
   */
  async load(refresh: boolean = false, forceSync: boolean = false) {
    if (this.inProgress) {
      return false;
    }

    if (this.featuresService.has('sync-feeds')) {
      return await this.loadFromFeedsService(refresh, forceSync);
    } else {
      return await this.loadLegacy(refresh);
    }
  }

  /**
   * @param {Boolean} refresh
   * @param {Boolean} forceSync
   */
  async loadFromFeedsService(refresh: boolean = false, forceSync: boolean = false) {
    if (forceSync) {
      // TODO: Find a selective way to do it, in the future
      await this.feedsService.destroy();
      refresh = true;
    }

    if (refresh) {
      this.moreData = true;
      this.offset = 0;
      this.newsfeed = [];
    }

    this.inProgress = true;

    try {
      const limit = 12;

      const hashtags = this.hashtag ? encodeURIComponent(this.hashtag) : '';
      const period = this.period || '';
      const all = this.all ? '1' : '';
      const query = this.query || '';
      const nsfw = (this.newsfeedService.nsfw || []).join(',');

      const { entities, next } = await this.feedsService.get({
        endpoint: `api/v2/feeds/global/${this.algorithm}/${this.customType}?hashtags=${hashtags}&period=${period}&all=${all}&query=${query}&nsfw=${nsfw}`,
        timebased: false,
        limit,
        offset: <number> this.offset,
        forceSync,
      });

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
   * @deprecated
   * @param {Boolean} refresh
   */
  loadLegacy(refresh: boolean = false) {
    if (refresh) {
      this.moreData = true;
      this.offset = null;
      this.newsfeed = [];
    }

    this.inProgress = true;

    this.client.get(`api/v2/feeds/global/${this.algorithm}/${this.customType}`, {
      limit: 12,
      offset: this.offset || '',
      rating: this.rating || '',
      hashtags: this.hashtag ? [this.hashtag] : '',
      period: this.period || '',
      all: this.all ? 1 : '',
      query: this.query || '',
      nsfw: this.newsfeedService.nsfw,
    }, {
      cache: true
    })
      .then((data: any) => {
        if (!data.entities || !data.entities.length) {
          this.moreData = false;
          this.inProgress = false;

          return false;
        }
        if (this.newsfeed && !refresh) {
          this.newsfeed = this.newsfeed.concat(data.entities);
        } else {
          this.newsfeed = data.entities;
        }
        this.offset = data['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        console.log(e);
        this.inProgress = false;
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

  prepend(activity: any) {
    this.prepended.unshift(activity);
  }

  onRatingChanged(rating) {
    this.rating = rating;

    this.load(true);
  }

  setSort(algorithm: string, period: string | null, customType: string | null) {
    this.algorithm = algorithm;
    this.period = period;
    this.customType = customType;

    this.updateSortRoute();
  }

  updateSortRoute() {
    let route: any[] = ['newsfeed/global', this.algorithm];
    const params: any = {};

    if (this.period) {
      params.period = this.period;
    }

    if (this.customType && this.customType !== 'activities') {
      params.type = this.customType;
    }

    if (this.hashtag) {
      params.hashtag = this.hashtag;
    } else if (this.all) {
      params.all = 1;
    }

    if (this.query) {
      params.hashtag = null;
      params.query = this.query;
    }

    route.push(params);
    this.router.navigate(route);
  }

  isActivityFeed() {
    return this.customType != 'channels' && this.customType !== 'groups';
  }

  shouldShowBoost(i: number) {
    if (this.query) {
      return false;
    }

    return (i > 0 && (i % 8) === 0 && i <= 40) || i === 2;
  }
}
