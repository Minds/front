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
import { BlockListService } from '../../common/services/block-list.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'm-ads-boost',
  inputs: ['handler', 'limit'],
  template: `
    <h3 class="m-newsfeedSidebar__header">
      <ng-container i18n="@@ADS__BOOSTED_CONTENT">Boosted content</ng-container>
    </h3>
    <div class="m-ad-boost-entity" *ngFor="let entity of boosts">
      <minds-card [object]="entity" class="mdl-card m-border"></minds-card>
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
  blockedSubscription: Subscription;

  constructor(
    public client: Client,
    public session: Session,
    private storage: Storage,
    private settingsService: SettingsV2Service,
    private blockListService: BlockListService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.rating = this.session.getLoggedInUser().boost_rating;
    this.fetch();
  }

  ngOnDestroy(): void {
    if (this.blockedSubscription) {
      this.blockedSubscription.unsubscribe();
    }
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
        this.filterBlocked();

        if (response['load-next'])
          this.storage.set('boost:offset:sidebar', response['load-next']);
      });
  }

  /**
   * Filter blocked users from this.boosts using value in BlockListService.
   * @returns { void }
   */
  filterBlocked(): void {
    this.blockedSubscription = this.blockListService.blocked
      .pipe(take(1))
      .subscribe((blockList: string[]) => {
        this.boosts = this.boosts.filter(boost => {
          // if owner_guid is in list
          if (blockList.indexOf(boost.owner_guid) > -1) {
            return false;
          }
          // owner_guid is 0 for type users, so instead check for the entities guid
          if (boost.type === 'user' && blockList.indexOf(boost.guid) > -1) {
            return false;
          }
          // not blocked
          return true;
        });
      });
  }
}
