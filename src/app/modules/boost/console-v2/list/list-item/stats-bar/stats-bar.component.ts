import { Component, Input, OnInit } from '@angular/core';
import { Boost, BoostState } from '../../../../boost.types';
import * as moment from 'moment';

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
  boostIsRejected: boolean = false;
  boostIsApproved: boolean = false;

  formattedStartDate: string = '';

  constructor() {}

  ngOnInit(): void {
    const status = this.boost?.boost_status;

    this.boostIsRejected = status === BoostState.REJECTED;
    this.boostIsApproved = status === BoostState.APPROVED;

    if (this.boostIsApproved) {
      this.formattedStartDate = this.formatDate(this.boost.approved_timestamp);
    }
  }

  /**
   * Returns a formatted human-readable date string
   * @param timestampInSeconds
   */
  private formatDate(timestampInSeconds): string {
    return moment(timestampInSeconds * 1000).format('M/D/YY h:mma');
  }
}
