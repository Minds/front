import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { Client } from '../../services/api';
import { MINDS_GRAPHS } from '../../components/graphs';

@Component({
  selector: 'minds-analytics-impressions',
  inputs: ['_key: key', 'span', 'unit']
})
@View({
  template: `
    <minds-graph-line [data]="data"></minds-graph-line>

    <div class="graph-labels">
      <div class="graph-label mdl-color-text--blue-grey-300" *ngFor="#point of data">
        {{point.total}}
        <b>{{point.timestamp  * 1000 | date: 'MMMd'}}</b>
      </div>
    </div>
  `,
  directives: [CORE_DIRECTIVES, MINDS_GRAPHS]
})

export class AnalyticsImpressions {

  key;
  span : number = 5;
  unit : string = "day";

  data : Array<any> = [];

  constructor(public client : Client) {
  }

  set _key(value : any){
    this.key = value;
    this.get();
  }

  get(){
    var self = this;
    this.client.get('api/v1/analytics/' + this.key, {
        span: this.span,
        unit: this.unit
      })
      .then((response : any) => {
        self.data = response.data;
      });
  }

}
