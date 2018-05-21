import { Component } from '@angular/core';

import { Client } from '../../../services/api';

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
    this.client.get('api/v1/admin/analytics/active')
      .then((response: any) => {
        this.dam = response['daily'];
        this.dam_list = response['daily'].slice(0).reverse();
        this.mam = response['monthly'];
        this.mam_list = response['monthly'].slice(0).reverse();
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
    this.client.get('api/v1/admin/analytics/boost')
      .then((response: any) => {
        this.boost_newsfeed = response.newsfeed;
        this.boost_newsfeed.total = this.boost_newsfeed.review + this.boost_newsfeed.approved;
        this.boost_newsfeed.percent = (this.boost_newsfeed.approved / this.boost_newsfeed.total) * 100;
      });
  }

}
