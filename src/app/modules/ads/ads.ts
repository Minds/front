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
import { isPlatformServer } from '@angular/common';
import { BoostLocation } from '../boost/modal-v2/boost-modal-v2.types';
import { ClientMetaData } from '../../common/services/client-meta.service';
import { ClientMetaDirective } from '../../common/directives/client-meta.directive';
import { BoostModalV2LazyService } from '../boost/modal-v2/boost-modal-v2-lazy.service';

/**
 * @describe params for getting boost ads from the feed endpoint.
 */
type BoostFeedAdsParams = {
  limit: number;
  location: number;
  served_by_guid?: string;
  source?: string;
};

@Component({
  selector: 'm-ads-boost',
  templateUrl: 'ads.html',
  styleUrls: ['ads.ng.scss'],
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
    private boostModal: BoostModalV2LazyService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @SkipSelf() private parentClientMeta: ClientMetaDirective
  ) {}

  ngOnInit() {
    this.rating = this.session.getLoggedInUser().boost_rating;
    this.fetchAsync();
  }

  public async fetchAsync(): Promise<void> {
    if (isPlatformServer(this.platformId)) return;

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

      this.boosts = response.boosts.map((boost) => boost.entity);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Opens boost modal for a boost on the session's logged in channel.
   * @returns { Promise<void> }
   */
  public async openBoostChannelModal(): Promise<void> {
    await this.boostModal.open(this.session.getLoggedInUser());
  }
}
