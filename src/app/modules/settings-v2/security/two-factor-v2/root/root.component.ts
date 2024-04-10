import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { SettingsTwoFactorV2Service } from '../two-factor-v2.service';

/**
 * Root component - allows a user to see their currently enabled 2FA methods
 * And enable new ones.
 */
@Component({
  selector: 'm-settings__twoFactorRoot',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.ng.scss'],
})
export class SettingsTwoFactorV2RootComponent extends AbstractSubscriberComponent {
  constructor(
    private service: SettingsTwoFactorV2Service,
    private toast: ToasterService
  ) {
    super();
  }

  /**
   * Whether TOTP MFA is enabled.
   * @returns { Observable<boolean> } true if TOTP MFA is enabled.
   */
  get totpEnabled$(): Observable<boolean> {
    return combineLatest([
      this.service.totpEnabled$,
      this.service.activePanel$,
    ]).pipe(
      map(([enabled, panel]) => {
        // allow for disable and enable overrides in intent.
        return (
          (enabled && panel.intent !== 'disabled-totp') ||
          panel.intent === 'enabled-totp'
        );
      })
    );
  }

  /**
   * Whether SMS MFA is enabled.
   * @returns { Observable<boolean> } true if SMS MFA is enabled.
   */
  get smsEnabled$(): Observable<boolean> {
    return combineLatest([
      this.service.smsEnabled$,
      this.service.activePanel$,
    ]).pipe(
      map(([enabled, panel]) => {
        // allow for disable and enable overrides in intent.
        return (
          (enabled && panel.intent !== 'disabled-sms') ||
          panel.intent === 'enabled-sms'
        );
      })
    );
  }

  /**
   * Whether service in progress from service.
   * @returns { BehaviorSubject<boolean> } - true if is in progress.
   */
  get inProgress$(): BehaviorSubject<boolean> {
    return this.service.inProgress$;
  }

  /**
   * Called on SMS click/
   * @returns { void }
   */
  public onSMSClick(): void {
    this.subscriptions.push(
      combineLatest([this.totpEnabled$, this.smsEnabled$])
        .pipe(
          take(1),
          map(([totpEnabled, smsEnabled]) => {
            if (totpEnabled) {
              this.toast.warn('You cannot currently enable both TOTP and SMS');
              return;
            }

            this.service.activePanel$.next(
              smsEnabled
                ? {
                    panel: 'sms',
                    intent: 'disable',
                  }
                : {
                    panel: 'password',
                    intent: 'sms',
                  }
            );
          })
        )
        .subscribe()
    );
  }

  /**
   * Called on Disable TOTP Integration clicked.
   * @returns { void }
   */
  public onDisableIntegrationClick(): void {
    this.service.activePanel$.next({
      panel: 'password',
      intent: 'disable',
    });
  }

  /**
   * Called on setup app clicked.
   * @returns { void }
   */
  public onSetupAppClick(): void {
    this.subscriptions.push(
      this.smsEnabled$.pipe(take(1)).subscribe((smsEnabled) => {
        if (smsEnabled) {
          this.toast.warn('You cannot currently enable both TOTP and SMS');
          return;
        }
        this.service.activePanel$.next({
          panel: 'password',
          intent: 'setup-app',
        });
      })
    );
  }
}
