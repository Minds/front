import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoginReferrerService } from '../../../services/login-referrer.service';
import { Session } from '../../../services/session';
import { DynamicBoostExperimentService } from '../../experiments/sub-services/dynamic-boost-experiment.service';
import {
  BoostConsoleSuitabilityFilterType,
  BoostConsoleStateFilter,
  BoostState,
} from '../boost.types';
import { BoostConsoleService } from './services/console.service';

@Component({
  selector: 'm-boostConsole',
  templateUrl: './console-v2.component.html',
  styleUrls: ['./console-v2.component.ng.scss'],
})
export class BoostConsoleV2Component implements OnInit {
  /** @type { Subscription } routeSubscription - subscription to ActivatedRoutes query params*/
  private routeSubscription: Subscription;

  /** @type { BehaviorSubject<boolean> } are we viewing the boost console in the context of the admin console? */
  public readonly adminContext$: BehaviorSubject<boolean> = this.service
    .adminContext$;

  /** @type { BehaviorSubject<BoostConsoleStateFilter> } state filter from service. */
  public readonly stateFilterValue$: BehaviorSubject<
    BoostConsoleStateFilter
  > = this.service.stateFilterValue$;

  /** @type { BehaviorSubject<BoostConsoleSuitabilityFilterType> } suitability filter from service. */
  public readonly suitabilityFilterValue$: BehaviorSubject<
    BoostConsoleSuitabilityFilterType
  > = this.service.suitabilityFilterValue$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BoostConsoleService,
    private dynamicBoostExperiment: DynamicBoostExperimentService,
    private session: Session,
    private loginReferrer: LoginReferrerService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // if experiment is not active, redirect to root.
    if (!this.dynamicBoostExperiment.isActive()) {
      this.router.navigate(['/boost/console']);
    }

    if (!this.session.isLoggedIn()) {
      this.loginReferrer.register(this.location.path());
      this.router.navigate(['/login']);
    }

    /**
     * On route change, set filters
     *
     * This is where the filter value subjects are actually changed.
     * (The filters/tabs just change the queryParams, which are processed here)
     */

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const adminContext = this.adminContext$.getValue();

      const stateFilter: BoostState = params.state || null;
      // const suitabilityFilter: string = params.suitability || '';

      // ojm make this nicer
      // if (!this.adminContext) {
      //   // User view
      //   if (
      //     stateFilter === 'all' ||
      //     stateFilter === 'pending' ||
      //     stateFilter === 'approved' ||
      //     stateFilter === 'completed' ||
      //     stateFilter === 'rejected'
      //   ) {
      //     this.stateFilterValue$.next(stateFilter);
      //     return;
      //   }
      //   this.stateFilterValue$.next('all');
      // } else {
      //   // // Admin view
      //   // if (audienceFilter === 'safe' || audienceFilter === 'controversial') {
      //   //   this.audienceFilter$.next(audienceFilter);
      //   //   return;
      //   // }
      // }
    });
  }
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }
}
