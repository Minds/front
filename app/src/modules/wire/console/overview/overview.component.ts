import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-wire-console--overview',
  templateUrl: 'overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WireConsoleOverviewComponent {

  startDate: string;

  ready: boolean = true;
  stats: { points, points_count, points_avg, money, money_count, money_avg } = {
    points: 0,
    points_count: 0,
    points_avg: 0,
    money: 0,
    money_count: 0,
    money_avg: 0
  };

  constructor(private client: Client, private session: Session, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    this.startDate = d.toISOString();

    this.getStats();
  }

  getStats() {
    this.client.get('api/v1/wire/sums/overview/' + this.session.getLoggedInUser().guid, {
      start: Date.parse(this.startDate) / 1000
    })
      .then(({ points = 0, points_count = 0, points_avg = 0, money = 0, money_count = 0, money_avg = 0 }) => {
        this.stats = {
          points,
          points_count,
          points_avg,
          money,
          money_count,
          money_avg
        };

        this.detectChanges();
      });
  }

  isMerchant() {
    const user = this.session.getLoggedInUser();
    return user && user.merchant;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
