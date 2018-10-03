import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TokenDistributionEventService } from '../contracts/token-distribution-event.service';
import { Client } from '../../../services/api/client';
import { Web3WalletService } from '../web3-wallet.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';

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

  pledged: number | null = null;
  address: string = '…';
  tdeAddress: string;

  protected _checkWalletAvailabilityTimer;

  _opts: any;
  set opts(opts: any) {
    this._opts = opts;
  }

  constructor(
    protected cd: ChangeDetectorRef,
    protected tokenDistributionEvent: TokenDistributionEventService,
    protected client: Client,
    protected web3Wallet: Web3WalletService,
    private overlayModal: OverlayModalService,
  ) { }

  ngOnInit() {
    this.updatePledgeConfirmation();
    this.tdeAddress = this.web3Wallet.config.token_distribution_event_address;
  }

  ngOnDestroy() {
    if (this._checkWalletAvailabilityTimer) {
      clearTimeout(this._checkWalletAvailabilityTimer);
    }
  }

  async updatePledgeConfirmation() {
    this.inProgress = true;
    this.detectChanges();

    try {
      const response: any = await this.client.get('api/v2/blockchain/pledges', { brief: 1 });

      if (!response.pledge) {
        throw new Error('No pledge found');
      }

      this.pledged = response.pledge.eth_amount;
      this.address = response.pledge.wallet_address;
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
    this.detectChanges();

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

  async buy() {
    this.inProgress = true;
    this.detectChanges();

    try {
      let bought = await await this.tokenDistributionEvent.buy(this.pledged, 0);

      if (bought) {
        this.success = true;

        if (this._opts && this._opts.onComplete) {
          this._opts.onComplete({ done: true });
        }
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

  changeAmount() {
    if (this._opts && this._opts.onComplete) {
      this._opts.onComplete({ changeAmount: true });
    }

    this.overlayModal.dismiss();
  }
}
