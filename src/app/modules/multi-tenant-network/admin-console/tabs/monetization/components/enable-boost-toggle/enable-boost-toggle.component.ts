import { Component, OnDestroy, OnInit } from '@angular/core';
import { MultiTenantConfig } from '../../../../../../../../graphql/generated.engine';
import { Subscription, filter, lastValueFrom, take } from 'rxjs';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { GenericToggleValue } from '../../../../../../../common/components/toggle/toggle.component';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import { ConfigsService } from '../../../../../../../common/services/configs.service';

/**
 * Enable boost toggle component. Allows for network wide toggling of boost functionality.
 */
@Component({
  selector: 'm-networkAdminConsole__enableBoostToggle',
  styleUrls: ['./enable-boost-toggle.component.ng.scss'],
  templateUrl: './enable-boost-toggle.component.html',
})
export class NetworkAdminEnableBoostToggleComponent
  implements OnInit, OnDestroy
{
  /** Enabled toggle state. */
  public enabledToggleState: GenericToggleValue = 'off';

  // subscriptions.
  private configLoadSubscription: Subscription;

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private toaster: ToasterService,
    private configs: ConfigsService
  ) {}

  ngOnInit(): void {
    this.configLoadSubscription = this.multiTenantConfigService.config$
      .pipe(filter(Boolean), take(1))
      .subscribe((config: MultiTenantConfig): void => {
        this.enabledToggleState = config.boostEnabled ? 'on' : 'off';
      });
  }

  ngOnDestroy(): void {
    this.configLoadSubscription?.unsubscribe();
  }

  /**
   * On toggle handler - updates enabled/disabled state.
   * @returns { Promise<void> }
   */
  public async onEnabledToggle(
    newToggleState: GenericToggleValue
  ): Promise<void> {
    const previousToggleState: GenericToggleValue = this.enabledToggleState;
    this.enabledToggleState = newToggleState;

    let success: boolean = false;
    try {
      success = await lastValueFrom(
        this.multiTenantConfigService.updateConfig({
          boostEnabled: newToggleState === 'on',
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

    // patch configs to change boost_enabled state.
    this.configs.set('tenant', {
      ...this.configs.get('tenant'),
      boost_enabled: newToggleState === 'on',
    });

    this.toaster.success('Successfully updated settings.');
  }
}
