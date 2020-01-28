import { Component, OnInit } from '@angular/core';
import { WalletDashboardService } from '../dashboard.service';
import { Timespan } from '../../../../interfaces/dashboard';

@Component({
  selector: 'm-walletChart',
  templateUrl: './chart.component.html',
})
export class WalletChartComponent implements OnInit {
  inProgress: boolean = true;
  dashboard: any;
  activeMetric: any;
  activeTimespan: Timespan = {
    id: '1w',
    label: '1 week',
    short_label: '1W',
    interval: 'day',
    selected: true,
    comparison_interval: 7,
    from_ts_ms: 0,
    from_ts_iso: '',
  };
  error: boolean = false;

  constructor(protected walletService: WalletDashboardService) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;

    const response: any = await this.walletService.getTokenChart(
      this.activeTimespan.id
    );
    if (response && response.dashboard) {
      this.dashboard = response.dashboard;
      console.log('***chart dash', this.dashboard);

      const activeMetricId = this.dashboard.metric;

      this.activeMetric = this.dashboard.metrics.find(
        m => m.id === activeMetricId
      );

      console.log('***chart!! dashboard', this.dashboard);
      console.log('***chart!! activemetric', this.activeMetric);
    }
    this.inProgress = false;
  }

  async updateTimespan($event) {
    this.activeTimespan = this.dashboard.timespans.find(
      ts => ts.id === $event.timespanId
    );
    this.load();
  }
}
