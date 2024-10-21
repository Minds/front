import { Inject, Injectable } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { SiteMembershipsPageModal } from './site-memberships-page-modal.service';
import {
  ShouldShowMembershipGateGQL,
  ShouldShowMembershipGateQuery,
} from '../../../../graphql/generated.engine';
import { firstValueFrom } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { OnboardingV5Service } from '../../onboarding-v5/services/onboarding-v5.service';

/**
 * Service for the site membership gate.
 */
@Injectable({ providedIn: 'root' })
export class SiteMembershipGateService {
  constructor(
    private configs: ConfigsService,
    private session: Session,
    private router: Router,
    private shouldShowMembershipGateGQL: ShouldShowMembershipGateGQL,
    private siteMembershipsPageModal: SiteMembershipsPageModal,
    private onboardingV5Service: OnboardingV5Service,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {}

  /**
   * Refresh local config state, by making a server call and updating configs with the result.
   * @returns {Promise<this>}
   */
  public async refreshLocalState(): Promise<this> {
    if (!this.isTenantNetwork) {
      return this;
    }

    try {
      const result: ApolloQueryResult<ShouldShowMembershipGateQuery> =
        await firstValueFrom(
          this.shouldShowMembershipGateGQL.fetch(null, {
            fetchPolicy: 'network-only',
          })
        );

      this.configs.set('tenant', {
        ...this.configs.get('tenant'),
        should_show_membership_gate: result?.data?.shouldShowMembershipGate,
      });
    } catch (e) {
      console.error(e);
    }

    return this;
  }

  /**
   * Show the site membership gate if required.
   * @returns { Promise<this> }
   */
  public async showIfRequired(): Promise<this> {
    try {
      if (
        this.isTenantNetwork &&
        this.configs.get('tenant')?.['should_show_membership_gate'] &&
        this.session.isLoggedIn() &&
        // Do not show if user is logging out.
        !this.router.url.startsWith('/logout') &&
        // Do not show if user has not completed onboarding (avoid showing over it).
        (await this.onboardingV5Service.hasCompletedOnboarding())
      ) {
        this.siteMembershipsPageModal.open({
          showDismissActions: false,
        });
      }
    } catch (e) {
      console.error(e);
    }

    return this;
  }
}
