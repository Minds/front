import { Component } from '@angular/core';
import { MultiTenantConfig } from '../../../../../../../../graphql/generated.engine';
import { Observable, map } from 'rxjs';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import { BoostEmbedBuilderComponent } from './boost-embed-builder/boost-embed-builder.component';
import { NetworkAdminEnableBoostToggleComponent } from './enable-boost-toggle/enable-boost-toggle.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { GrowShrinkFast } from '../../../../../../../animations';
import { NetworkAdminCreateBoostLinkComponent } from './create-boost-link/create-boost-link.component';

/**
 * Network admin boost configuration component.
 */
@Component({
  selector: 'm-networkAdminConsole__boostConfiguration',
  styleUrls: ['./boost-configuration.component.ng.scss'],
  templateUrl: './boost-configuration.component.html',
  standalone: true,
  imports: [
    BoostEmbedBuilderComponent,
    NetworkAdminEnableBoostToggleComponent,
    NetworkAdminCreateBoostLinkComponent,
    AsyncPipe,
    NgIf,
  ],
  animations: [GrowShrinkFast],
})
export class NetworkAdminBoostConfigurationComponent {
  /** Whether boost embed builder should be shown. */
  protected readonly isBoostEnabled$: Observable<boolean> =
    this.multiTenantConfigService.config$.pipe(
      map((config: MultiTenantConfig): boolean => {
        return config?.boostEnabled;
      })
    );

  /** Whether custom homepage is enabled. */
  protected readonly isCustomHomepageEnabled$: Observable<boolean> =
    this.multiTenantConfigService.config$.pipe(
      map((config: MultiTenantConfig): boolean => {
        return config?.customHomePageEnabled;
      })
    );

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService
  ) {}
}
