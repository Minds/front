import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../common/services/configs.service';
import { BuyTokensModalService } from '../blockchain/token-purchase/v2/buy-tokens-modal.service';

/**
 * Eye-catching marketing component to inspire users to buy tokens
 *
 * Briefly describes how tokens are used and has a "Buy tokens" action button
 *
 * See it on the /upgrades marketing page
 */
@Component({
  selector: 'm-upgrades__buyTokens',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'buy-tokens.component.html',
})
export class BuyTokensComponent {
  readonly cdnAssetsUrl: string;

  constructor(
    protected router: Router,
    configs: ConfigsService,
    private buyTokensModalService: BuyTokensModalService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  async openBuyTokens(e): Promise<void> {
    await this.buyTokensModalService.open();
  }
}
