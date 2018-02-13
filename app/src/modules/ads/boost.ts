import { Component } from '@angular/core';
import { Client } from '../../services/api';
import { Storage } from '../../services/storage';

@Component({
  selector: 'm-ads-boost',
  inputs: ['handler', 'limit'],
  template: `
    <h3 class="m-ad-boost-heading mdl-color-text--blue-grey-300">
      <i class="material-icons">trending_up</i> <ng-container i18n="@@ADS__BOOSTED_CONTENT">Boosted content</ng-container>
    </h3>
    <div class="m-ad-boost-entity" *ngFor="let entity of boosts">
      <minds-card [object]="entity" hostClass="mdl-card m-border"></minds-card>
    </div>
  `,
  host: {
    'class': 'm-ad-block m-ad-block-boosts'
  }
})

export class BoostAds {

  handler: string = 'content';
  limit: number = 2;
  offset: string = '';
  boosts: Array<any> = [];

  constructor(public client: Client, private storage: Storage) {
  }

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    if (this.storage.get('boost:offset:sidebar'))
      this.offset = this.storage.get('boost:offset:sidebar');
    this.client.get('api/v1/boost/fetch/' + this.handler, { limit: this.limit, offset: this.offset })
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
