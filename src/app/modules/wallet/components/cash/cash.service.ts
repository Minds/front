import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMapTo } from 'rxjs/operators';
import { ApiService } from '../../../../common/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class CashWalletService {
  /**
   * API request reference. Update this issue a new request
   */
  apiRequestTs: BehaviorSubject<number> = new BehaviorSubject(Date.now());

  /**
   * Calls the api to get the account status
   */
  account$ = this.apiRequestTs.pipe(
    switchMapTo(
      this.api.get('api/v3/payments/stripe/connect/account').pipe(
        catchError(err => {
          return of(null);
        }),
        map(response => {
          this.isLoading$$.next(false);
          return response;
        })
      )
    ),
    shareReplay()
  );

  /**
   * Boolean of if there is an account connected
   */
  hasAccount$: Observable<boolean> = this.account$.pipe(
    map(response => !!response)
  );

  /**
   * If the stripe account is in a restricted state
   */
  isRestricted$: Observable<boolean> = this.account$.pipe(
    map(response => !!response?.requirements.disabled_reason)
  );

  /**
   * Maps the reason of a restricted state
   */
  restrictedReason$: Observable<string> = this.account$.pipe(
    map(response => response.requirements.disabled_reason)
  );

  /**
   * If payments are enabled or not. Ie. they can accept money.
   */
  paymentsEnabled$: Observable<boolean> = this.account$.pipe(
    map(response => response.charges_enabled)
  );

  /**
   * If payouts are enabled.
   * These could be disabled because of due requirements or admin action.
   */
  payoutsEnabled$: Observable<boolean> = this.account$.pipe(
    map(response => response.payouts_enabled)
  );

  /**
   * The loading state
   */
  isLoading$$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private api: ApiService) {}

  /**
   * Creates a stripe account
   */
  async createAccount(): Promise<void> {
    await this.api.post('api/v3/payments/stripe/connect/account').toPromise();
  }

  /**
   * Takes the user to stripe connect onboarding screen.
   * @returns { void }
   */
  public redirectToOnboarding(): void {
    location.href = '/api/v3/payments/stripe/connect/onboarding';
  }
}
