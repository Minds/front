import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MultiTenantNetworkConfigService } from '../../../../services/config.service';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { Subscription, filter, lastValueFrom, take } from 'rxjs';
import { MultiTenantConfig } from '../../../../../../../graphql/generated.engine';
import { GenericToggleValue } from '../../../../../../common/components/toggle/toggle.component';

/**
 * Walled garden toggle component for networks admin console.
 */
@Component({
  selector: 'm-networkAdminConsole__enableWalledGardenToggle',
  templateUrl: './enable-walled-garden-toggle.component.html',
  styleUrls: ['./enable-walled-garden-toggle.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkAdminConsoleEnableWalledGardenToggleComponent
  implements OnInit, OnDestroy
{
  /** Enabled toggle state. */
  public enabledToggleState: GenericToggleValue = 'on';

  /** Subscription to config load */
  private configLoadSubscription: Subscription;

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.configLoadSubscription = this.multiTenantConfigService.config$
      .pipe(filter(Boolean), take(1))
      .subscribe((config: MultiTenantConfig): void => {
        this.enabledToggleState = config.walledGardenEnabled ? 'off' : 'on';
      });
  }

  ngOnDestroy(): void {
    this.configLoadSubscription?.unsubscribe();
  }

  /**
   * On toggle handler - updates enabled toggle enabled/disabled state.
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
          walledGardenEnabled: newToggleState === 'off',
        })
      );
    } catch (e) {
      console.error(e);
    }

    if (!success) {
      this.enabledToggleState = previousToggleState;
      this.toaster.error('Unable to submit changes, please try again later');
      return;
    }

    this.toaster.success('Successfully updated settings');
  }
}
