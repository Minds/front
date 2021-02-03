import { Component, OnInit } from '@angular/core';
import { TokenPricesService } from '../currency-value/token-prices.service';

@Component({
  selector: 'm-wallet__tokenPriceBadge',
  templateUrl: './token-price-badge.component.html',
  styleUrls: ['./token-price-badge.component.ng.scss'],
})
export class MindsWalletTokenPriceBadgeComponent {
  minds$ = this.tokenPricesService.minds$;

  constructor(private tokenPricesService: TokenPricesService) {}
}
