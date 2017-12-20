import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';

@Component({
  moduleId: module.id,
  selector: 'm-blockchain--wallet-selector',
  templateUrl: 'wallet-selector.component.html',
  exportAs: 'BlockchainWalletSelector',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainWalletSelector {
  @Input() current: string;
  @Output('select') selectEventEmitter: EventEmitter<string> = new EventEmitter<string>();

  web3Unavailable: boolean = false;
  web3Locked: boolean = false;
  web3Wallets: string[] = [];

  _lockedWeb3CheckTimer: any;

  @Input() autoselect: boolean;
  @Output() autoselectChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    protected web3Wallet: Web3WalletService,
    protected cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.getWallets();
  }

  async getWallets() {
    if (this.web3Wallet.isUnavailable() || await this.web3Wallet.isLocked()) {
      this.web3Unavailable = this.web3Wallet.isUnavailable();
      this.web3Locked = true;
      this.detectChanges();

      this._lockedWeb3CheckTimer = setTimeout(() => this.getWallets(), 1000); // check again in 1s
      return;
    }

    let wallets = await this.web3Wallet.getWallets();

    this.web3Unavailable = false;
    this.web3Locked = false;
    this.web3Wallets = wallets;
    if (this.autoselect && this.web3Wallets.length > 0) {
      this.setWallet(this.web3Wallets[0]);
      this.autoselect = false;
      this.autoselectChange.emit(false);
    }
    this.detectChanges();
  }

  ngOnDestroy() {
    if (this._lockedWeb3CheckTimer) {
      clearTimeout(this._lockedWeb3CheckTimer);
    }
  }

  setWallet(wallet: string) {
    this.selectEventEmitter.emit(wallet);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
