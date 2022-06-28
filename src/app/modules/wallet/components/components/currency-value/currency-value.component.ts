import { Component, Input } from '@angular/core';
import { TokenPricesService } from './token-prices.service';

type Currency = 'tokens' | 'eth' | 'usd';

/**
 * Displays formatted values of various currencies.
 * When incoming values are in eth/tokens, equivalent USD values are also
 * calculated and displayed based on exchange rates.
 */
@Component({
  selector: 'm-wallet__currencyValue',
  templateUrl: './currency-value.component.html',
  styleUrls: ['./currency-value.component.ng.scss'],
})
export class WalletCurrencyValueComponent {
  /** The value in cent (base 2) */
  @Input() value: number;

  /** The currency of the value */
  @Input() currency: Currency = 'tokens';

  /** Removes the currency suffix */
  @Input() hideCurrency = false;

  /** Decimals to show */
  @Input() decimals: number = 2;

  get usd(): number {
    return this.value * this.exRate;
  }

  get exRate(): number {
    switch (this.currency) {
      case 'tokens':
        return this.tokenPricesService.minds;
      case 'eth':
        return this.tokenPricesService.eth;
      default:
        return 0;
    }
  }

  constructor(private tokenPricesService: TokenPricesService) {}

  ngOnInit() {
    this.tokenPricesService.get();
  }
}
