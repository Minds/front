import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take, map, mergeMap } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';
import { CookieService } from '../../../common/services/cookie.service';
import { ContextService } from '../../../services/context.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { FeaturesService } from '../../../services/features.service';
import { isPlatformServer } from '@angular/common';
import { SettingsV2Service } from '../../settings-v2/settings-v2.service';

@Component({
  selector: 'm-newsfeed--sorted',
  providers: [
    FeedsService, // Fresh feeds per component
  ],
  templateUrl: 'sorted.component.html',
})
export class NewsfeedSortedComponent implements OnInit, OnDestroy {
  algorithm: string = 'hot';
  period: string = '12h';
  customType: string = 'activities';
  hashtag: string | null = null;
  all: boolean = false;
  prepended: Array<any> = [];
  offset: number = 0;
  inProgress: boolean = false;
  moreData: boolean = true;
  rating: number = 1;

  paramsSubscription: Subscription;
  reloadFeedSubscription: Subscription;
  selectionChangeSubscription: Subscription;
  hashtagFilterChangeSubscription: Subscription;
  query: string = '';

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    protected cookieService: CookieService,
    protected context: ContextService,
    protected session: Session,
    protected settingsService: SettingsV2Service,
    protected newsfeedService: NewsfeedService,
    public feedsService: FeedsService,
    protected featuresService: FeaturesService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.session.isLoggedIn()) {
      this.rating = this.session.getLoggedInUser().boost_rating;
    }

    this.reloadFeedSubscription = this.newsfeedService.onReloadFeed.subscribe(
      () => {
        this.load(true, true);
      }
    );

    this.paramsSubscription = this.route.params.subscribe(params => {
      this.algorithm = params['algorithm'] || 'hot';
      this.period = params['period'] || '12h';
      this.customType = params['type'] || 'activities';
      this.query = params['query'] || '';

      if (typeof params['hashtag'] !== 'undefined') {
        this.hashtag = params['hashtag'] || null;
        this.all = false;
      } else if (
        typeof params['all'] !== 'undefined' ||
        this.cookieService.get('preferred_hashtag_state') !== '1'
      ) {
        this.hashtag = null;
        this.all = true;
      } else if (params['query']) {
        this.all = true;
        this.updateSortRoute();
      } else {
        this.hashtag = null;
        this.all = false;
      }

      if (
        this.algorithm != 'top' &&
        (this.customType === 'channels' || this.customType === 'groups')
      ) {
        this.algorithm = 'top';
        this.updateSortRoute();
      }

      this.load(true);
    });
  }

  ngOnInit() {
    this.context.set('activity');
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }

    if (this.reloadFeedSubscription) {
      this.reloadFeedSubscription.unsubscribe();
    }

    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }
  }

  /**
   * @param {Boolean} refresh
   * @param {Boolean} forceSync
   */
  async load(refresh: boolean = false, forceSync: boolean = false) {
    return await this.loadFromFeedsService(refresh, forceSync);
  }

  /**
   * @param {Boolean} refresh
   * @param {Boolean} forceSync
   */
  async loadFromFeedsService(
    refresh: boolean = false,
    forceSync: boolean = false
  ) {
    if (isPlatformServer(this.platformId)) return; // Logged in newsfeed for browser only
    if (refresh) {
      this.feedsService.clear();
    }

    this.inProgress = true;

    try {
      const hashtags = this.hashtag ? encodeURIComponent(this.hashtag) : '';
      const period = this.period || '';
      const all = this.all ? '1' : '';
      const query = this.query ? encodeURIComponent(this.query) : '';
      const nsfw = (this.newsfeedService.nsfw || []).join(',');

      this.feedsService
        .setEndpoint(`api/v2/feeds/global/${this.algorithm}/${this.customType}`)
        .setParams({
          hashtags,
          period,
          all,
          query,
          nsfw,
          period_fallback: 1,
        })
        .setLimit(12)
        .setCastToActivities(true)
        .fetch();
    } catch (e) {
      console.error('SortedComponent', e);
    }

    this.inProgress = false;
  }

  loadMore() {
    this.feedsService.loadMore();
  }

  delete(activity) {
    let i: any;
    for (i in this.prepended) {
      if (this.prepended[i] === activity) {
        this.prepended.splice(i, 1);
        return;
      }
    }
    // for (i in this.newsfeed) {
    //   if (this.newsfeed[i] === activity) {
    //     this.newsfeed.splice(i, 1);
    //     return;
    //   }
    // }
  }

  prepend(activity: any) {
    this.prepended.unshift(activity);
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
    //if (this.query) {
    //  return false;
    //}

    return (i > 0 && i % 5 === 0) || i === 1;
  }
}
