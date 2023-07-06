import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoginReferrerService } from '../../../services/login-referrer.service';
import { Session } from '../../../services/session';
import {
  BoostConsoleSuitabilityFilter,
  BoostConsoleStateFilter,
  BoostConsoleLocationFilter,
  BoostConsolePaymentMethodFilter,
} from '../boost.types';
import { BoostConsoleService } from './services/console.service';
import { BoostModalV2LazyService } from '../modal-v2/boost-modal-v2-lazy.service';

@Component({
  selector: 'm-boostConsole',
  templateUrl: './console-v2.component.html',
  styleUrls: ['./console-v2.component.ng.scss'],
})
export class BoostConsoleV2Component implements OnInit {
  /** Guid, if this is a single boost view page */
  singleBoostGuid: string = '';

  private subscriptions: Array<Subscription> = [];

  /** @type { BehaviorSubject<boolean> } are we viewing the boost console in the context of the admin console? */
  public readonly adminContext$: BehaviorSubject<boolean> = this.service
    .adminContext$;

  /** @type { BehaviorSubject<BoostConsoleStateFilter> } state filter from service. */
  public readonly stateFilterValue$: BehaviorSubject<
    BoostConsoleStateFilter
  > = this.service.stateFilterValue$;

  /** @type { BehaviorSubject<BoostConsoleSuitabilityFilter> } suitability filter from service. */
  public readonly suitabilityFilterValue$: BehaviorSubject<
    BoostConsoleSuitabilityFilter
  > = this.service.suitabilityFilterValue$;

  @Input() set adminContext(value: boolean) {
    if (!this.session.isAdmin()) {
      return;
    }
    this.service.adminContext$.next(value);

    // Remove default location filter for admins
    if (value) {
      this.service.locationFilterValue$.next('all');
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BoostConsoleService,
    private session: Session,
    private loginReferrer: LoginReferrerService,
    private location: Location,
    private boostModal: BoostModalV2LazyService
  ) {}

  ngOnInit(): void {
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
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        // SINGLE BOOST PAGE ONLY
        this.singleBoostGuid = params.boostGuid || null;
        if (this.singleBoostGuid) {
          this.service.singleBoostGuid$.next(this.singleBoostGuid);
          return;
        }

        // LIST PAGE ONLY
        const stateFilter: BoostConsoleStateFilter = params.state || null;
        const locationFilter: BoostConsoleLocationFilter =
          params.location || null;
        const suitabilityFilter: BoostConsoleSuitabilityFilter =
          params.suitability || null;
        const paymentMethodFilter: BoostConsolePaymentMethodFilter =
          params.payment_method || null;

        if (stateFilter) {
          this.service.stateFilterValue$.next(stateFilter);
        }

        if (locationFilter) {
          this.service.locationFilterValue$.next(locationFilter);
        }

        if (suitabilityFilter) {
          this.service.suitabilityFilterValue$.next(suitabilityFilter);
        }

        if (paymentMethodFilter) {
          this.service.paymentMethodFilterValue$.next(paymentMethodFilter);
        }

        // ADMIN REMOTE LOOKUP
        const remoteUserGuid: string = params.remoteUserGuid || null;
        if (remoteUserGuid) {
          this.service.remoteUserGuid$.next(remoteUserGuid);
        }
      }),

      // If the user creates a boost while on the boost console page,
      // refresh the page so their recent boost is visible
      this.boostModal.onComplete$.subscribe(onComplete => {
        this.reload();
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Called on settings button click - navigates to settings page.
   * @param { MouseEvent } $event - click event.
   * @returns { void }
   */
  public onSettingsButtonClick($event: MouseEvent): void {
    this.router.navigate(['/settings/account/boosted-content']);
  }

  /**
   * Reloads the page using the router.
   * iemi111 @ https://stackoverflow.com/a/63059359/7396007
   * @returns { void }
   */
  private reload(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }
}
