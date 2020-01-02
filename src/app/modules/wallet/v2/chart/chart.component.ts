import { Component, OnInit, Input } from '@angular/core';
import { WalletDashboardService } from '../dashboard.service';
import { Timespan } from '../../../../interfaces/dashboard';

@Component({
  selector: 'm-walletChart',
  templateUrl: './chart.component.html',
})
export class WalletChartComponent implements OnInit {
  timespans: Timespan[] = [
    {
      // Assuming today is Nov 17th
      id: '7d',
      label: '7D',
      interval: 'day',
      from_ts_ms: 1572566400000,
      from_ts_iso: '2019-11-01T00:00:00+00:00',
    },
    {
      id: '30d',
      label: '30D',
      interval: 'day',
      from_ts_ms: 1571270400000,
      from_ts_iso: '2019-10-17T00:00:00+00:00',
    },
    {
      id: '12m',
      label: '12M',
      interval: 'month',
      from_ts_ms: 1542412800000,
      from_ts_iso: '2018-11-17T00:00:00+00:00',
    },
  ];
  activeTimespan;
  data: any = {
    id: 'tokens',
    label: 'Tokens',
    unit: 'tokens',
  };

  constructor(protected walletService: WalletDashboardService) {}

  ngOnInit() {
    this.activeTimespan = this.timespans[0];
    this.data['visualisation'] = this.walletService.getTokenChart(
      this.activeTimespan
    );
  }

  updateTimespan($event) {
    this.activeTimespan = this.timespans.find(
      ts => ts.id === $event.timespanId
    );
    this.data = this.walletService.getTokenChart(this.activeTimespan);
  }
}
