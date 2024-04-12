import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, map, skip, take, throttleTime } from 'rxjs/operators';
import { ApiService } from '../../../../common/api/api.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { SettingsV2Service } from '../../settings-v2.service';

/**
 * Panel object - includes an intent for optional digestion within subscribers.
 */
export type TwoFactorSetupPanel = {
  panel: TwoFactorSetupPanelName;
  intent?: TwoFactorSetupIntent;
};

/**
 * Panel identifiers.
 */
export type TwoFactorSetupPanelName =
  | 'root'
  | 'password'
  | 'recovery-code'
  | 'app-connect'
  | 'disable'
  | 'sms';

/**
 * Different valid intents.
 */
export type TwoFactorSetupIntent =
  | 'setup-app'
  | 'disable'
  | 'sms'
  | 'enabled-sms'
  | 'enabled-totp'
  | 'disabled-sms'
  | 'disabled-totp';

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
  public readonly activePanel$: BehaviorSubject<TwoFactorSetupPanel> =
    new BehaviorSubject<TwoFactorSetupPanel>(DEFAULT_TWO_FACTOR_START_PANEL);

  // True if password has been confirmed.
  public readonly passwordConfirmed$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // holds secret code.
  public readonly secret$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  // true if inprogress.
  public readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  // holds recovery code
  public readonly recoveryCode$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  constructor(
    private toast: ToasterService,
    private api: ApiService,
    private settings: SettingsV2Service,
    private session: Session,
    router: Router
  ) {
    this.subscriptions.push(
      // reset state on router back - return user to root.
      router.events.pipe(skip(1)).subscribe((val) => {
        if (val instanceof NavigationEnd) {
          this.reset();
        }
      })
    );

    // async - don't hold up init
    this.reloadSettings();
  }

  /**
   * Whether or not TOTP is enabled.
   * @param { Observable<boolean> } - true if enabled.
   */
  get totpEnabled$(): Observable<boolean> {
    return this.settings.settings$.pipe(
      map((settings) => {
        return settings?.has2fa?.totp;
      })
    );
  }

  /**
   * Whether or not SMS is enabled.
   * @param { Observable<boolean> } - true if enabled.
   */
  get smsEnabled$(): Observable<boolean> {
    return this.settings.settings$.pipe(
      map((settings) => {
        return settings?.has2fa?.sms;
      })
    );
  }

  ngOnDestroy(): void {
    this.reset();
  }

  /**
   * Reset variables back to default values.
   * @returns { void }
   */
  public reset(): void {
    this.inProgress$.next(true);
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.recoveryCode$.next('');
    this.secret$.next('');
    this.activePanel$.next(DEFAULT_TWO_FACTOR_START_PANEL);
    this.passwordConfirmed$.next(false);
    this.inProgress$.next(false);
  }

  /**
   * Fetch a new secret and sets it to value of secret$.
   * @returns { void }
   */
  public fetchNewSecret(): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      this.api
        .get('api/v3/security/totp/new')
        .pipe(
          take(1),
          throttleTime(2000),
          catchError((error) => {
            // if there is an error, abort - send user back to root panel.
            console.error(error);
            this.toast.error(
              error.error?.message ?? 'An unexpected error has occurred'
            );
            this.inProgress$.next(false);
            this.activePanel$.next({ panel: 'root' });
            return of(null);
          })
        )
        .subscribe((val) => {
          this.inProgress$.next(false);
          if (!val || val.status === 'error') {
            return;
          }

          if (val && val.secret) {
            this.secret$.next(val.secret);
          }
        })
    );
  }

  /**
   * Submit TOTP code.
   * @param { string } code - code to submit.
   */
  public submitCode(code: string): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      this.api
        .post('api/v3/security/totp/new', {
          code: code,
          secret: this.secret$.getValue(),
        })
        .pipe(
          take(1),
          throttleTime(2000),
          catchError((error) => {
            this.toast.error(
              error.error.message ?? 'An unexpected error has occurred'
            );
            this.inProgress$.next(false);
            return of(null);
          })
        )
        .subscribe((val) => {
          this.inProgress$.next(false);
          if (!val || val.status === 'error') {
            return;
          }

          this.recoveryCode$.next(val.recovery_code);
          this.toast.success('Two-factor authentication enabled');
          this.activePanel$.next({
            panel: 'recovery-code',
          });
        })
    );
  }

  public removeTotp(code: string): void {
    this.inProgress$.next(true);
    this.subscriptions.push(
      this.api
        .delete('api/v3/security/totp', {}, {}, { code: code })
        .pipe(
          take(1),
          throttleTime(2000),
          catchError((error) => {
            console.error(error);
            this.toast.error(
              error.error.message ?? 'An unexpected error has occurred'
            );
            this.inProgress$.next(false);
            return of(null);
          })
        )
        .subscribe((val) => {
          this.inProgress$.next(false);

          if (!val || val.status === 'error') {
            return;
          }
          this.reset();
          this.reloadSettings();
          // pass to root, override to show totp as disabled incase server is behind.
          this.activePanel$.next({ panel: 'root', intent: 'disabled-totp' });
        })
    );
  }

  /**
   * Reload settings in settings service.
   * @returns { void }
   */
  public async reloadSettings(): Promise<void> {
    this.inProgress$.next(true);
    await this.settings.loadSettings(this.session.getLoggedInUser().guid);
    this.inProgress$.next(false);
  }
}
