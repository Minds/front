import { Component, OnInit } from '@angular/core';
import { MultiTenantConfig } from '../../../../../../../../graphql/generated.engine';
import { Observable, firstValueFrom, map } from 'rxjs';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import { BoostEmbedBuilderComponent } from './boost-embed-builder/boost-embed-builder.component';
import { NetworkAdminEnableBoostToggleComponent } from './enable-boost-toggle/enable-boost-toggle.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { GrowShrinkFast } from '../../../../../../../animations';
import { NetworkAdminCreateBoostLinkComponent } from './create-boost-link/create-boost-link.component';
import { StripeKeysService } from '../../services/stripe-keys.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../../../../common/services/toaster.service';

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
export class NetworkAdminBoostConfigurationComponent implements OnInit {
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
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private stripeKeysService: StripeKeysService,
    private router: Router,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.checkStripeKeys(); // async
  }

  /**
   * Checks whether stripe keys are set, and redirects if the user has not set any.
   * @returns { void } 
   */
  private async checkStripeKeys(): Promise<void> {
    // if not initialized, fetch any keys from server.
    if (!await firstValueFrom(this.stripeKeysService.initialized$)) {
      await this.stripeKeysService.fetchStripeKeys();
    }

    // check whether user has set stripe keys, redirect if they have not.
    if (!await firstValueFrom(this.stripeKeysService.hasSetStripeKeys$)) {
      this.toaster.warn('You must enable Stripe keys before accessing this page.')
      this.router.navigate(['/network/admin/monetization']);
    }
  }
}
