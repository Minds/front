import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { MindsTitle } from '../../../services/ux/title';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

import {
  AnalyticsDashboardService,
  Category,
  Response,
  Dashboard,
  Filter,
  Option,
  Metric,
  Summary,
  Visualisation,
  Bucket,
  Timespan,
  UserState,
} from './dashboard.service';

import fakeData from './fake';
import categories from './categories.default';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';

@Component({
  selector: 'm-analytics__dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  isMobile: boolean;
  cats = categories;
  paramsSubscription: Subscription;
  selectedCat: Category;
  selectedTimespan; //string? or Timespan?
  timespanFilter: Filter = {
    id: 'timespan',
    label: 'timespan',
    options: [],
  };
  vm$: Observable<UserState> = this.analyticsService.vm$;

  constructor(
    public client: Client,
    public route: ActivatedRoute,
    public session: Session,
    public title: MindsTitle,
    public analyticsService: AnalyticsDashboardService
  ) {}

  ngOnInit() {
    this.isMobile = isMobileOrTablet();
    this.title.setTitle('Analytics');

    // console.log(this.route);
    // console.log(this.route.snapshot.url);

    // TODO: implement channel filter
    // const {channelGuid} = this.analyticsService.getStateSnapshot();
    // this.searchTerm = this.analyticsService.buildSearchTermControl();
    // this.searchTerm.patchValue(channelGuid, { emitEvent: false });

    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      // TODO: if timespanParam && it !==vm$.timespan, then trigger analyticsService.updateTimespan()
      if (params['timespan']) {
        this.selectedTimespan = params['timespan'];
      }
      // TODO: do the same filter, metric, (channel)

      // TODO: something similar for category

      this.selectedCat = this.cats.find(
        // cat => cat.id === this.vm$.category
        cat => cat.id === 'traffic'
      );
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
