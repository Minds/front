import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { MindsTitle } from '../../../services/ux/title';
import { WireCreatorComponent } from '../../wire/creator/creator.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { BlockchainPreRegisterComponent } from '../pre-register/pre-register.component';
import { BlockchainTdeBuyComponent } from '../tde-buy/tde-buy.component';
import { Session } from '../../../services/session';
import { Web3WalletService } from '../web3-wallet.service';
import { TokenDistributionEventService } from '../contracts/token-distribution-event.service';
import * as BN from 'bn.js';

@Component({
  selector: 'm-blockchain--purchase',
  templateUrl: 'purchase.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainPurchaseComponent implements OnInit {

  stats: { amount, count, requested, issued } = {
    amount: 0,
    count: 0,
    requested: 0,
    issued: 0,
  };

  amount: number = 0.2;

  address: string = '';
  ofac: boolean = false;
  use: boolean = false;
  terms: boolean = false;

  autodetectedWallet: boolean | null = null;

  minds = window.Minds;
  showPledgeModal: boolean = false;
  showLoginModal: boolean = false;
  confirming: boolean = false;
  confirmed: boolean = false;
  error: string;

  @Input() phase: string = 'presale';
  inProgress: boolean = false;

  constructor(
    protected client: Client,
    protected changeDetectorRef: ChangeDetectorRef,
    protected title: MindsTitle,
    protected overlayModal: OverlayModalService,
    protected web3Wallet: Web3WalletService,
    protected tde: TokenDistributionEventService,
    public session: Session
  ) { }

  ngOnInit() {
    this.loadWalletAddress();
    this.load();
  }

  get tokens() {
    const rate = this.web3Wallet.config.rate;
    return this.amount * rate;
  }

  set tokens(value) {
    const rate = this.web3Wallet.config.rate;
    this.amount = value / rate;
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    try {
      const response: any = await this.client.get('api/v2/blockchain/purchase');
      this.stats = {
        amount: response.amount,
        count: response.count,
        requested: response.requested,
        issued: response.issued,
      };
      //this.amount = this.stats.pledged;
    } catch (e) { }

    this.inProgress = false;
    this.detectChanges();
  }

  async loadWalletAddress() {
    const address = await this.web3Wallet.getCurrentWallet();
    this.address = address ? address : '';
    this.autodetectedWallet = !!this.address;
    this.detectChanges();
  }

  purchase() {
    if (this.session.isLoggedIn()) {
      this.showPledgeModal = true;
    } else {
      this.showLoginModal = true;
    }
    this.detectChanges();
  }

  canConfirm() {
    return this.amount > 0 && this.ofac && this.use && this.terms;
  }

  async confirm() {
    this.confirming = true;
    this.detectChanges();

    let tx;

    try {
      tx = await this.tde.buy(this.amount);
    } catch (err) {
      this.error = err;
      this.confirming = false;
      this.detectChanges();
      return;
    }

    let response = await this.client.post('api/v2/blockchain/purchase', {
        tx: tx,
        amount: this.amount,
        wallet_address: await this.web3Wallet.getCurrentWallet()
    });

    this.confirming = false;
    this.confirmed = true;
    this.detectChanges();

    /*setTimeout(() => {
      this.closePledgeModal();
      this.confirmed = false;
    }, 2000);*/
  }

  closeLoginModal() {
    this.showPledgeModal = true;
    this.showLoginModal = false;
    this.detectChanges();
  }

  closePledgeModal() {
    this.showPledgeModal = false;
    this.detectChanges();
  }

  detectChanges() {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

}
