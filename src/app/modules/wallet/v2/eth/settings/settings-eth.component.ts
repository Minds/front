import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { WalletV2Service, WalletCurrency } from '../../wallet-v2.service';

@Component({
  selector: 'm-walletSettings--eth',
  templateUrl: './settings-eth.component.html',
})
export class WalletSettingsETHComponent {
  ethWallet: WalletCurrency;

  constructor(public walletService: WalletV2Service) {
    this.ethWallet = walletService.wallet.eth;
  }
}
