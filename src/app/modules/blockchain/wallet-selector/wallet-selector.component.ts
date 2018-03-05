import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';

type Wallet = { address: string, label: string };

@Component({
  moduleId: module.id,
  selector: 'm-blockchain--wallet-selector',
  templateUrl: 'wallet-selector.component.html',
  exportAs: 'BlockchainWalletSelector',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainWalletSelector {
  @Input() current: string;
  @Input() autoselect: boolean;
  @Input() allowOffchain: boolean = false;

  @Output('select') selectEventEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output('autoselectChange') autoselectChangeEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  web3Unavailable: boolean = false;
  web3Locked: boolean = false;
  web3Wallets: Wallet[] = [];

  _lockedWeb3CheckTimer: any;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.setWeb3Wallets([]);
    this.detectChanges();

    this.getWallets();
  }

  setWeb3Wallets(wallets: Wallet[] = []) {
    if (this.allowOffchain) {
      wallets.push({
        address: 'offchain',
        label: 'Offchain Wallet',
      });
    }

    this.web3Wallets = wallets;
  }

  async getWallets() {
    if (this.web3Wallet.isUnavailable() || await this.web3Wallet.isLocked()) {
      this.web3Unavailable = this.web3Wallet.isUnavailable();
      this.web3Locked = true;
      this.detectChanges();

      this._lockedWeb3CheckTimer = setTimeout(() => this.getWallets(), 1000); // check again in 1s
      return;
    }

    let wallets = (await this.web3Wallet.getWallets())
      .map(address => ({ address, label: address }));

    this.web3Unavailable = false;
    this.web3Locked = false;
    this.setWeb3Wallets(wallets);
    if (this.autoselect && this.web3Wallets.length > 0) {
      this.setWallet(this.web3Wallets[0].address);
      this.autoselect = false;
      this.autoselectChangeEmitter.emit(false);
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
