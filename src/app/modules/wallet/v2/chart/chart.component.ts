import { Component, OnInit } from '@angular/core';
import { WalletDashboardService } from '../dashboard.service';
import { Timespan } from '../../../../interfaces/dashboard';

@Component({
  selector: 'm-walletChart',
  templateUrl: './chart.component.html',
})
export class WalletChartComponent implements OnInit {
  inProgress: boolean = true;
  init: boolean = false;
  dashboard: any;

  activeMetric: any;
  activeTimespan: Timespan;
  error: boolean = false;

  constructor(protected walletService: WalletDashboardService) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;

    const timespanId = this.init ? this.activeTimespan.id : '30d';

    const response: any = await this.walletService.getTokenChart(timespanId);
    if (response && response.dashboard) {
      this.dashboard = response.dashboard;
      this.dashboard.timespans = this.mapTimespanLabels(
        response.dashboard.timespans
      );
      this.activeTimespan = this.dashboard.timespans.find(
        ts => ts.id === timespanId
      );

      const activeMetricId = this.dashboard.metric;

      this.activeMetric = this.dashboard.metrics.find(
        m => m.id === activeMetricId
      );
    }
    this.inProgress = false;
    this.init = true;
  }

  async updateTimespan($event) {
    this.activeTimespan = this.dashboard.timespans.find(
      ts => ts.id === $event.timespanId
    );
    this.load();
  }

  mapTimespanLabels(timespans) {
    const labelMap: any = {
      '7d': '1W',
      '30d': '1M',
      '90d': '3M',
      '1y': '1Y',
      max: 'Max',
    };

    timespans.forEach(t => {
      if (labelMap[t.id]) {
        t.label = labelMap[t.id];
      }
    });

    return timespans;
  }
}
