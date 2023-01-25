import { Component, Input } from '@angular/core';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { Boost, BoostPaymentMethod } from '../../../boost.types';

/**
 * Boost console list item - a single boost entity
 */
@Component({
  selector: 'm-boostConsole__listItem',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.ng.scss'],
})
export class BoostConsoleListItemComponent {
  readonly siteUrl: string;

  /** @var { Boost } boost - Boost object */
  @Input() boost: Boost = null;

  /** @var { Object } displayOptions - options for activity display */
  public displayOptions: Object = {
    showOwnerBlock: true,
    showComments: false,
    showToolbar: false,
    showInteractions: false,
    isFeed: true,
    isInset: true,
  };

  constructor(configs: ConfigsService) {
    this.siteUrl = configs.get('site_url');
  }
  /**
   * Get receipt url
   * @return { string } receipt url
   */
  get receiptUrl(): string {
    if (!this.boost.payment_tx_id) {
      return '';
    }
    if (this.boost.payment_method === BoostPaymentMethod.ONCHAIN_TOKENS) {
      return `https://www.etherscan.io/tx/${this.boost.payment_tx_id}`;
    } else {
      return `/api/v3/payments/receipt/${this.boost.payment_tx_id}`;
    }
  }

  /**
   * Get amount badge text.
   * @return { string } amount badge text.
   */
  get amountBadgeText(): string {
    if (!this.boost.payment_amount || !this.boost.duration_days) {
      return '';
    }

    let duration = 'days';

    if (this.boost.duration_days === 1) {
      duration = 'day';
    }

    switch (this.boost.payment_method) {
      case BoostPaymentMethod.CASH:
        return `\$${this.boost.payment_amount} over ${this.boost.duration_days} ${duration}`;
      case BoostPaymentMethod.OFFCHAIN_TOKENS:
        let currency = 'tokens';
        if (this.boost.payment_amount === 1) {
          currency = 'token';
        }
        return `${this.boost.payment_amount} ${currency} over ${this.boost.duration_days} ${duration}`;
      default:
        return '';
    }
  }
}
