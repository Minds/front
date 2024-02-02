import { Injectable, OnDestroy } from '@angular/core';
import { BlockchainMarketingLinksService } from '../../../modules/blockchain/marketing/v2/blockchain-marketing-links.service';
import { Session } from '../../../services/session';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { WirePaymentHandlersService } from '../../../modules/wire/wire-payment-handlers.service';
import { Router } from '@angular/router';
import { MindsUser } from '../../../interfaces/entities';
import { WireCreatorComponent } from '../../../modules/wire/v2/creator/wire-creator.component';
import { ToasterService } from '../toaster.service';
import { OnboardingV5Service } from '../../../modules/onboarding-v5/services/onboarding-v5.service';
import { Subscription, filter, take } from 'rxjs';

export const STRAPI_ACTION_BUTTON_ATTRIBUTES = `
  text
  action
  navigationUrl
  dataRef
`;

// snippet for getting action buttons (note: plural) that can be dropped into a query.
export const STRAPI_ACTION_BUTTONS_SNIPPET = `
  actionButtons {
    ${STRAPI_ACTION_BUTTON_ATTRIBUTES}
  }
`;

// snippet for getting action buttons (note: singular) that can be dropped into a query.
export const STRAPI_ACTION_BUTTON_SNIPPET = `
  actionButton {
    ${STRAPI_ACTION_BUTTON_ATTRIBUTES}
  }
`;

// valid actions.
export type StrapiAction =
  | 'open_composer'
  | 'open_uniswap_v2_liquidity'
  | 'open_onchain_transfer_modal'
  | 'scroll_to_top'
  | 'open_plus_upgrade_modal'
  | 'open_pro_upgrade_modal'
  | 'open_register_modal'
  | 'networks_team_checkout'
  | 'networks_community_checkout'
  | 'networks_enterprise_checkout';

// action button type.
export type StrapiActionButton = {
  text: string;
  action?: StrapiAction;
  navigationUrl?: string;
  dataRef?: string;
};

// actions that trigger login if not logged in already.
const LOGGED_IN_ONLY_ACTIONS: StrapiAction[] = [
  'open_composer',
  'open_onchain_transfer_modal',
  'open_plus_upgrade_modal',
  'open_pro_upgrade_modal',
  'networks_team_checkout',
  'networks_community_checkout',
  'networks_enterprise_checkout',
];

/**
 * Resolves action button actions from Strapi. A key for the action is stored in
 * Strapi - this service then performs the correct action based upon that.
 */
@Injectable({ providedIn: 'root' })
export class StrapiActionResolverService implements OnDestroy {
  // subscription for onboarding completion.
  private onboardingCompletedSubscription: Subscription;

  constructor(
    private session: Session,
    private authModal: AuthModalService,
    private links: BlockchainMarketingLinksService,
    private modalService: ModalService,
    private wirePaymentHandlers: WirePaymentHandlersService,
    private onboardingV5Service: OnboardingV5Service,
    private toaster: ToasterService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.onboardingCompletedSubscription?.unsubscribe();
  }

  /**
   * Perform the related programmatic action for a given StrapiAction.
   * @param { StrapiAction } action - strapi action.
   * @param { any } extraData - extra data to pass to the action handler.
   * @returns { void }
   */
  public resolve(action: StrapiAction, extraData: any = null): void {
    if (LOGGED_IN_ONLY_ACTIONS.includes(action) && !this.session.isLoggedIn()) {
      this.handleAuthentication(action, extraData);
      return;
    }

    switch (action) {
      case 'open_composer':
        this.links.openComposerModal();
        break;
      case 'open_uniswap_v2_liquidity':
        this.links.openLiquidityProvisionModal();
        break;
      case 'open_onchain_transfer_modal':
        this.links.openTransferOnchainModal();
        break;
      case 'scroll_to_top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'open_register_modal':
        if (this.session.isLoggedIn()) {
          this.toaster.warn('You are already logged in.');
          return;
        }
        this.authModal.open({ formDisplay: 'register' });
        break;
      case 'open_plus_upgrade_modal':
        this.openWireUpgradeModal('plus', extraData);
        break;
      case 'open_pro_upgrade_modal':
        this.openWireUpgradeModal('pro', extraData);
        break;
      case 'networks_team_checkout':
        this.router.navigate(['/networks/checkout'], {
          queryParams: {
            planId: extraData?.stripeProductKey ?? 'networks:team',
            timePeriod: extraData?.upgradeInterval,
          },
        });
        break;
      case 'networks_community_checkout':
        this.router.navigate(['/networks/checkout'], {
          queryParams: {
            planId: extraData?.stripeProductKey ?? 'networks:community',
            timePeriod: extraData?.upgradeInterval,
          },
        });
        break;
      case 'networks_enterprise_checkout':
        this.router.navigate(['/networks/checkout'], {
          queryParams: {
            planId: extraData?.stripeProductKey ?? 'networks:enterprise',
            timePeriod: extraData?.upgradeInterval,
          },
        });
        break;
      default:
        console.warn('Action not yet implemented: ', action);
        break;
    }
  }

  /**
   * Opens Wire upgrade modal.
   * @param { 'plus' | 'pro' } upgradeType - type of the upgrade.
   * @param { any } extraData - extra data to pass - may contain an `upgradeInterval`.
   * @returns { Promise<void> }
   */
  private async openWireUpgradeModal(
    upgradeType: 'plus' | 'pro',
    extraData: any = {}
  ): Promise<void> {
    let entity: MindsUser;

    switch (upgradeType) {
      case 'plus':
        entity = await this.wirePaymentHandlers.get('plus');
        break;
      case 'pro':
        entity = await this.wirePaymentHandlers.get('pro');
        break;
      default:
        throw new Error('Unsupported upgrade type: ' + upgradeType);
    }

    const modal: ModalRef<WireCreatorComponent> = this.modalService.present(
      WireCreatorComponent,
      {
        size: 'lg',
        data: {
          entity: entity,
          default: {
            type: 'money',
            upgradeType: upgradeType,
            upgradeInterval: extraData?.['upgradeInterval'] ?? 'monthly',
          },
          onComplete: (result: boolean) => {
            if (result) {
              this.router.navigate(['/discovery/plus/']);
              modal.close();
            }
          },
        },
      }
    );
  }

  /**
   * Handle authentication by waiting for user login, or onboarding completion
   * and recursively calling the action handled when authenticated.
   * @param { StrapiAction } action - strapi action.
   * @param { any } extraData - extra data to pass to the action handler.
   * @returns { void }
   */
  private async handleAuthentication(
    action: StrapiAction,
    extraData: any = null
  ): Promise<void> {
    const result: MindsUser = await this.authModal.open({
      formDisplay: 'register',
    });

    // modal closed.
    if (!result) return;

    // on login, if email is already confirmed, call the action again.
    if (result.email_confirmed) {
      return this.resolve(action, extraData);
    }

    // on register, unsubscribe from any existing subscription to avoid duplication.
    // listen for onboarding handler and call the action again on completion.
    this.onboardingCompletedSubscription?.unsubscribe();
    this.onboardingCompletedSubscription = this.onboardingV5Service.onboardingCompleted$
      .pipe(filter(Boolean), take(1))
      .subscribe((completed: boolean): void => {
        this.resolve(action, extraData);
      });
  }
}
