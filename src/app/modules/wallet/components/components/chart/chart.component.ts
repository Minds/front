import { Component, OnInit } from '@angular/core';
import { WalletV2Service } from '../../wallet-v2.service';
import { Timespan } from '../../../../../interfaces/dashboard';

/**
 * Displays a plotly chart and with a timespan filter to see
 * data in different lengths of time (e.g. 1m, 1y)
 *
 * See it in wallet > tokens > balance
 */
@Component({
  selector: 'm-walletChart',
  templateUrl: './chart.component.html',
})
export class WalletChartComponent implements OnInit {
  inProgress: boolean = false;
  init: boolean = false;
  dashboard: any;

  activeMetric: any;
  activeTimespan: Timespan;
  error: boolean = false;

  constructor(protected walletService: WalletV2Service) {}

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
