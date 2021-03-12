import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ApiService } from '../../../../common/api/api.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { Session } from '../../../../services/session';
import { SettingsV2Service } from '../../settings-v2.service';

export type TwoFactorSetupPanel = {
  panel: TwoFactorSetupPanelName;
  intent?: TwoFactorSetupIntent;
};
// Panel identifiers.
export type TwoFactorSetupPanelName =
  | 'root'
  | 'password'
  | 'recovery-code'
  | 'app-connect'
  | 'disable'
  | 'sms';

export type TwoFactorSetupIntent = 'view-recovery' | 'setup-app' | 'disable';

// Default starting panel.
export const DEFAULT_TWO_FACTOR_START_PANEL: TwoFactorSetupPanel = {
  panel: 'root',
};

// protection type
export type TwoFactorProtectionType = 'totp' | 'sms' | null;

/**
 * Two-factor authentication v2 service.
 * Holds shared state between 2fav2 components and is responsible for calls to server.
 */
@Injectable({ providedIn: 'root' })
export class SettingsTwoFactorV2Service implements OnDestroy {
  protected subscriptions: Subscription[] = [];

  // Currently active panel.
  public readonly activePanel$: BehaviorSubject<
    TwoFactorSetupPanel
  > = new BehaviorSubject<TwoFactorSetupPanel>(DEFAULT_TWO_FACTOR_START_PANEL);

  // Selected protection type (sms or totp)
  public readonly selectedProtectionType$: BehaviorSubject<
    TwoFactorProtectionType
  > = new BehaviorSubject<TwoFactorProtectionType>(null);

  // True if password has been confirmed.
  public readonly passwordConfirmed$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  // holds recovery code.
  public readonly recoveryCode$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');

  // true if inprogress.
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    private toast: FormToastService,
    private api: ApiService,
    private settings: SettingsV2Service,
    router: Router,
    private session: Session
  ) {
    this.subscriptions.push(
      // reset state on router back - return user to root.
      router.events.subscribe(val => {
        if (val instanceof NavigationEnd) {
          this.reset();
        }
      })
    );

    // async - don't hold up init
    settings.loadSettings(session.getLoggedInUser().guid);
  }

  /**
   * Whether or not TOTP is enabled
   */
  get totpEnabled$(): Observable<boolean> {
    return this.settings.settings$.pipe(
      map(settings => {
        return settings?.has2fa?.totp;
      })
    );
  }

  //TODO: SMS enabled state
  get smsEnabled$(): Observable<boolean> {
    return this.settings.settings$.pipe(
      map(settings => {
        return settings?.has2fa?.sms;
      })
    );
  }

  // totpEnabled$ = new BehaviorSubject<boolean>(false);

  ngOnDestroy(): void {
    this.reset();
  }

  /**
   * Reset variables back to default values.
   * @returns { void }
   */
  public reset(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.activePanel$.next(DEFAULT_TWO_FACTOR_START_PANEL);
    this.selectedProtectionType$.next(null);
    this.passwordConfirmed$.next(false);
    this.inProgress$.next(false);
  }

  public fetchNewSecret(): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      this.api
        .get('api/v3/security/totp/new')
        .pipe(
          take(1),
          catchError(error => {
            console.error(error);
            this.toast.error(
              error.error?.message ?? 'An unexpected error has occurred'
            );
            this.inProgress$.next(false);
            this.activePanel$.next({ panel: 'root' });
            return of(null);
          })
        )
        .subscribe(val => {
          this.inProgress$.next(false);
          if (!val || val.status === 'error') {
            return;
          }

          if (val && val.secret) {
            this.recoveryCode$.next(val.secret);
          }
        })
    );
  }

  public submitCode(code: string): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      this.api
        .post('api/v3/security/totp/new', {
          code: code,
          secret: this.recoveryCode$.getValue(),
        })
        .pipe(
          take(1),
          catchError(error => {
            console.error(error);
            this.toast.error(
              error.error.message ?? 'An unexpected error has occurred'
            );
            this.inProgress$.next(false);
            return of(null);
          })
        )
        .subscribe(val => {
          this.inProgress$.next(false);

          if (!val || val.status === 'error') {
            return;
          }

          this.recoveryCode$.next(val);
        })
    );
  }

  public removeTotp(code: string): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      this.api
        .delete('api/v3/security/totp', {
          code: code,
        })
        .pipe(
          take(1),
          catchError(error => {
            console.error(error);
            this.toast.error(
              error.error.message ?? 'An unexpected error has occurred'
            );
            this.inProgress$.next(false);
            return of(null);
          })
        )
        .subscribe(val => {
          this.inProgress$.next(false);

          if (!val || val.status === 'error') {
            return;
          }

          this.reset();
          this.activePanel$.next({ panel: 'root' });
        })
    );
  }
}
