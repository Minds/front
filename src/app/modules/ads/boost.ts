import {
  Component,
  OnDestroy,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Client } from '../../services/api';

import { Session } from '../../services/session';
import { Storage } from '../../services/storage';
import { Subscription } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'm-ads-boost',
  inputs: ['handler', 'limit'],
  template: `
    <h3 class="m-newsfeedSidebar__header">
      <ng-container i18n="@@ADS__BOOSTED_CONTENT">Boosted content</ng-container>
    </h3>
    <div class="m-ad-boost-entity" *ngFor="let entity of boosts">
      <minds-card [object]="entity" hostClass="mdl-card m-border"></minds-card>
    </div>
  `,
  host: {
    class: 'm-ad-block m-ad-block-boosts',
  },
})
export class BoostAds implements OnInit, OnDestroy {
  handler: string = 'content';
  limit: number = 2;
  offset: string = '';
  boosts: Array<any> = [];
  rating: number = 2;

  ratingSubscription: Subscription;

  constructor(
    public client: Client,
    public session: Session,
    private storage: Storage,
    private settingsService: SettingsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.rating = this.session.getLoggedInUser().boost_rating;
    this.ratingSubscription = this.settingsService.ratingChanged.subscribe(
      rating => {
        this.onRatingChanged(rating);
      }
    );
    this.fetch();
  }

  ngOnDestroy() {
    this.ratingSubscription.unsubscribe();
  }

  fetch() {
    if (isPlatformServer(this.platformId)) return;
    if (this.storage.get('boost:offset:sidebar'))
      this.offset = this.storage.get('boost:offset:sidebar');
    this.client
      .get('api/v1/boost/fetch/' + this.handler, {
        limit: this.limit,
        offset: this.offset,
        rating: this.rating,
      })
      .then((response: any) => {
        if (!response.boosts) {
          return;
        }
        this.boosts = response.boosts;

        if (response['load-next'])
          this.storage.set('boost:offset:sidebar', response['load-next']);
      });
  }

  onRatingChanged(rating: number) {
    this.rating = rating;
    this.storage.destroy('boost:offset:sidebar');
    this.offset = '';
    this.fetch();
  }
}
