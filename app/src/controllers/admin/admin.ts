import { Component, View, CORE_DIRECTIVES } from 'angular2/angular2';
import { Router, RouteParams, Location, ROUTER_DIRECTIVES } from 'angular2/router';
import { Client, Upload } from '../../services/api';
import { Material } from '../../directives/material';

import { AdminAnalytics } from './analytics/analytics';
import { AdminBoosts } from './boosts/boosts';
import { AdminPages } from './pages/pages';

@Component({
  selector: 'minds-admin',
  viewBindings: [ Client ]
})
@View({
  template: `
    <minds-admin-analytics *ng-if="filter == 'analytics'"></minds-admin-analytics>
    <minds-admin-boosts *ng-if="filter == 'boosts'"></minds-admin-boosts>
    <minds-admin-pages *ng-if="filter == 'pages'"></minds-admin-pages>
  `,
  directives: [ CORE_DIRECTIVES, Material, ROUTER_DIRECTIVES, AdminAnalytics, AdminBoosts, AdminPages ]
})

export class Admin {

  filter : string = "";

  constructor(public params : RouteParams){
    if(params.params['filter'])
      this.filter = params.params['filter']
  }

}
