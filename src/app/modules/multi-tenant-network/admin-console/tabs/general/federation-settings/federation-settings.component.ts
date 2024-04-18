import { Component, OnDestroy, OnInit } from '@angular/core';
import { MultiTenantNetworkConfigService } from '../../../../services/config.service';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { Subscription, filter, lastValueFrom, take } from 'rxjs';
import { MultiTenantConfig } from '../../../../../../../graphql/generated.engine';
import { GenericToggleValue } from '../../../../../../common/components/toggle/toggle.component';

/**
 * Federation settings component for networks admin console.
 * Allows enabling and disabling of federation.
 */
@Component({
  selector: 'm-networkAdminConsole__federationSettings',
  templateUrl: './federation-settings.component.html',
  styleUrls: ['./federation-settings.component.ng.scss'],
})
export class NetworkAdminConsoleFederationSettingsComponent
  implements OnInit, OnDestroy
{
  /** Enabled toggle state. */
  public enabledToggleState: GenericToggleValue = 'on';

  /** Whether federation can be enabled. */
  public canEnableFederation: boolean = false;

  // subscriptions.
  private configLoadSubscription: Subscription;

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.configLoadSubscription = this.multiTenantConfigService.config$
      .pipe(filter(Boolean), take(1))
      .subscribe((config: MultiTenantConfig): void => {
        this.canEnableFederation = config?.canEnableFederation;

        if (!this.canEnableFederation) {
          this.enabledToggleState = 'off';
          return;
        }

        // engine setting is DISABLED, this UI toggle is for ENABLED state.
        this.enabledToggleState = config.federationDisabled ? 'off' : 'on';
      });
  }

  ngOnDestroy(): void {
    this.configLoadSubscription?.unsubscribe();
  }

  /**
   * On toggle handler - updates federation enabled/disabled state.
   * @returns { Promise<void> }
   */
  public async onEnabledToggle(
    newToggleState: GenericToggleValue
  ): Promise<void> {
    if (!this.canEnableFederation) {
      this.toaster.warn(
        'Only networks with custom domains can enable federation'
      );
      return;
    }

    const previousToggleState: GenericToggleValue = this.enabledToggleState;
    this.enabledToggleState = newToggleState;

    let success: boolean = false;
    try {
      success = await lastValueFrom(
        this.multiTenantConfigService.updateConfig({
          federationDisabled: newToggleState !== 'on',
        })
      );
    } catch (e) {
      console.error(e);
    }

    if (!success) {
      this.enabledToggleState = previousToggleState;
      this.toaster.error('Unable to submit changes, please try again later.');
      return;
    }

    this.toaster.success('Successfully updated settings.');
  }
}
