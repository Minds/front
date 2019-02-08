import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { MindsTitle } from '../../../services/ux/title';
import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { SettingsService } from '../../settings/settings.service';
import { PosterComponent } from '../poster/poster.component';
import { HashtagsSelectorModalComponent } from '../../../modules/hashtags/hashtag-selector-modal/hashtags-selector.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { NewsfeedService } from '../services/newsfeed.service';
import { TopbarHashtagsService } from "../../hashtags/service/topbar.service";

@Component({
  selector: 'm-newsfeed--sorted',
  templateUrl: 'sorted.component.html'
})

export class NewsfeedSortedComponent implements OnInit, OnDestroy {
  algorithm: string = 'hot';
  period: string = '12h';
  customType: string = 'activities';
  hashtags: Array<string> = [];
  all: boolean = false;
  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;
  rating: number = 1;
  minds;

  paramsSubscription: Subscription;
  ratingSubscription: Subscription;
  reloadFeedSubscription: Subscription;
  selectionChangeSubscription: Subscription;

  @ViewChild('poster') private poster: PosterComponent;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    private storage: Storage,
    private context: ContextService,
    private session: Session,
    private settingsService: SettingsService,
    private overlayModal: OverlayModalService,
    private newsfeedService: NewsfeedService,
    private topbarHashtagsService: TopbarHashtagsService,
  ) {
    this.title.setTitle('Newsfeed');

    if (this.session.isLoggedIn())
      this.rating = this.session.getLoggedInUser().boost_rating;

    this.ratingSubscription = settingsService.ratingChanged.subscribe((event) => {
      this.onRatingChanged(event);
    });

    this.reloadFeedSubscription = this.newsfeedService.onReloadFeed.subscribe(() => {
      this.load(true);
    });

    this.selectionChangeSubscription = this.topbarHashtagsService.selectionChange.subscribe(() => {
      this.load(true);
    });

    this.paramsSubscription = this.route.params.subscribe(params => {
      this.algorithm = params['algorithm'] || 'hot';
      this.period = params['period'] || '12h';
      this.customType = params['type'] || 'activities';

      if (typeof params['hashtag'] !== 'undefined') {
        this.hashtags = params['hashtag'] ? [params['hashtag']] : null;
        this.all = false;
      } else if (typeof params['all'] !== 'undefined') {
        this.hashtags = null;
        this.all = true;
      } else {
        this.hashtags = null;
        this.all = false;
      }

      this.load(true);
    });
  }

  ngOnInit() {
    this.minds = window.Minds;

    this.context.set('activity');
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
  }

  /**
   * Load newsfeed
   */
  async load(refresh: boolean = false) {
    if (this.inProgress)
      return false;

    if (refresh) {
      this.moreData = true;
      this.offset = '';
      this.newsfeed = [];
    }

    this.inProgress = true;

    this.client.get(`api/v2/feeds/global/${this.algorithm}/${this.customType}`, {
      limit: 12,
      offset: this.offset || '',
      rating: this.rating || '',
      hashtags: this.hashtags || '',
      period: this.period || '',
      all: this.all ? 1 : '',
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
}
