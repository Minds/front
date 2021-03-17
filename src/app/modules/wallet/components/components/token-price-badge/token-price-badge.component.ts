import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { TokenPricesService } from '../currency-value/token-prices.service';

@Component({
  selector: 'm-wallet__tokenPriceBadge',
  templateUrl: './token-price-badge.component.html',
  styleUrls: ['./token-price-badge.component.ng.scss'],
})
export class MindsWalletTokenPriceBadgeComponent {
  readonly cdnAssetsUrl: string;

  minds$ = this.tokenPricesService.minds$;

  constructor(
    private tokenPricesService: TokenPricesService,
    private config: ConfigsService
  ) {
    this.cdnAssetsUrl = config.get('cdn_assets_url');
  }

  get uniswapTokenUrl(): string {
    return (
      'https://info.uniswap.org/token/' +
      this.config.get('blockchain').token.address
    );
  }
}
