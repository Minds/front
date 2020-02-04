import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { Client } from '../../common/api/client.service';
import { Session } from '../../services/session';

@Component({
  selector: 'm-monetization--overview',
  templateUrl: 'overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonetizationOverviewComponent {
  balance: number | string = 0;
  payouts: number | string = 0;
  net: number | string = 0;
  ready: boolean = false;
  user;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private session: Session
  ) {
    this.user = this.session.getLoggedInUser();
  }

  ngOnInit() {
    this.getTotals();
  }

  getTotals() {
    this.client
      .get('api/v1/monetization/revenue/overview')
      .then((response: any) => {
        console.log(response);
        this.balance = response.balance;
        this.payouts = response.payouts;
        this.net = response.total.net;
        this.ready = true;

        this.cd.markForCheck();
        this.cd.detectChanges();
      });
  }
}
