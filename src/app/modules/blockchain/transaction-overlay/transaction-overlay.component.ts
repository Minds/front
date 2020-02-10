import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  OnInit,
} from '@angular/core';
import * as ethAccount from 'ethjs-account';
import * as Eth from 'ethjs';
import * as BN from 'bn.js';

import { TransactionOverlayService } from './transaction-overlay.service';
import { TokenContractService } from '../contracts/token-contract.service';
import { Router } from '@angular/router';
import { Web3WalletService } from '../web3-wallet.service';
import { GetMetamaskComponent } from '../metamask/getmetamask.component';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm--blockchain--transaction-overlay',
  templateUrl: 'transaction-overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionOverlayComponent implements OnInit {
  @HostBinding('hidden') _isHidden: boolean = true;

  message: string = '';
  comp: number;

  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;

  data: { unlock; tx; extras } = {
    unlock: {
      privateKey: '',
      secureMode: true,
    },
    tx: {},
    extras: {},
  };

  balance: string = '0';
  ethBalance: string = '0';

  droppingKeyFile: boolean = false;

  protected eventEmitter: EventEmitter<any> = new EventEmitter();

  readonly COMP_METAMASK = 1;
  readonly COMP_LOCAL = 2;
  readonly COMP_UNLOCK = 3;
  readonly COMP_SETUP_METAMASK = 4;

  constructor(
    protected service: TransactionOverlayService,
    protected cd: ChangeDetectorRef,
    protected token: TokenContractService,
    protected web3Wallet: Web3WalletService,
    protected router: Router,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit() {
    this.service.setComponent(this);
  }

  get isHidden() {
    return this._isHidden;
  }

  show(
    comp: number,
    message: string = '',
    defaultTxObject: Object = null,
    extras = {}
  ): EventEmitter<any> {
    this.message = message;
    this.comp = comp;
    this.reset();
    this.setTx(defaultTxObject);
    this.data.extras = extras;
    this.droppingKeyFile = false;
    this._isHidden = false;

    this.detectChanges();

    this.onDidShow();

    return this.eventEmitter;
  }

  hide() {
    this.message = '';
    this.comp = void 0;
    this.reset();
    this.droppingKeyFile = false;
    this._isHidden = true;

    this.detectChanges();
  }

  reset() {
    this.data = {
      unlock: {
        privateKey: '',
        secureMode: true,
      },
      tx: {},
      extras: {},
    };
  }

  setTx(tx: Object) {
    if (!tx) {
      this.data.tx = {};
      return;
    }

    this.data.tx = Object.assign({}, tx);

    if (typeof this.data.tx.gasPrice !== 'undefined') {
      this.data.tx.gasPrice = Eth.fromWei(this.data.tx.gasPrice, 'Gwei');
    }

    if (typeof this.data.tx.gas === 'undefined') {
      this.data.tx.gas = 0;
    }
  }

  getTx() {
    if (!this.data.tx) {
      return {};
    }

    let tx = Object.assign({}, this.data.tx);

    tx.gasPrice = Eth.toWei(tx.gasPrice, 'Gwei');

    return tx;
  }

  //

  validateUnlock() {
    if (!this.data.unlock.privateKey) {
      return false;
    }

    try {
      let privateKey = this.data.unlock.privateKey;

      if (privateKey.substr(0, 2) !== '0x') {
        privateKey = `0x${privateKey}`;
      }

      ethAccount.privateToAccount(privateKey);
    } catch (e) {
      return false;
    }

    return true;
  }

  unlock() {
    if (!this.validateUnlock()) {
      return;
    }

    let privateKey = this.data.unlock.privateKey;

    if (privateKey.substr(0, 2) !== '0x') {
      privateKey = `0x${privateKey}`;
    }

    this.eventEmitter.next({
      privateKey,
      secureMode: this.data.unlock.secureMode,
    });

    this.hide();
  }

  @HostListener('dragover', ['$event'])
  keyDragOver(e: any) {
    if (this.comp !== this.COMP_UNLOCK) {
      return;
    }

    e.preventDefault();
    this.droppingKeyFile = true;
  }

  @HostListener('dragleave', ['$event'])
  keyDragLeave(e: any) {
    if (this.comp !== this.COMP_UNLOCK) {
      return;
    }

    e.preventDefault();

    if (e.layerX < 0) {
      this.droppingKeyFile = false;
    }
  }

  @HostListener('drop', ['$event'])
  keyDropFile(e: any) {
    if (this.comp !== this.COMP_UNLOCK) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    this.droppingKeyFile = false;

    const transfer = e.dataTransfer || (<any>e).originalEvent.dataTransfer;

    if (!transfer) {
      console.warn('no transfer object');
      return;
    }

    const file = transfer.files[0];

    if (!file) {
      console.warn('file cannot be read');
      return;
    }

    switch (file.type) {
      case 'text/csv':
        // MetaMask
        this.loadKeyFromCSV(file);
        break;

      case 'application/json':
      case '':
        // Keystore JSON
        this.loadKeyFromJSON(file);
        break;
    }
  }

  loadKeyFromCSV(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      let privateKey = e.target.result.trim();

      try {
        if (privateKey.substr(0, 2) !== '0x') {
          privateKey = `0x${privateKey}`;
        }

        if (ethAccount.privateToAccount(privateKey)) {
          this.data.unlock.privateKey = privateKey;
          this.detectChanges();
        }
      } catch (e) {}
    };

    reader.readAsText(file);
  }

  loadKeyFromJSON(file: File) {
    throw new Error('Not implemented');
  }

  //

  validateTxObject() {
    return (
      this.data.tx &&
      this.data.tx.gasPrice &&
      this.data.tx.gas &&
      this.data.tx.from
    );
  }

  approve() {
    if (!this.validateTxObject()) {
      return;
    }

    this.eventEmitter.next(this.getTx());

    this.hide();
  }

  async checkTokenBalance(passedTokenDelta) {
    const tokenDelta = new BN(passedTokenDelta);

    if (tokenDelta.gte('0') || !this.data.tx.from) {
      return;
    }

    try {
      const balance = new BN(
        (await this.token.balanceOf(this.data.tx.from))[0]
      );

      this.balance = balance.toString(10);

      if (balance.add(tokenDelta).lt('0')) {
        this.reject('Not enough tokens to complete this transaction');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getEthBalance() {
    try {
      const balance = await this.web3Wallet.getBalance(this.data.tx.from);
      this.ethBalance = balance ? balance : '0';
    } catch (e) {
      console.error(e);
    }
  }

  //

  onDidShow() {
    switch (this.comp) {
      case this.COMP_LOCAL:
        if (this.data.extras.tokenDelta) {
          this.checkTokenBalance(this.data.extras.tokenDelta);
          this.getEthBalance();
        }
        break;
    }
  }

  //

  cancel() {
    this.eventEmitter.next(false);
    this.hide();
  }

  reject(message: string) {
    this.eventEmitter.next(new Error(message));
    this.hide();
  }

  //

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  handleMetamaskAction($event) {
    let next = $event;
    if ($event === GetMetamaskComponent.ACTION_CANCEL) {
      next = false;
    }
    this.eventEmitter.next($event);
    this.hide();
  }
}
