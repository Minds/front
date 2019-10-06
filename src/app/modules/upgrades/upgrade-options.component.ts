import { ChangeDetectionStrategy, Component } from '@angular/core';
import currency, { Currency } from '../../helpers/currency';

type UpgradeOptionInterval = 'yearly' | 'monthly';

type UpgradeOptionCurrency = Currency;

@Component({
  selector: 'm-upgrades__upgradeOptions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'upgrade-options.component.html',
})
export class UpgradeOptionsComponent {
  interval: UpgradeOptionInterval = 'yearly';

  currency: UpgradeOptionCurrency = 'tokens';

  get plusRouterLink() {
    return ['/plus', { i: this.interval, c: this.currency }];
  }

  get proRouterLink() {
    return ['/pro', { i: this.interval, c: this.currency }];
  }

  get plusPricing() {
    if (this.interval === 'yearly') {
      return {
        amount: currency(20, this.currency),
        offerFrom: currency(28, this.currency),
      };
    } else if (this.interval === 'monthly') {
      return {
        amount: currency(28, this.currency),
        offerFrom: null,
      };
    }
  }

  get proPricing() {
    if (this.interval === 'yearly') {
      return {
        amount: currency(200, this.currency),
        offerFrom: currency(240, this.currency),
      };
    } else if (this.interval === 'monthly') {
      return {
        amount: currency(240, this.currency),
        offerFrom: null,
      };
    }
  }
}
