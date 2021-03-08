import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FormToastService } from '../../../../common/services/form-toast.service';

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
  | 'disable';

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

  //TODO: UNSTUB
  private readonly mockData =
    'dff4d-e3b62 a7940-58cf9 bfbd7-757e5 93b14-c2e90 05233-724b1 0560f-87f28 3e539-9a4f3 ee6a2-4f6db 71e75-21909 bb1d9-9e5ca e2441-5142f a105d-7db8c 2486c-a7dfe 163cb-5b2f9 32332-09c32 1b378-454b1';

  // holds recovery code.
  public readonly recoveryCode$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(this.mockData);

  //TODO: UNSTUB
  isEnabled$ = new BehaviorSubject<boolean>(false);

  //TODO: UNSTUB
  get enabled$(): Observable<boolean> {
    return this.isEnabled$;
  }

  constructor(private toast: FormToastService) {}

  ngOnDestroy(): void {
    this.reset();
  }

  /**
   * Reset variables back to default values.
   * @returns { void }
   */
  public reset(): void {
    this.activePanel$.next(DEFAULT_TWO_FACTOR_START_PANEL);
    this.selectedProtectionType$.next(null);
    this.passwordConfirmed$.next(false);
  }

  public disable2fa(): void {
    //TODO: Call disable mfa endpoint && CHECK LOCAL PASSWORDCONFIRMED
    this.reset();
    this.isEnabled$.next(false);
    this.toast.success('TODO: Disable MFA');
  }
}
