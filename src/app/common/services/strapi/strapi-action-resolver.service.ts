import { Injectable } from '@angular/core';
import { BlockchainMarketingLinksService } from '../../../modules/blockchain/marketing/v2/blockchain-marketing-links.service';
import { Session } from '../../../services/session';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';

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
  | 'scroll_to_top';

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
];

/**
 * Resolves action button actions from Strapi. A key for the action is stored in
 * Strapi - this service then performs the correct action based upon that.
 */
@Injectable({ providedIn: 'root' })
export class StrapiActionResolverService {
  constructor(
    private session: Session,
    private authModal: AuthModalService,
    private links: BlockchainMarketingLinksService
  ) {}

  /**
   * Perform the related programmatic action for a given StrapiAction.
   * @param action - strapi action.
   * @returns { void }
   */
  public resolve(action: StrapiAction): void {
    if (LOGGED_IN_ONLY_ACTIONS.includes(action) && !this.session.isLoggedIn()) {
      this.authModal.open({ formDisplay: 'register' });
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
      default:
        console.warn('Action not yet implemented: ', action);
        break;
    }
  }
}
