import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, take, throttleTime } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../../common/api/api.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { BoostConsoleAdminStatsService } from './admin-stats.service';
import {
  Boost,
  BoostConsoleGetParams,
  BoostConsoleLocationFilter,
  BoostConsolePaymentMethodFilter,
  BoostConsoleStateFilter,
  BoostConsoleSuitabilityFilter,
  BoostConsoleView,
  BoostLocation,
  BoostPaymentMethod,
  BoostState,
  BoostSuitability,
} from '../../boost.types';
import { PermissionsService } from '../../../../common/services/permissions.service';

/**
 * Service that handles logic for the boost console
 */
@Injectable()
export class BoostConsoleService {
  endpoint: string = 'api/v3/boosts';

  /**
   * Whether we're looking at a list of boosts, a single boost,
   * or the sitewide boost feed
   */
  public readonly view$: BehaviorSubject<BoostConsoleView> =
    new BehaviorSubject<BoostConsoleView>('list');

  // Subject containing whether or not we are viewing
  // the boost console in the context of the admin console
  // (as opposed to user context)
  public readonly adminContext$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // Subject containing location filter for console to display.
  // (e.g. feed or sidebar)
  public readonly locationFilterValue$: BehaviorSubject<BoostConsoleLocationFilter> =
    new BehaviorSubject<BoostConsoleLocationFilter>('feed');

  // Subject containing status filter for console to display.
  // (Used in user boost context only)
  public readonly stateFilterValue$: BehaviorSubject<BoostConsoleStateFilter> =
    new BehaviorSubject<BoostConsoleStateFilter>('all');

  // Subject containing suitability filter for console to display.
  // (Used in admin context only)
  public readonly suitabilityFilterValue$: BehaviorSubject<BoostConsoleSuitabilityFilter> =
    new BehaviorSubject<BoostConsoleSuitabilityFilter>('safe');

  // Subject containing payment method filter for console to display.
  // (Used in admin context only)
  public readonly paymentMethodFilterValue$: BehaviorSubject<BoostConsolePaymentMethodFilter> =
    new BehaviorSubject<BoostConsolePaymentMethodFilter>('all');

  // The state of the api - whether it's in progress
  public readonly inProgress$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public readonly singleBoostGuid$: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  public readonly singleBoost$: BehaviorSubject<Boost> =
    new BehaviorSubject<Boost>(null);

  public readonly remoteUserGuid$: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  constructor(
    private api: ApiService,
    private toasterService: ToasterService,
    private adminStats: BoostConsoleAdminStatsService,
    private permissionsService: PermissionsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Update query params to reflect the user's selection
   */
  public updateQueryParams(paramObj: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: paramObj,
      queryParamsHandling: 'merge',
    });
  }
  /**
   * Get list of boosts from API based on various filter values.
   * @param { number } limit - limit to request from API.
   * @param { number } offset - offset to request from API.
   * @returns { Observable<ApiResponse> } response from API.
   */
  public getList$(
    limit: number = 12,
    offset: number = 0
  ): Observable<ApiResponse | { redirect: boolean; errorMessage: any }> {
    return this.adminContext$.pipe(
      take(1),
      switchMap((adminContext: boolean) => {
        let context =
          adminContext || this.remoteUserGuid$.getValue() ? '/admin' : '';
        let endpoint = `${this.endpoint}${context}`;

        let params: BoostConsoleGetParams = {
          limit: limit,
          offset: offset,
          location: null,
          status: null,
          audience: null,
          payment_method: null,
          remote_user_guid: null,
        };
        // -------------------------------------------
        // FILTERS FOR BOTH USERS + ADMINS
        const location = this.locationFilterValue$.getValue();

        if (location) {
          params.location = this.getBoostLocationFromFilterValue(location);
        }
        // -------------------------------------------
        if (!adminContext) {
          // FILTERS FOR USERS
          const state = this.stateFilterValue$.getValue();

          if (state) {
            params.status = this.getBoostStateFromFilterValue(state);
          }
        }
        // -------------------------------------------
        // FILTERS FOR ADMINS ONLY
        if (this.permissionsService.canModerateContent()) {
          if (adminContext) {
            params.status = BoostState.PENDING;

            const suitability = this.suitabilityFilterValue$.getValue();
            const paymentMethod = this.paymentMethodFilterValue$.getValue();

            if (suitability) {
              params.audience =
                this.getBoostSuitabilityFromFilterValue(suitability);
            }

            if (paymentMethod) {
              params.payment_method =
                this.getBoostPaymentMethodFromFilterValue(paymentMethod);
            }
          } else {
            const remoteUserGuid = this.remoteUserGuid$.getValue();
            if (remoteUserGuid) {
              params.remote_user_guid = remoteUserGuid;
            }
          }
        }

        // -------------------------------------------
        return this.api.get<ApiResponse>(endpoint, params);
      }),
      catchError((e) => {
        if (e.status === 403) {
          return of({ redirect: true, errorMessage: e.error.message });
        }
        return of(null);
      })
    );
  }

  /**
   * Approves a boost (action taken by admin)
   * @param boost
   */
  async approve(boost: Boost): Promise<void> {
    if (!this.permissionsService.canModerateContent()) {
      console.log('You do not have permissions to approve boosts');
      return;
    }

    this.inProgress$$.next(true);
    try {
      await this.api.post(`${this.endpoint}/${boost.guid}/approve`).toPromise();
      boost.boost_status = BoostState.APPROVED;
      this.decrementAdminStatCounter();
    } catch (err) {
      console.log(err);
      this.toasterService.error(err?.error.message);
    } finally {
      this.inProgress$$.next(false);
    }
  }

  /**
   * Rejects a boost (action taken by admin)
   * @param boost
   * @return Observable<ApiResponse>
   */
  public reject(boost: Boost): Observable<ApiResponse> {
    if (!this.permissionsService.canModerateContent()) {
      console.log('You do not have permission to reject boosts');
      return;
    }

    this.inProgress$$.next(true);
    return this.api.post<ApiResponse>(`${this.endpoint}/${boost.guid}/reject`, {
      reason: boost.rejection_reason,
    });
  }

  /**
   * Cancels a boost (that hasn't yet been approved)
   * @param boost
   */
  async cancel(boost: Boost): Promise<void> {
    this.inProgress$$.next(true);
    try {
      await this.api.post(`${this.endpoint}/${boost.guid}/cancel`).toPromise();
      boost.boost_status = BoostState.CANCELLED;
      this.toasterService.success('Boost cancelled');
    } catch (err) {
      console.log(err);
      this.toasterService.error(err?.error.message);
    } finally {
      this.inProgress$$.next(false);
    }
  }

  // -----------------------------------------------
  // UTILITY
  // -----------------------------------------------
  getBoostStateFromFilterValue(val: BoostConsoleStateFilter): BoostState {
    switch (val) {
      case 'pending':
        return BoostState.PENDING;
      case 'approved':
        return BoostState.APPROVED;
      case 'rejected':
        return BoostState.REJECTED;
      case 'completed':
        return BoostState.COMPLETED;
      case 'all':
      default:
        return null;
    }
  }

  getBoostLocationFromFilterValue(
    val: BoostConsoleLocationFilter
  ): BoostLocation {
    switch (val) {
      case 'feed':
        return BoostLocation.NEWSFEED;
      case 'sidebar':
        return BoostLocation.SIDEBAR;
      default:
        return null;
    }
  }

  getBoostSuitabilityFromFilterValue(
    val: BoostConsoleSuitabilityFilter
  ): BoostSuitability {
    switch (val) {
      case 'safe':
        return BoostSuitability.SAFE;
      case 'controversial':
        return BoostSuitability.CONTROVERSIAL;
      default:
        return null;
    }
  }

  getBoostPaymentMethodFromFilterValue(
    val: BoostConsolePaymentMethodFilter
  ): BoostPaymentMethod {
    switch (val) {
      case 'cash':
        return BoostPaymentMethod.CASH;
      case 'offchain_tokens':
        return BoostPaymentMethod.OFFCHAIN_TOKENS;
      case 'onchain_tokens':
        return BoostPaymentMethod.ONCHAIN_TOKENS;
      case 'all':
      default:
        return null;
    }
  }

  getTimeTillExpiration(boost: Boost): string {
    const date = moment(
      (boost.approved_timestamp + boost.duration_days * 86400) * 1000
    );
    const duration = moment.duration(moment(date).diff(moment()));
    const daysRemaining = duration.days();
    const hoursRemaining = duration.hours();
    const minutesRemaining = duration.minutes();
    const secondsRemaining = duration.seconds();

    if (daysRemaining > 0) {
      return `${daysRemaining}d`;
    }
    if (hoursRemaining > 0) {
      return `${hoursRemaining}h`;
    }

    if (minutesRemaining > 0) {
      return `${minutesRemaining}m`;
    }

    if (secondsRemaining > 0) {
      return `${secondsRemaining}s`;
    }

    return '';
  }

  /**
   * Decrement pending count for current suitability filter value.
   * @returns { void }
   */
  public decrementAdminStatCounter(): void {
    if (this.suitabilityFilterValue$.getValue() === 'safe') {
      this.adminStats.decrementPendingSafeCount();
    } else {
      this.adminStats.decrementPendingControversialCount();
    }
  }
}
