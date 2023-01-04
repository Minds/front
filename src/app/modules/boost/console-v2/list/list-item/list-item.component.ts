import { Component, Input } from '@angular/core';
import {
  Boost,
  BoostConsoleLocationFilterType,
  BoostPaymentMethod,
  BOOST_PAYMENT_METHOD_MAP,
} from '../../../boost.types';

/**
 * Boost console list item - a single boost entity
 */
@Component({
  selector: 'm-boostConsole__listItem',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.ng.scss'],
})
export class BoostConsoleListItemComponent {
  /** @var { Boost } boost - Boost object */
  @Input() boost: Boost = null;

  // ojm rename from context
  /** @var { BoostConsoleLocationFilterType } context - context of parent list */
  @Input() context: BoostConsoleLocationFilterType = 'newsfeed';

  /** @var { Object } displayOptions - options for activity display */
  public displayOptions: Object = {
    showOwnerBlock: true,
    showComments: false,
    showToolbar: false,
    showInteractions: false,
    isFeed: true,
    isInset: true,
  };

  /**
   * Get amount badge text.
   * @return { string } amount badge text.
   */
  get amountBadgeText(): string {
    let duration = 'days';

    if (this.boost.duration_days === 1) {
      duration = 'day';
    }

    switch (BOOST_PAYMENT_METHOD_MAP[this.boost.payment_method]) {
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
