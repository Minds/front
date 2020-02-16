import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { WalletDashboardService, WalletCurrency } from '../dashboard.service';

@Component({
  selector: 'm-walletSettings--eth',
  templateUrl: './settings-eth.component.html',
})
export class WalletSettingsETHComponent {
  @Input() ethWallet: WalletCurrency;
  @Output() scrollToTokenSettings: EventEmitter<any> = new EventEmitter();
  constructor() {}
  // protected walletService: WalletDashboardService,
  // private cd: ChangeDetectorRef
  // {}

  // ngOnInit() {
  // this.load();
  // }

  // async load() {
  //   this.inProgress = true;
  //   this.error = '';

  //   this.walletService
  //     .getStripeAccount()
  //     .then((account: any) => {
  //       this.account = account;
  //       this.setView();
  //     })
  //     .catch(e => {
  //       this.error = e.message;
  //       this.view = 'error';
  //       this.inProgress = false;
  //       this.detectChanges();
  //     });

  //   this.ethWallet = await this.walletService.getEthAccount();
  //   this.detectChanges();
  // }
  // detectChanges() {
  //   this.cd.markForCheck();
  //   this.cd.detectChanges();
  // }
}
