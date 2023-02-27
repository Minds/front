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
import { isPlatformServer } from '@angular/common';
import { DynamicBoostExperimentService } from '../experiments/sub-services/dynamic-boost-experiment.service';
import { BoostLocation } from '../boost/modal-v2/boost-modal-v2.types';
import { BehaviorSubject } from 'rxjs';

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
  inProgress$ = new BehaviorSubject<boolean>(false);
  moreData$ = new BehaviorSubject<boolean>(true);

  constructor(
    public client: Client,
    public session: Session,
    private storage: Storage,
    private dynamicBoostExperiment: DynamicBoostExperimentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.rating = this.session.getLoggedInUser().boost_rating;
    this.fetch();
  }

  fetch() {
    if (isPlatformServer(this.platformId)) return;

    if (this.dynamicBoostExperiment.isActive()) {
      this.fetchV3BoostsAsync();
    } else {
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
          this.boosts.push(response.boosts);

          if (response['load-next']) {
            this.moreData$.next(true);
            this.storage.set('boost:offset:sidebar', response['load-next']);
          }
        });
    }
  }

  private async fetchV3BoostsAsync(): Promise<void> {
    try {
      this.inProgress$.next(true);
      const response: any = await this.client.get('api/v3/boosts/feed', {
        limit: this.limit,
        location: BoostLocation.SIDEBAR,
      });

      if (!response || !response.boosts) {
        return;
      }

      const boostEntities: any[] = response.boosts.map(boost => boost.entity);
      if (!this.boosts.length) {
        this.boosts = boostEntities;
        return;
      }
      console.log('pushing to ', this.boosts, boostEntities);
      console.log();
      this.boosts.push(...boostEntities);
    } catch (e) {
      console.error(e);
    } finally {
      this.inProgress$.next(false);
    }
  }
}
