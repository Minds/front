import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TokenDistributionEventService } from '../contracts/token-distribution-event.service';
import { Client } from '../../../services/api/client';
import { Web3WalletService } from '../web3-wallet.service';
import { TransactionOverlayService } from '../transaction-overlay/transaction-overlay.service';

@Component({
  moduleId: module.id,
  selector: 'm-blockchain--tde-buy',
  templateUrl: 'tde-buy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainTdeBuyComponent implements OnInit {
  inProgress: boolean;
  success: boolean;
  error: string = '';
  metamaskError: string = '';

  model = {
    eth: 0.1,
    tokens: 35
  };

  tokensRate = 350;

  protected _checkWalletAvailabilityTimer;

  constructor(
    protected cd: ChangeDetectorRef,
    protected tokenDistributionEvent: TokenDistributionEventService,
    protected client: Client,
    protected web3Wallet: Web3WalletService,
    protected overlayService: TransactionOverlayService
  ) { }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    if (this._checkWalletAvailabilityTimer) {
      clearTimeout(this._checkWalletAvailabilityTimer);
    }
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    try {
      let response: any = await this.client.get(`api/v2/blockchain/tde/rates`);

      if (!response || !response.rates) {
        this.error = 'There was an error reading token rates';
      } else {
        this.tokensRate = response.rates.eth;
      }

    } catch (e) {
      this.error = (e && e.message) || 'There was an error reading token rates';
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }

    this.checkWalletAvailability();
  }

  async checkWalletAvailability() {
    let metamaskError = '';

    this._checkWalletAvailabilityTimer = void 0;

    if (!this.metamaskError) {
      this.inProgress = true;
      this.detectChanges();
    }

    if (this.web3Wallet.isUnavailable()) {
      metamaskError = 'There are no Ethereum wallet clients available.';
    } else if (!(await this.web3Wallet.unlock())) {
      metamaskError = 'There are no local wallets available, the wallet manager is locked, or you\'re connected to a different network.';
    }

    this.inProgress = false;

    if (this.metamaskError !== metamaskError) {
      this.metamaskError = metamaskError;
    }

    this.detectChanges();

    if (this.metamaskError) {
      this._checkWalletAvailabilityTimer = setTimeout(() => this.checkWalletAvailability(), 1000); // check again in 1s
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  setEth(amount: string) {
    if (!amount) {
      amount = '0';
    }

    this.model.eth = Math.floor(parseFloat(amount) * 1000000) / 1000000;
    this.model.tokens = Math.floor((this.model.eth * this.tokensRate) * 10000) / 10000;
  }

  setTokens(amount: string) {
    if (!amount) {
      amount = '0';
    }

    this.model.tokens = Math.floor(parseFloat(amount) * 10000) / 10000;
    this.model.eth = Math.floor((this.model.tokens / this.tokensRate) * 1000000) / 1000000;
  }

  async buy() {
    this.inProgress = true;
    this.detectChanges();

    try {
      let bought = await await this.tokenDistributionEvent.buy(this.model.eth);

      if (bought) {
        this.success = true;
      } else {
        this.error = 'There was an issue buying tokens';
      }
    } catch (e) {
      this.error = (e && e.message) || 'There was an issue buying tokens';
    } finally {
      this.inProgress = false;

      this.detectChanges();
    }
  }
}
