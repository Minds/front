import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { Web3WalletService } from '../../../web3-wallet.service';
import { TokenDistributionEventService } from '../../../contracts/token-distribution-event.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { Web3ModalService } from '@mindsorg/web3modal-angular';
import { BlockchainMarketingLinksService } from '../../../marketing/v2/blockchain-marketing-links.service';

export type LaunchButtonType = 'analytics' | 'earn';

@Component({
  selector: 'm-blockchain--purchase--v2',
  templateUrl: 'purchase.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./purchase.component.ng.scss'],
})
export class BlockchainPurchaseV2Component implements OnInit {
  stats: { amount; count; requested; issued } = {
    amount: 0,
    count: 0,
    requested: 0,
    issued: 0,
  };

  //amount: number = 0.25;
  tokens: number = 0;

  address: string = '';
  ofac: boolean = false;
  use: boolean = false;
  terms: boolean = false;

  autodetectedWallet: boolean | null = null;

  showPledgeModal: boolean = false;
  showLoginModal: boolean = false;
  showEthModal: boolean = false;
  confirming: boolean = false;
  confirmed: boolean = false;
  sendWyreError: string = '';
  error: string;

  @Input() phase: string = 'sale';
  inProgress: boolean = false;
  rate: number = 0;
  cpm: number = 1;

  paramsSubscription: Subscription;

  @Input() hasTitle: boolean = false;
  @Input() launchButtons: LaunchButtonType[] = [];

  constructor(
    protected client: Client,
    protected changeDetectorRef: ChangeDetectorRef,
    protected web3modalService: Web3ModalService,
    protected web3Wallet: Web3WalletService,
    protected tde: TokenDistributionEventService,
    public session: Session,
    private route: ActivatedRoute,
    protected router: Router,
    protected toasterService: ToasterService,
    private linksService: BlockchainMarketingLinksService
  ) {}

  ngOnInit() {
    this.loadWalletAddress();
    this.load().then(() => {
      this.amount = 0.25;
      this.detectChanges();
    });
    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params.purchaseEth) {
        this.purchaseEth();
      }
    });

    if (this.route.snapshot.queryParamMap.get('failed') === '1') {
      this.sendWyreError = 'Sorry, your purchase appears to have failed.';
      this.toasterService.error(this.sendWyreError);
    }
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  get amount() {
    let newAmnt = this.tokens / this.rate;
    let wei = 10 ** 18;
    return Math.ceil(newAmnt * wei) / wei; // Rounds up amount and add 1/1000th ETH to compensate for rounding
  }

  get calculatedViews() {
    return Math.floor(this.tokens / (this.cpm / 1000));
  }

  set amount(value: number) {
    this.tokens = value * this.rate;
  }

  selectAllInput(input: HTMLInputElement) {
    setTimeout(() => {
      try {
        input.select();
        input.setSelectionRange(0, input.value.length);
      } catch (e) {}
    }, 50);
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
      this.rate = response.rate;
      //this.amount = this.stats.pledged;
    } catch (e) {}

    this.inProgress = false;
    this.detectChanges();
  }

  async loadWalletAddress() {
    const address = await this.web3Wallet.getCurrentWallet();
    this.address = address ? address : '';
    this.autodetectedWallet = !!this.address;
    this.detectChanges();
  }

  async purchase() {
    await this.load();

    if (!this.session.isLoggedIn()) {
      this.showLoginModal = true;
    } else {
      this.showPledgeModal = true;
    }

    this.detectChanges();
  }

  canConfirm() {
    return this.amount > 0 && this.ofac && this.use && this.terms;
  }

  async confirm() {
    this.confirming = true;
    this.detectChanges();

    let tx, amount;

    try {
      let comp = 0.000000000000000001;
      amount = parseFloat((this.amount + comp).toFixed(18)); // Allow for small rounding discrepencies caused by recurring decimals
      tx = await this.tde.buy(amount, this.rate);
    } catch (err) {
      this.error = err;
      this.toasterService.error(this.error);
      this.confirming = false;
      this.detectChanges();
      return;
    }

    let response = await this.client.post('api/v2/blockchain/purchase', {
      tx: tx,
      amount: amount.toString(),
      wallet_address: await this.web3Wallet.getCurrentWallet(true),
    });

    this.confirming = false;
    this.confirmed = true;
    this.detectChanges();

    /*setTimeout(() => {
      this.closePledgeModal();
      this.confirmed = false;
    }, 2000);*/
  }

  purchaseEth() {
    this.showEthModal = true;
    this.detectChanges();
    //let win = window.open('/checkout');
    //win.onload = function() {
    //  this.toasterService.error('opened');
    //}
  }

  closePurchaseEth() {
    this.showEthModal = false;
    this.detectChanges();
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

  promptTokenInput(input) {
    this.toasterService.error(
      'Please enter how many tokens you wish to purchase'
    );
    setTimeout(() => {
      input.focus();
    }, 100);
  }

  /**
   * Called on "Token Analytics" click.
   */
  public tokenAnalyticsClick(): void {
    this.linksService.navigateToTokenAnalytics();
  }

  /**
   * Called on "Earn" click.
   */
  public earnClick(): void {
    this.linksService.openEarnModal();
  }

  public onBuyTokensClick(): void {
    this.linksService.openBuyTokensModal();
  }

  detectChanges() {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }
}
