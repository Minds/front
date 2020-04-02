import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { BoostConsoleFilter } from '../../console/console.component';

@Component({
  selector: 'm-boost-publisher--earnings',
  templateUrl: 'earnings.component.html',
})
export class BoostPublisherEarningsComponent {
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

  constructor(
    private client: Client,
    public session: Session,
    private router: Router
  ) {
    if (!this.session.getLoggedInUser().show_boosts) {
      this.router.navigate(['/boost/console/publisher/settings']);
    }
  }

  getStatistics() {
    this.client.get('api/v2/boost/sums').then((res: any) => {
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
}
