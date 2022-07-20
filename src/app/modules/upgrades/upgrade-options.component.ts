import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Session } from '../../services/session';
import currency, { Currency } from '../../helpers/currency';
import { ConfigsService } from '../../common/services/configs.service';

export type UpgradeOptionInterval = 'yearly' | 'monthly' | 'lifetime';

export type UpgradeOptionCurrency = Currency;

/**
 * Displays benefits of the different available upgrades,
 * With toggles for currency (USD/tokens) and duration.
 *
 * Users paying with USD can get yearly/monthly upgrades.
 * Users paying with tokens get it for life.
 *
 *
 * See it at the /upgrades marketing page
 */
@Component({
  selector: 'm-upgrades__upgradeOptions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'upgrade-options.component.html',
})
export class UpgradeOptionsComponent {
  readonly upgrades; // TODO: set typings
  interval: UpgradeOptionInterval = 'yearly';

  currency: UpgradeOptionCurrency = 'usd';

  constructor(public session: Session, configs: ConfigsService) {
    this.upgrades = configs.get('upgrades');
  }

  get intervalCurrencyQueryParams() {
    return { i: this.interval, c: this.currency };
  }

  get plusPricing() {
    if (this.interval === 'yearly') {
      return {
        amount: currency(
          this.upgrades.plus.yearly[this.currency] / 12,
          this.currency
        ),
        offerFrom: currency(
          this.upgrades.plus.monthly[this.currency],
          this.currency
        ),
        annualAmount: currency(
          this.upgrades.plus.yearly[this.currency],
          this.currency
        ),
      };
    } else if (this.interval === 'monthly') {
      return {
        amount: currency(
          this.upgrades.plus.monthly[this.currency],
          this.currency
        ),
        offerFrom: null,
        annualAmount: null,
      };
    } else if (this.interval === 'lifetime') {
      return {
        amount: this.upgrades.plus.lifetime[this.currency],
        offerFrom: null,
        annualAmount: null,
      };
    }
  }

  get proPricing() {
    if (this.interval === 'yearly') {
      return {
        amount: currency(
          this.upgrades.pro.yearly[this.currency] / 12,
          this.currency
        ),
        offerFrom: currency(
          this.upgrades.pro.monthly[this.currency],
          this.currency
        ),
        annualAmount: currency(
          this.upgrades.pro.yearly[this.currency],
          this.currency
        ),
      };
    } else if (this.interval === 'monthly') {
      return {
        amount: currency(
          this.upgrades.pro.monthly[this.currency],
          this.currency
        ),
        offerFrom: null,
        annualAmount: null,
      };
    } else if (this.interval === 'lifetime') {
      return {
        amount: this.upgrades.pro.lifetime[this.currency],
        offerFrom: null,
        annualAmount: null,
      };
    }
  }

  setCurrency(currency: UpgradeOptionCurrency) {
    this.currency = currency;
    if (this.currency === 'usd') {
      this.interval = 'yearly';
    } else if (this.currency === 'tokens') {
      this.interval = 'lifetime';
    }
  }
}
