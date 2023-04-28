import { Component, Input, OnInit } from '@angular/core';
import {
  Boost,
  BoostPaymentMethod,
  BoostState,
  RejectionReason,
} from '../../../../boost.types';
import * as moment from 'moment';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { BoostModalLazyService } from '../../../../modal/boost-modal-lazy.service';

/**
 * Row presented in boost console list items (where applicable)
 * It shows information related to the boost's performance, status,
 * rejection reason, etc.
 */
@Component({
  selector: 'm-boostConsole__statsBar',
  templateUrl: './stats-bar.component.html',
  styleUrls: ['./stats-bar.component.ng.scss'],
})
export class BoostConsoleStatsBarComponent implements OnInit {
  /** @var { Boost } boost - Boost object */
  @Input() boost: Boost = null;

  boostIsPending: boolean = false;
  boostIsRejected: boolean = false;
  boostIsApproved: boolean = false;

  formattedStartDate: string = '';
  public rejectionReasons: RejectionReason[] = [];

  constructor(
    private mindsConfig: ConfigsService,
    private boostModal: BoostModalLazyService
  ) {}

  ngOnInit(): void {
    const status = this.boost?.boost_status;

    this.boostIsPending = status === BoostState.PENDING;
    this.boostIsRejected = status === BoostState.REJECTED;
    this.boostIsApproved =
      status === BoostState.APPROVED || status === BoostState.COMPLETED;

    if (this.boostIsApproved) {
      this.formattedStartDate = this.formatDate(this.boost.approved_timestamp);
    }

    this.rejectionReasons = this.mindsConfig.get('boost')[
      'rejection_reasons'
    ] as RejectionReason[];
  }

  /**
   * Returns a formatted human-readable date string
   * @param timestampInSeconds
   */
  private formatDate(timestampInSeconds): string {
    return moment(timestampInSeconds * 1000).format('M/D/YY h:mma');
  }

  public getRejectionReasonLabel(): string | null {
    return this.rejectionReasons.filter(reason => {
      return reason.code === this.boost.rejection_reason;
    })[0]?.label;
  }

  async openBoostModal(): Promise<void> {
    try {
      await this.boostModal.open(this.boost.entity, {
        disabledSafeAudience: this.wrongAudience,
      });
      return;
    } catch (e) {
      // do nothing.
    }
  }

  // If the boost rejection reason is 1, then it was rejected bc of wrong audience
  get wrongAudience(): boolean {
    return this.boost?.rejection_reason === 1;
  }

  /**
   * Whether a boost is in a completed state.
   * @returns { boolean } true if boost is in a completed state.
   */
  public isBoostCompleted(): boolean {
    return this.boost.boost_status === BoostState.COMPLETED;
  }

  /**
   * Gets CPM as a string, taking into account payment method
   * and fixing the result to 2 decimal places.
   * @returns { string } CPM as a string.
   */
  public getCpmString(): string {
    const value: string = this.calculateCpmValue().toFixed(2);

    switch (this.boost.payment_method) {
      case BoostPaymentMethod.CASH:
        return `\$${value}`;
      case BoostPaymentMethod.OFFCHAIN_TOKENS:
      case BoostPaymentMethod.ONCHAIN_TOKENS:
        if (value === '1.00') {
          return `${value} token`;
        }
        return `${value} tokens`;
      default:
        return 'Unknown';
    }
  }

  /**
   * Calculates CPM value. Will return 0 if no views are delivered.
   * @returns { number } cpm value.
   */
  private calculateCpmValue(): number {
    if (!this.boost.summary.views_delivered) {
      return 0;
    }
    return (
      (this.boost.payment_amount / this.boost.summary.views_delivered) * 1000
    );
  }
}
