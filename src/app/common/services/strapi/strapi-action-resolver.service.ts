import { Injectable } from '@angular/core';
import { BlockchainMarketingLinksService } from '../../../modules/blockchain/marketing/v2/blockchain-marketing-links.service';

// snippet for getting action buttons that can be dropped into a query.
export const STRAPI_ACTION_BUTTON_SNIPPET = `
  actionButtons {
    text
    action
    navigationUrl
  }
`;

// valid actions.
export type StrapiAction =
  | 'open_composer'
  | 'open_uniswap_v2_liquidity'
  | 'open_onchain_transfer_modal';

// action button type.
export type StrapiActionButton = {
  text: string;
  action?: StrapiAction;
  navigationUrl?: string;
};

/**
 * Resolves action button actions from Strapi. A key for the action is stored in
 * Strapi - this service then performs the correct action based upon that.
 */
@Injectable({ providedIn: 'root' })
export class StrapiActionResolverService {
  constructor(private links: BlockchainMarketingLinksService) {}

  /**
   * Perform the related programmatic action for a given StrapiAction.
   * @param action - strapi action.
   * @returns { void }
   */
  public resolve(action: StrapiAction): void {
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
      default:
        console.warn('Action not yet implemented: ', action);
        break;
    }
  }
}
