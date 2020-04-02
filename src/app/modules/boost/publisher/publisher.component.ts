import { Component, Input } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { BoostConsoleFilter } from '../console/console.component';

@Component({
  selector: 'm-boost-publisher',
  templateUrl: 'publisher.component.html',
})
export class BoostPublisherComponent {
  _filter: BoostConsoleFilter;

  startDate: string;
  inProgress: boolean = false;
  payoutRequestInProgress: boolean = false;

  stats = {
    points_count: 0,
    usd_count: 0,
    token_count: 0,
    points_earnings: 0,
    usd_earnings: 0,
    token_earnings: 0,
    total_count: 0,
    total_earnings: 0,
  };

  @Input('filter') set filter(value: BoostConsoleFilter) {
    this._filter = value;
    if (this._filter === 'earnings') {
      this.getStatistics();
    }
  }

  constructor(public session: Session, private client: Client) {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    this.startDate = d.toISOString();
  }

  getStatistics() {
    this.client
      .get('api/v2/boost/sums', { start: Date.parse(this.startDate) })
      .then((res: any) => {
        this.stats.points_count = res.sums.points_count;
        this.stats.points_earnings = res.sums.points_earnings;
        this.stats.usd_count = res.sums.usd_count;
        this.stats.usd_earnings = res.sums.usd_earnings;
        this.stats.token_count = res.sums.token_count;
        this.stats.token_earnings = res.sums.token_earnings;
        this.stats.total_count = res.sums.total_count;
        this.stats.total_earnings = res.sums.total_earnings;
      });
  }

  submit(publisher: boolean) {
    this.inProgress = true;
    this.session.getLoggedInUser().show_boosts = true;
    this.client
      .post(`api/v1/settings/${this.session.getLoggedInUser().guid}`, {
        show_boosts: publisher,
      })
      .then(() => {
        this.inProgress = false;
      })
      .catch(() => {
        this.session.getLoggedInUser().show_boosts = false;
        this.inProgress = false;
      });
  }

  onStartDateChange(newDate) {
    this.startDate = newDate;
    this.getStatistics();
  }

  isMerchant() {
    const user = this.session.getLoggedInUser();
    return user && user.merchant;
  }

  requestPayout() {
    this.payoutRequestInProgress = true;
    this.client
      .post('api/v1/payout')
      .then(() => {
        this.payoutRequestInProgress = false;
      })
      .catch(() => {
        this.payoutRequestInProgress = false;
      });
  }
}
