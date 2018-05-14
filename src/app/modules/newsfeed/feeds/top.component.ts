import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { Client, Upload } from '../../../services/api';
import { MindsTitle } from '../../../services/ux/title';
import { Navigation as NavigationService } from '../../../services/navigation';
import { MindsActivityObject } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { SettingsService } from '../../settings/settings.service';
import { PosterComponent } from '../poster/poster.component';

@Component({
  selector: 'm-newsfeed--top',
  templateUrl: 'top.component.html'
})

export class NewsfeedTopComponent implements OnInit, OnDestroy {

  newsfeed: Array<Object>;
  prepended: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;
  rating: number = 1;
  minds;

  paramsSubscription: Subscription;
  ratingSubscription: Subscription;

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
    private settingsService: SettingsService
  ) {
    this.title.setTitle('Newsfeed');

    if (this.session.isLoggedIn())
      this.rating = this.session.getLoggedInUser().boost_rating;

    this.ratingSubscription = settingsService.ratingChanged.subscribe((event) => {
      this.onRatingChanged(event);
    });
  }

  ngOnInit() {
    this.load();
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
  }

  /**
   * Load newsfeed
   */
  load(refresh: boolean = false) {
    if (this.inProgress)
      return false;

    if (refresh) {
      this.offset = '';
    }

    this.inProgress = true;

    this.client.get('api/v1/newsfeed/top', { limit: 12, offset: this.offset, rating: this.rating }, { cache: true })
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
      .catch(function (e) {
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

  onRatingChanged(rating) {
    this.rating = rating;

    this.load(true);
  }

}

