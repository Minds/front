import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoginReferrerService } from '../../../services/login-referrer.service';
import { Session } from '../../../services/session';
import { DynamicBoostExperimentService } from '../../experiments/sub-services/dynamic-boost-experiment.service';
import { BoostService } from '../boost.service';
import {
  BoostConsoleAudienceFilterType,
  BoostConsoleStateFilterType,
} from '../boost.types';

@Component({
  selector: 'm-boostConsole',
  templateUrl: './console-v2.component.html',
  styleUrls: ['./console-v2.component.ng.scss'],
})
export class BoostConsoleV2Component implements OnInit {
  /** @type { Subscription } routeSubscription - subscription to ActivatedRoutes query params*/
  private routeSubscription: Subscription;

  /** @type { BehaviorSubject<Boolean> } are we viewing the boost console in the context of the admin console? */
  public readonly adminContext$: BehaviorSubject<Boolean> = this.service
    .adminContext$;

  /** @type { BehaviorSubject<BoostConsoleStateFilterType> } state filter from service. */
  public readonly stateFilter$: BehaviorSubject<
    BoostConsoleStateFilterType
  > = this.service.stateFilter$;

  /** @type { BehaviorSubject<BoostConsoleAudienceFilterType> } audience filter from service. */
  public readonly audienceFilter$: BehaviorSubject<
    BoostConsoleAudienceFilterType
  > = this.service.stateFilter$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BoostService,
    private dynamicBoostExperiment: DynamicBoostExperimentService,
    private session: Session,
    private loginReferrer: LoginReferrerService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // if experiment is not active, redirect to root.
    if (!this.dynamicBoostExperiment.isActive()) {
      this.router.navigate(['/']);
    }

    if (!this.session.isLoggedIn()) {
      this.loginReferrer.register(this.location.path());
      this.router.navigate(['/login']);
    }

    // on route change, set list type.
    //ojm todo subscribe to queryparams
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const stateFilter: string = params.status || '';
      const audienceFilter: string = params.audience || '';

      // ojm make this nicer
      if (!this.adminContext$) {
        // User view
        if (
          stateFilter === 'all' ||
          stateFilter === 'pending' ||
          stateFilter === 'approved' ||
          stateFilter === 'completed' ||
          stateFilter === 'rejected'
        ) {
          this.stateFilter$.next(stateFilter);
          return;
        }
        this.stateFilter$.next('all');
      } else {
        // Admin view
        if (audienceFilter === 'safe' || audienceFilter === 'controversial') {
          this.audienceFilter$.next(audienceFilter);
          return;
        }
      }
    });
  }
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  /**
   * Called on settings button click - navigates to settings page.
   * @param { MouseEvent } $event - click event.
   * @returns { void }
   */
  public onSettingsButtonClick($event: MouseEvent): void {
    this.router.navigate(['/settings/boost']);
  }
}
