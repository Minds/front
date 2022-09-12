import { Component, Injector, Input } from '@angular/core';
import * as moment from 'moment';
import { ComposerModalService } from '../../../../composer/components/modal/modal.service';
import { ComposerService } from '../../../../composer/services/composer.service';
import { SupermindReplyService } from '../../../supermind-reply.service';
import {
  SUPERMIND_REPLY_TYPE_MAP,
  Supermind,
  SupermindConsoleListType,
  SupermindPaymentMethod,
  SupermindReplyType,
  SUPERMIND_PAYMENT_METHOD_MAP,
} from '../../../supermind.types';

/**
 * Supermind console list item - a single entry in inbox or outbox.
 */
@Component({
  selector: 'm-supermind__listItem',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.ng.scss'],
  providers: [SupermindReplyService],
})
export class SupermindConsoleListItemComponent {
  /** @var { Supermind } supermind - Supermind object */
  @Input() supermind: Supermind = null;

  /** @var { SupermindConsoleListType } context - context of parent list - inbox or outbox */
  @Input() context: SupermindConsoleListType = 'inbox';

  /** @var { Object } displayOptions - options for activity display */
  public displayOptions: Object = {
    showOwnerBlock: true,
    showComments: false,
    showToolbar: false,
    showInteractions: false,
    isFeed: true,
    isInset: true,
    isV2: true,
  };

  /**
   * The api state (button loading states)
   */
  inProgress$$ = this.supermindReplyService.inProgress$$;

  constructor(private supermindReplyService: SupermindReplyService) {}

  /**
   * Get amount badge text.
   * @return { string } amount badge text.
   */
  get amountBadgeText(): string {
    switch (SUPERMIND_PAYMENT_METHOD_MAP[this.supermind.payment_method]) {
      case SupermindPaymentMethod.CASH:
        return `\$${this.supermind.payment_amount} Offer`;
      case SupermindPaymentMethod.OFFCHAIN_TOKENS:
        return `${this.supermind.payment_amount} Token Offer`;
      default:
        return '';
    }
  }

  /**
   * Time till expiration.
   * @return { string }
   */
  get timeTillExpiration(): string {
    const date = moment(
      (this.supermind.created_timestamp + this.supermind.expiry_threshold) *
        1000
    );
    const duration = moment.duration(moment(date).diff(moment()));
    const daysRemaining = duration.days();
    const hoursRemaining = duration.hours();
    const minutesRemaining = duration.minutes();
    const secondsRemaining = duration.seconds();

    if (daysRemaining > 0) {
      return `${daysRemaining}d`;
    }
    if (hoursRemaining > 0) {
      return `${hoursRemaining}h`;
    }
    if (minutesRemaining > 0) {
      return `${minutesRemaining}m`;
    }
    if (secondsRemaining > 0) {
      return `${secondsRemaining}s`;
    }

    return '';
  }

  /**
   * Requirements text.
   * @return { string }
   */
  get requirementsText(): string {
    let requirementsText: string = '';

    switch (SUPERMIND_REPLY_TYPE_MAP[this.supermind.reply_type]) {
      case SupermindReplyType.IMAGE:
        requirementsText += 'Image Reply';
        break;
      case SupermindReplyType.VIDEO:
        requirementsText += 'Video Reply';
        break;
      case SupermindReplyType.TEXT:
        requirementsText += 'Text Reply';
        break;
    }

    if (this.supermind.twitter_required) {
      requirementsText += ' · Twitter';
    }

    return requirementsText;
  }

  /**
   * Called upon accept button being clicked
   * @param e
   */
  async onAccept(e: MouseEvent): Promise<void> {
    this.supermindReplyService.startReply(this.supermind);
  }

  /**
   * Called upon decline button being clicked
   * @param e
   */
  onDecline(e: MouseEvent): void {
    this.supermindReplyService.decline(this.supermind);
  }

  /**
   * Called upon cancle button being clicked
   * @param e
   */
  onCancel(e: MouseEvent): void {
    this.supermindReplyService.cancel(this.supermind);
  }
}
