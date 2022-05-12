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
import { isPlatformServer } from '@angular/common';
import { SettingsV2Service } from '../settings-v2/settings-v2.service';

@Component({
  selector: 'm-ads-boost',
  inputs: ['handler', 'limit'],
  templateUrl: 'ads.html',
  styleUrls: ['ads.ng.scss'],
  host: {
    class: 'm-ad-block m-ad-block-boosts',
  },
})
export class BoostAds implements OnInit {
  handler: string = 'content';
  limit: number = 2;
  offset: string = '';
  boosts: Array<any> = [];
  rating: number = 2;

  constructor(
    public client: Client,
    public session: Session,
    private storage: Storage,
    private settingsService: SettingsV2Service,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.rating = this.session.getLoggedInUser().boost_rating;
    this.fetch();
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
}
