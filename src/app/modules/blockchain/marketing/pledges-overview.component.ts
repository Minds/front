import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
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
  ofac: boolean = true;
  use: boolean = true;

  autodetectedWallet: boolean | null = null;

  minds = window.Minds;
  showPledgeModal: boolean = false;
  showLoginModal: boolean = false;
  confirming: boolean = false;
  confirmed: boolean = false;
  error: string;

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
    try {
      const response: any = await this.client.get('api/v2/blockchain/pledges');
      this.stats = {
        amount: response.amount,
        count: response.count,
        pledged: response.pledged
      };
      this.amount = this.stats.pledged;
      this.detectChanges();
    } catch (e) { }
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
        throw new Error("You must enter your wallet address and accept the checkboxes above.");

      await this.client.post('api/v2/blockchain/pledges', {
        amount: this.amount,
        wallet_address: this.address
      });
      this.confirmed = true;
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
