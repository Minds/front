import { Component, CORE_DIRECTIVES, EventEmitter, ElementRef } from 'angular2/angular2';
import { Client } from '../../services/api';
import { CARDS } from '../../controllers/cards/cards';

@Component({
  selector: 'm-ads-boost',
  providers: [ Client ],
  inputs: ['handler', 'limit'],
  template: `
    <h3 class="m-ad-boost-heading mdl-color-text--blue-grey-300"><i class="material-icons">trending_up</i> Boosted content</h3>
    <div class="m-ad-boost-entity" *ng-for="#entity of boosts">
      <minds-card-video [object]="entity" class="mdl-card mdl-shadow--8dp" *ng-if="entity.subtype == 'video'"></minds-card-video>
      <minds-card-image [object]="entity" class="mdl-card mdl-shadow--8dp" *ng-if="entity.subtype == 'image'"></minds-card-image>
      <minds-card-blog [object]="entity" class="mdl-card mdl-shadow--8dp" *ng-if="entity.subtype == 'blog'"></minds-card-blog>
      <minds-card-user [object]="entity" class="mdl-card mdl-shadow--8dp" *ng-if="entity.type == 'user'"></minds-card-user>
      <minds-activity [object]="entity" class="mdl-card mdl-shadow--8dp" *ng-if="entity.type == 'activity'"></minds-activity>
    </div>
  `,
  directives: [ CORE_DIRECTIVES, CARDS ],
  host: {
    'class': 'm-ad-block m-ad-block-boosts'
  }
})

export class BoostAds{

  handler : string = "content";
  limit : number = 2;
  boosts : Array<any> = [];

  constructor(public client: Client) {
    this.fetch();
  }

  fetch(){
    this.client.get('api/v1/boost/fetch/' + this.handler, { limit: this.limit })
      .then((response : any) => {
        if(!response.boosts){
          return;
        }
        this.boosts = response.boosts;
      });
  }

}
