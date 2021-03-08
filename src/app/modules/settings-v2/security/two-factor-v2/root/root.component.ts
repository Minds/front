import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SettingsTwoFactorV2Service,
  TwoFactorProtectionType,
} from '../two-factor-v2.service';

/**
 * Root component - allows a user to see their currently enabled 2FA methods
 * And enable new ones.
 */
@Component({
  selector: 'm-settings__twoFactorRoot',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.ng.scss'],
})
export class SettingsTwoFactorV2RootComponent {
  constructor(private service: SettingsTwoFactorV2Service) {}

  get enabled$(): Observable<boolean> {
    return this.service.enabled$;
  }

  public onSMSClick(): void {
    this.service.activePanel$.next({
      panel: 'sms',
      // intent: "",
    });
  }

  public onDisableIntegrationClick(): void {
    this.service.activePanel$.next({
      panel: 'password',
      intent: 'disable',
    });
  }

  public onViewRecoveryClick(): void {
    this.service.activePanel$.next({
      panel: 'password',
      intent: 'view-recovery',
    });
  }

  public onSetupAppClick(): void {
    this.service.activePanel$.next({
      panel: 'password',
      intent: 'setup-app',
    });
  }
}
