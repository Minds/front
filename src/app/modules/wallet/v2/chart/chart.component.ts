import { Component, OnInit, Input } from '@angular/core';
import { WalletDashboardService } from '../dashboard.service';
import { Timespan } from '../../../../interfaces/dashboard';

@Component({
  selector: 'm-walletChart',
  templateUrl: './chart.component.html',
})
export class WalletChartComponent implements OnInit {
  @Input() activeCurrencyId;
  timespans: Timespan[];
  selectedTimespan;
  data;

  constructor(protected walletService: WalletDashboardService) {}

  ngOnInit() {
    this.data = this.walletService.getData();
    this.timespans = this.data.timespans;

    this.selectedTimespan = this.timespans.find(
      ts => ts.id === this.data.timespan
    ).id;
    this.data = this.walletService
      .getCurrencies()
      .find(currency => currency.id === this.activeCurrencyId);
  }

  updateTimespan($event) {
    // $event.timespanId
  }
}
