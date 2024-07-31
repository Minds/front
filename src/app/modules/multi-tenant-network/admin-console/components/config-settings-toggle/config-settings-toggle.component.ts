import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, filter, lastValueFrom, take } from 'rxjs';
import { GenericToggleValue } from '../../../../../common/components/toggle/toggle.component';
import { MultiTenantNetworkConfigService } from '../../../services/config.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MultiTenantConfig } from '../../../../../../graphql/generated.engine';

/**
 * Section for toggling on and off tenant config values.
 */
@Component({
  selector: 'm-networkAdminConsole__configSettingsToggle',
  templateUrl: './config-settings-toggle.component.html',
  styleUrls: ['./config-settings-toggle.component.ng.scss'],
})
export class NetworkAdminConsoleConfigSettingsToggleComponent
  implements OnInit, OnDestroy
{
  /** Name of the field the toggle controls. */
  @Input() public fieldName: string;

  /** Title to be shown above toggle. */
  @Input() public title: string;

  /** Description to be shown above toggle. */
  @Input() public description: string;

  /** Short text shown next to toggle. */
  @Input() public toggleText: string;

  /** Enabled toggle state. */
  public enabledToggleState: GenericToggleValue = 'on';

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
        this.enabledToggleState = config[this.fieldName] ? 'on' : 'off';
      });
  }

  ngOnDestroy(): void {
    this.configLoadSubscription?.unsubscribe();
  }

  /**
   * On toggle handler - updates whether field is in a enabled/disabled state.
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
          [this.fieldName]: newToggleState === 'on',
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
