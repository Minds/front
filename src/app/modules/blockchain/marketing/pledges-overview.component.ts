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
import * as BN from 'bn.js';

@Component({
  selector: 'm-blockchain--pledges--overview',
  templateUrl: 'pledges-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainPledgesOverviewComponent implements OnInit {

  stats: { amount, count, pledged } = {
    amount: 0,
    count: 0,
    pledged: 0,
  };
  
  amount: number = 0.2;

  address: string = '';
  ofac: boolean = false;
  use: boolean = false;

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
    public session: Session
  ) { }

  ngOnInit() {
    this.loadWalletAddress();
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    try {
      const response: any = await this.client.get('api/v2/blockchain/pledges');
      this.stats = {
        amount: response.amount,
        count: response.count,
        pledged: response.pledge.eth_amount
      };
      this.amount = this.stats.pledged;
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

  pledge() {
    if (this.session.isLoggedIn()) {
      this.showPledgeModal = true;
    } else {
      this.showLoginModal = true;
    }
    this.detectChanges();
  }

  canConfirm() {
    return this.address && this.amount > 0 && this.ofac && this.use;
  }

  async confirm() {
    if (this.confirming)
      return;

    this.confirming = true;
    this.detectChanges();

    try {
      if (!this.canConfirm())
        throw new Error('You must enter your wallet address and accept the checkboxes above.');

      const response: any = await this.client.post('api/v2/blockchain/pledges', {
        amount: this.amount,
        wallet_address: this.address
      });

      if (!response.pledge) {
        throw new Error('Internal server error');
      }

      this.confirmed = true;

      const amount = (new BN(`${this.stats.amount}`))
        .add(new BN(`${response.pledge.amount}`))
        .toString();

      this.stats = {
        amount,
        count: parseInt(this.stats.count, 10) + 1,
        pledged: `${response.amount}`
      };

      setTimeout(() => this.closePledgeModal(), 1000);
    } catch (err) {
      this.error = err.message;
      alert(err.message);
    } finally {
      this.confirming = false;
      this.detectChanges();
    }
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
