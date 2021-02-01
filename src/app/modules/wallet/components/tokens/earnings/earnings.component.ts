import { Component, OnInit } from '@angular/core';
import { WalletTokenRewardsService } from './rewards.service';
import * as moment from 'moment';

@Component({
  selector: 'm-wallet__tokenEarnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.ng.scss'],
  providers: [WalletTokenRewardsService],
})
export class WalletTokenEarningsComponent implements OnInit {
  /** The reference date */
  date = new Date();

  /** The max date we can select */
  maxDate = new Date();

  total = {
    daily: null,
    all_time: null,
  };
  data;

  constructor(private rewards: WalletTokenRewardsService) {}

  ngOnInit() {
    this.load();
  }

  /**
   * Loads the table
   */
  async load() {
    const response = <any>await this.rewards.load(this.getDate());
    this.data = response;
    this.total = response.total;
  }

  /**
   * When the calendar changes, we reload the data
   * @param date
   */
  onDateChange(date) {
    this.date = new Date(date);
    this.load();
  }

  /**
   * Returns the date in YYYY-MM-DD format
   */
  private getDate() {
    return (
      this.date.getUTCFullYear() +
      '-' +
      (this.date.getUTCMonth() + 1) +
      '-' +
      this.date.getUTCDate()
    );
  }

  /**
   * Returns the friendly date
   */
  get friendlyDate(): string {
    const d = new Date(this.getDate());
    const m = moment(d.getTime());
    return m.calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'MMMM Do YYYY',
      lastDay: '[Yesterday]',
      lastWeek: 'MMMM Do',
      sameElse: () => {
        if (moment().year() === m.year()) {
          return 'MMMM Do';
        } else {
          return 'MMMM Do YYYY';
        }
      },
    });
  }
}
