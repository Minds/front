import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { WalletDashboardService, WalletCurrency } from '../dashboard.service';

@Component({
  selector: 'm-walletSettings--eth',
  templateUrl: './settings-eth.component.html',
})
export class WalletSettingsETHComponent implements OnInit {
  ethWallet: WalletCurrency;
  @Output() scrollToTokenSettings: EventEmitter<any> = new EventEmitter();
  constructor(
    protected walletService: WalletDashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.ethWallet = await this.walletService.getEthAccount();
    console.log('ethw', this.ethWallet);
    this.detectChanges();
  }
  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
