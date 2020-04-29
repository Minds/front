import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { SettingsService } from '../../settings/settings.service';
import { PosterComponent } from '../poster/poster.component';
import { HashtagsSelectorModalComponent } from '../../../modules/hashtags/hashtag-selector-modal/hashtags-selector.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { NewsfeedService } from '../services/newsfeed.service';

@Component({
  selector: 'm-newsfeed--top',
  templateUrl: 'top.component.html',
})
export class NewsfeedTopComponent implements OnInit, OnDestroy {
  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;
  rating: number = 1;
  allHashtags: boolean;

  paramsSubscription: Subscription;
  ratingSubscription: Subscription;
  reloadFeedSubscription: Subscription;

  @ViewChild('poster', { static: false }) private poster: PosterComponent;

  constructor(
    public client: Client,
    public upload: Upload,
    public navigation: NavigationService,
    public router: Router,
    public route: ActivatedRoute,
    private storage: Storage,
    private context: ContextService,
    private session: Session,
    private settingsService: SettingsService,
    private overlayModal: OverlayModalService,
    private newsfeedService: NewsfeedService
  ) {
    if (this.session.isLoggedIn())
      this.rating = this.session.getLoggedInUser().boost_rating;

    this.ratingSubscription = settingsService.ratingChanged.subscribe(event => {
      this.onRatingChanged(event);
    });

    this.allHashtags = this.newsfeedService.allHashtags;

    this.reloadFeedSubscription = this.newsfeedService.onReloadFeed.subscribe(
      (allHashtags: boolean) => {
        this.allHashtags = allHashtags;
        this.load(true);
      }
    );
  }

  ngOnInit() {
    this.load();

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
  }

  /**
   * Load newsfeed
   */
  load(refresh: boolean = false) {
    if (this.inProgress) return false;

    if (refresh) {
      this.moreData = true;
      this.offset = '';
      this.newsfeed = [];
    }

    this.inProgress = true;

    this.client
      .get(
        'api/v2/entities/suggested/activities' +
          (this.allHashtags ? '/all' : ''),
        {
          limit: 12,
          offset: this.offset,
          rating: this.rating,
        },
        {
          cache: true,
        }
      )
      .then((data: any) => {
        if (!data.entities || !data.entities.length) {
          this.moreData = false;
          this.inProgress = false;

          if (!this.newsfeed || this.newsfeed.length == 0) {
            this.openHashtagsSelector();
          }

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
      .catch(e => {
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

  openHashtagsSelector() {
    this.overlayModal
      .create(
        HashtagsSelectorModalComponent,
        {},
        {
          class:
            'm-overlay-modal--hashtag-selector m-overlay-modal--medium-large',
          onSelected: () => {
            this.load(true); //refresh list
          },
        }
      )
      .present();
  }
}
