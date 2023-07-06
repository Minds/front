import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { Boost, BoostPaymentMethod } from '../../../boost.types';
import { ActivityEntity } from '../../../../newsfeed/activity/activity.service';

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

  @Output('onAction') onActionEmitter: EventEmitter<any> = new EventEmitter();

  /** @var { Object } displayOptions - options for activity display */
  public displayOptions: Object = {
    showOwnerBlock: true,
    showComments: false,
    showToolbarButtonsRow: false, // Just show the CTA button, if there is one
    showInteractions: false,
    isFeed: true,
    isInset: true,
  };

  constructor(configs: ConfigsService) {
    this.siteUrl = configs.get('site_url');
  }

  /**
   * Removes an item from a list when an action button is clicked
   * Currently only used for admin approve/reject actions
   */
  onAction(): void {
    this.onActionEmitter.emit(this.boost);
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
