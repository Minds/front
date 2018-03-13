import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Client, Upload } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-analytics',
  templateUrl: 'analytics.html'
})

export class AdminAnalytics {

  dam;
  dam_list;
  mam;
  mam_list;
  signups;
  signups_list;
  retention;
  boost_newsfeed = {
    review: 0,
    approved: 0,
    percent: 50,
    total: 0,
    review_backlog: 0,
    approved_backlog: 0,
    impressions: 0,
    impressions_met: 0
  };
  pageviews;
  pageviews_list;

  constructor(public client: Client) {
    this.getActives();
    this.getPageviews();
    this.getSignups();
    this.getRetention();
    this.getBoosts();
  }

  /**
   * Return active user analytics
   */
  getActives() {
    var self = this;
    this.client.get('api/v1/admin/analytics/active')
      .then((response: any) => {
        self.dam = response['daily'];
        self.dam_list = response['daily'].slice(0).reverse();
        self.mam = response['monthly'];
        self.mam_list = response['monthly'].slice(0).reverse();
      });
  }

  /**
   * Return pageviews
   */
  getPageviews() {
    this.client.get('api/v1/admin/analytics/pageviews')
      .then((response: any) => {
        this.pageviews = response['pageviews'];
        this.pageviews_list = response['pageviews'].slice(0).reverse();
      });
  }

  /**
   * Return signups
   */
  getSignups() {
    this.client.get('api/v1/admin/analytics/signups')
      .then((response: any) => {
        this.signups = response['daily'];
        this.signups_list = response['daily'].slice(0).reverse();
      });
  }

  /**
   * Return retention rates
   */
  getRetention() {
    this.client.get('api/v1/admin/analytics/retention')
      .then((response: any) => {
        this.retention = response.retention[0];
        console.log(this.retention);
      });
  }

  /**
   * Return boost analytics
   */
  getBoosts() {
    var self = this;
    this.client.get('api/v1/admin/analytics/boost')
      .then((response: any) => {
        self.boost_newsfeed = response.newsfeed;
        self.boost_newsfeed.total = self.boost_newsfeed.review + self.boost_newsfeed.approved;
        self.boost_newsfeed.percent = (self.boost_newsfeed.approved / self.boost_newsfeed.total) * 100;
      });
  }

}
