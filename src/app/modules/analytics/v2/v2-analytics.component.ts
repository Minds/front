import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MindsTitle } from '../../../services/ux/title';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-v2Analytics',
  templateUrl: './v2-analytics.component.html',
  styleUrls: ['./v2-analytics.component.scss'],
})
export class V2AnalyticsComponent implements OnInit, OnDestroy {
  time: string = 'today';
  activeTab: string = 'traffic';
  paramsSubscription: Subscription;

  tabs: Array<any> = [
    {
      name: 'summary',
      layout: 'dashboard',
      children: [
        {
          name: 'active_users',
        },
        {
          name: 'pageviews',
        },
        {
          name: 'unique_visitors',
        },
      ],
    },
    {
      name: 'traffic',
      layout: 'filterable-chart',
      children: [
        {
          name: 'active_users',
          filters: ['user_state', 'platform'],
        },
        {
          name: 'signups',
          filters: ['platform'],
        },
        {
          name: 'unique_visitors',
          filters: ['platform'],
        },
        {
          name: 'pageviews',
          filters: ['user_state', 'content', 'platform', 'boosted'],
        },
        {
          name: 'impressions',
          filters: ['user_state', 'content', 'platform', 'boosted'],
        },
      ],
    },
    {
      name: 'engagement',
      layout: 'filterable-chart',
      children: [
        {
          name: 'posts',
          filters: ['user_state', 'content', 'platform', 'boosted'],
        },
        {
          name: 'votes',
          filters: ['user_state', 'content', 'platform', 'boosted'],
        },
        {
          name: 'comments',
          filters: ['user_state', 'content', 'platform', 'boosted'],
        },
        {
          name: 'reminds',
          filters: ['user_state', 'content', 'platform', 'boosted'],
        },
      ],
    },
  ];

  constructor(
    public client: Client,
    public route: ActivatedRoute,
    public session: Session,
    public title: MindsTitle
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
      if (params['time']) {
        this.time = params['time'];
      }
      this.title.setTitle('Analytics - ' + this.activeTab);
      this.load();
    });
  }

  load() {
    // use service with params: tab, time, etc...
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
