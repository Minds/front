import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { WithdrawContractService } from '../../../blockchain/contracts/withdraw-contract.service';
import { Session } from '../../../../services/session';
import { WalletTokenWithdrawLedgerComponent } from './ledger/ledger.component';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-token--withdraw',
  templateUrl: 'withdraw.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletTokenWithdrawComponent {
  inProgress: boolean = false;
  balance: number = 0;
  available: number = 0;
  amount: number = 0;

  error: string = '';
  hasWithdrawnToday: boolean = false;

  withholding: number = 0;

  @ViewChild(WalletTokenWithdrawLedgerComponent)
  protected ledgerComponent: WalletTokenWithdrawLedgerComponent;

  constructor (
    protected client: Client,
    protected cd: ChangeDetectorRef,
    public session: Session,
    protected contract: WithdrawContractService,
    protected web3Wallet: Web3WalletService
  ) { }

  async ngOnInit() {
    this.load();
    try {
      await this.checkPreviousWithdrawals();
    } catch (e) {
      this.error = 'You can only withdraw once a day';
    }
  }

  async load() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      let response: any = await this.client.get(`api/v2/blockchain/wallet/balance`);

      if (response && typeof response.addresses !== 'undefined') {
        this.balance = response.addresses[1].balance / Math.pow(10, 18);
        this.available = response.addresses[1].available / Math.pow(10, 18);

        if (this.balance > this.available) {
          this.withholding = this.balance - this.available;
        }

        this.setAmount(this.available);
      } else {
        this.error = 'Server error';
      }
    } catch (e) {
      console.error(e);
      this.error = (e && e.message) || 'Server error';
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  async checkPreviousWithdrawals() {
    let response: any = await this.client.post('api/v2/blockchain/transactions/can-withdraw');
    if (!response.canWithdraw) {
      this.hasWithdrawnToday = true;
      throw new Error('You can only withdraw once a day');
    }
  }

  setAmount(amount: number | string) {
    if (!amount) {
      this.amount = 0;
      return;
    }

    if (typeof amount === 'number') {
      this.amount = amount;
      this.detectChanges();
      return;
    }

    amount = amount.replace(/,/g, '');
    this.amount = parseFloat(amount);
    this.detectChanges();
  }

  canWithdraw() {
    return !this.hasWithdrawnToday && !this.inProgress && this.amount > 0 && this.amount <= this.available;
  }

  async withdraw() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      await this.checkPreviousWithdrawals();

      await this.web3Wallet.ready();

      if (this.web3Wallet.isUnavailable()) {
        throw new Error('No Ethereum wallets available on your browser.');
      } else if (!(await this.web3Wallet.unlock())) {
        throw new Error('Your Ethereum wallet is locked or connected to another network.');
      }

      let result: { address, guid, amount, gas, tx} = await this.contract.request(
        this.session.getLoggedInUser().guid, 
        this.amount * Math.pow(10, 18)
      );
  
      let response: any = await this.client.post(`api/v2/blockchain/transactions/withdraw`, result);
  
      if (response.done) {
        this.refresh();
        this.ledgerComponent.prepend(response.entity);
      } else {
        this.error = 'Server error';
      }

    } catch (e) {
      console.error(e);
      this.error = (e && e.message) || 'Server error';
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }
  
  refresh() {
    this.load();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
