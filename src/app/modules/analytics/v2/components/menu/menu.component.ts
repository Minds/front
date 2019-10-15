import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  ParamMap,
  RoutesRecognized,
} from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';

import {
  AnalyticsDashboardService,
  Category,
  UserState,
} from '../../dashboard.service';

import categories from '../../categories.default';
import isMobileOrTablet from '../../../../../helpers/is-mobile-or-tablet';

@Component({
  selector: 'm-analytics__menu',
  templateUrl: './menu.component.html',
})
export class AnalyticsMenuComponent implements OnInit {
  isMobile: boolean;
  expanded: boolean = false;
  minds;
  user;
  cats = categories;

  // subscription: Subscription;
  // paramsSubscription: Subscription;
  // category$ = this.analyticsService.category$;
  selectedCat: string;

  constructor(
    // public client: Client,
    public route: ActivatedRoute,
    // private router: Router,
    // public analyticsService: AnalyticsDashboardService,
    // private cd: ChangeDetectorRef
    public session: Session
  ) {}

  ngOnInit() {
    this.minds = window.Minds;
    this.isMobile = isMobileOrTablet();

    this.user = this.session.getLoggedInUser();
  }

  // updateCategory(categoryId) {
  //   this.analyticsService.updateCategory(categoryId);
  // }

  // detectChanges() {
  //   this.cd.markForCheck();
  //   this.cd.detectChanges();
  // }
}
