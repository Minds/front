import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router, RouteParams, Location, ROUTER_DIRECTIVES } from 'angular2/router';

import { Client, Upload } from '../../../services/api';
import { MINDS_GRAPHS } from '../../../components/graphs';
import { Material } from '../../../directives/material';


@Component({
  selector: 'minds-admin-analytics',
  viewBindings: [ Client ]
})
@View({
  templateUrl: 'src/controllers/admin/analytics/analytics.html',
  directives: [ CORE_DIRECTIVES, Material, ROUTER_DIRECTIVES, MINDS_GRAPHS ]
})

export class AdminAnalytics {

  dam;
  dam_list;
  mam;
  mam_list;
  boost_newsfeed = {
    review: 0,
    approved: 0,
    percent: 50,
    total: 0
  };

  constructor(public client: Client, public params : RouteParams){
    this.getActives();
    this.getBoosts();
  }

  /**
   * Return active user analytics
   */
  getActives(){
    var self = this;
    this.client.get('api/v1/admin/analytics/active')
      .then((response : any) => {
        self.dam = response['daily'];
        self.dam_list = response['daily'].slice(0).reverse();
        self.mam = response['monthly'];
        self.mam_list = response['monthly'].slice(0).reverse();
      });
  }

  /**
   * Return boost analytics
   */
  getBoosts(){
    var self = this;
    this.client.get('api/v1/admin/analytics/boost')
      .then((response : any) => {
        self.boost_newsfeed = response.newsfeed;
        self.boost_newsfeed.total = self.boost_newsfeed.review + self.boost_newsfeed.approved;
        self.boost_newsfeed.percent = (self.boost_newsfeed.approved / self.boost_newsfeed.total) * 100;
      });
  }

}
