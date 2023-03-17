import {
  Component,
  OnInit,
  Inject,
  Input,
  PLATFORM_ID,
  Optional,
  SkipSelf,
} from '@angular/core';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { Storage } from '../../services/storage';
import { isPlatformServer } from '@angular/common';
import { DynamicBoostExperimentService } from '../experiments/sub-services/dynamic-boost-experiment.service';
import { BoostLocation } from '../boost/modal-v2/boost-modal-v2.types';
import { ClientMetaData } from '../../common/services/client-meta.service';
import { ClientMetaDirective } from '../../common/directives/client-meta.directive';

/**
 * @describe params for getting boost ads from the feed endpoint.
 */
type BoostFeedAdsParams = {
  limit: number;
  location: number;
  served_by_guid?: string;
};

@Component({
  selector: 'm-ads-boost',
  templateUrl: 'ads.html',
  styleUrls: ['ads.ng.scss'],
  host: {
    class: 'm-ad-block m-ad-block-boosts',
  },
})
export class BoostAds implements OnInit {
  @Input() handler: string = 'content';
  @Input() limit: number = 2;

  offset: string = '';
  boosts: Array<any> = [];
  rating: number = 2;

  constructor(
    public client: Client,
    public session: Session,
    private storage: Storage,
    private dynamicBoostExperiment: DynamicBoostExperimentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @SkipSelf() private parentClientMeta: ClientMetaDirective
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
          this.boosts = response.boosts;

          if (response['load-next'])
            this.storage.set('boost:offset:sidebar', response['load-next']);
        });
    }
  }

  private async fetchV3BoostsAsync(): Promise<void> {
    try {
      let opts: BoostFeedAdsParams = {
        limit: this.limit,
        location: BoostLocation.SIDEBAR,
      };

      if (this.parentClientMeta) {
        const clientMetaData: ClientMetaData = this.parentClientMeta.build();
        opts['served_by_guid'] = clientMetaData.served_by_guid;
        opts['source'] = clientMetaData.source;
      }

      const response: any = await this.client.get('api/v3/boosts/feed', opts);

      if (!response || !response.boosts) {
        return;
      }

      this.boosts = response.boosts.map(boost => boost.entity);
    } catch (e) {
      console.error(e);
    }
  }
}
