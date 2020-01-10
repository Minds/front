import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WalletDashboardService } from '../dashboard.service';

@Component({
  selector: 'm-walletSettings--eth',
  templateUrl: './settings-eth.component.html',
})
export class WalletSettingsETHComponent implements OnInit {
  wallet;
  showModal = false;
  @Output() scrollToTokenSettings: EventEmitter<any> = new EventEmitter();
  constructor(protected walletService: WalletDashboardService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.wallet = this.walletService.getWallet();
  }
}
