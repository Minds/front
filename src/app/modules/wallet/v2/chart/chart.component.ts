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
  activeTimespanId;
  data;
  selectedCurrency;

  constructor(protected walletService: WalletDashboardService) {}

  ngOnInit() {
    this.data = this.walletService.getData();
    this.timespans = this.walletService.getTimespans();

    this.activeTimespanId = this.timespans.find(
      ts => ts.id === this.data.timespan
    ).id;
    this.selectedCurrency = this.walletService
      .getCurrencies()
      .find(currency => currency.id === this.activeCurrencyId);
  }

  updateTimespan($event) {
    this.activeTimespanId = $event.timespanId;
    // this.walletService.updateTimespan($event.timespanId);
  }
}
