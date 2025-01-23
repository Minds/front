import { Component, Input } from '@angular/core';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { Boost, BoostPaymentMethod } from '../../../boost.types';
import { ActivityEntity } from '../../../../newsfeed/activity/activity.service';
import { Session } from '../../../../../services/session';

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
    showToolbarButtonsRow: false, // Just show the CTA button, if there is one
    showInteractions: false,
    isFeed: true,
    isInset: true,
  };

  constructor(
    private session: Session,
    configs: ConfigsService
  ) {
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
      return `https://basescan.org/tx/${this.boost.payment_tx_id}`;
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
        let text: string = `\$${this.boost.payment_amount} over ${this.boost.duration_days} ${duration}`;

        if (
          this.boost.payment_tx_id === 'gift_card' &&
          this.session.isAdmin()
        ) {
          text += ' (Gift Card)';
        }

        return text;
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

  /**
   * Get activity entity.
   * Which needs a bit of manipulation to get the CTA working
   * @return { ActivityEntity }
   */
  getBoostedEntity(boost: Boost): ActivityEntity {
    let activityEntity = boost.entity;
    if (boost.goal_button_text) {
      activityEntity['goal_button_text'] = boost.goal_button_text;
    }
    if (boost.goal_button_url) {
      activityEntity['goal_button_url'] = boost.goal_button_url;
    }

    return activityEntity;
  }
}
