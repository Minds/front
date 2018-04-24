import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-wallet-token--chart',
  templateUrl: 'chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletTokenContributionsChartComponent {

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    public session: Session,
    protected router: Router,
  ) { }

}
