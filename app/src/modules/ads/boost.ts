import { Component, EventEmitter, ElementRef } from '@angular/core';
import { Client } from '../../services/api';

@Component({
  selector: 'm-ads-boost',
  inputs: ['handler', 'limit'],
  template: `
    <h3 class="m-ad-boost-heading mdl-color-text--blue-grey-300"><i class="material-icons">trending_up</i> <!-- i18n -->Boosted content<!-- /i18n --></h3>
    <div class="m-ad-boost-entity" *ngFor="let entity of boosts">
      <minds-card [object]="entity" hostClass="mdl-card mdl-shadow--8dp"></minds-card>
    </div>
  `,
  host: {
    'class': 'm-ad-block m-ad-block-boosts'
  }
})

export class BoostAds{

  handler : string = "content";
  limit : number = 2;
  boosts : Array<any> = [];

  constructor(public client: Client) {
  }

  ngOnInit(){
    this.fetch();
  }

  fetch(){
    this.client.get('api/v1/boost/fetch/' + this.handler, { limit: this.limit })
      .then((response : any) => {
        if(!response.boosts){
          return;
        }
        this.boosts = response.boosts;
      })
      .catch(() => {});
  }

}
