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

  // TODO: get this from backend
  cats = categories;

  subscription: Subscription;
  paramsSubscription: Subscription;
  selectedCat: Category;
  selectedTimespan; //string? or Timespan?
  timespanFilter: Filter = {
    id: 'timespan',
    label: 'timespan',
    options: [],
  };
  vm$: Observable<UserState> = this.analyticsService.vm$;
  vm: UserState;

  constructor(
    public client: Client,
    public route: ActivatedRoute,
    private router: Router,
    public session: Session,
    public title: MindsTitle,
    public analyticsService: AnalyticsDashboardService
  ) {}

  ngOnInit() {
    // TODO: why wasn't this working? didn't reroute
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isMobile = isMobileOrTablet();
    this.title.setTitle('Analytics');

    // TODO: Autoset activeCat from url segment[2]
    // console.log(this.route);
    // console.log(this.route.snapshot.url);

    // TODO: make timespans[] into a filter

    // TODO: implement channel filter
    // const {channelGuid} = this.analyticsService.getStateSnapshot();
    // this.searchTerm = this.analyticsService.buildSearchTermControl();
    // this.searchTerm.patchValue(channelGuid, { emitEvent: false });
    this.subscription = this.vm$.subscribe(viewModel => (this.vm = viewModel));

    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      // TODO: do the same filter, metric, channel
      // TODO: something similar for category
      if (params['timespan'] && params['timespan'] !== this.vm.timespan) {
        this.updateTimespan(params['timespan']);
      }

      this.selectedCat = this.cats.find(
        // TODO get this from url segment[2]
        cat => cat.id === this.vm.category
      );
    });
  }

  updateTimespan(timespanId) {
    // TODO
    // update url
    // this.analyticsService.updateTimespan(timespanId);
  }

  updateCategory(categoryId) {
    // TODO
    // update url
    // this.analyticsService.updateTimespan(categoryId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.paramsSubscription.unsubscribe();
  }
}
