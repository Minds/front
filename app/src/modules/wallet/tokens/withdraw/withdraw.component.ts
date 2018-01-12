import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { WalletTokenRewardsComponent } from '../rewards/rewards.component';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-token--withdraw',
  templateUrl: 'withdraw.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletTokenWithdrawComponent {
  inProgress: boolean = false;
  balance: number = 0;
  amount: number = 0;

  error: string = '';

  @ViewChild(WalletTokenRewardsComponent)
  protected rewardsComponent: WalletTokenRewardsComponent;

  constructor (protected client: Client, protected cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      let response: any = await this.client.get(`api/v1/blockchain/rewards/balance`);

      if (response && typeof response.balance !== 'undefined') {
        this.balance = response.balance / Math.pow(10, 18);
        this.setAmount(this.balance);
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

  setAmount(amount: number | string) {
    if (!amount) {
      this.amount = 0;
      return;
    }

    if (typeof amount === 'number') {
      this.amount = amount;
      return;
    }

    amount = amount.replace(/,/g, '');
    this.amount = parseFloat(amount);
  }

  canWithdraw() {
    return !this.inProgress && !this.error && this.amount > 0 && this.amount <= this.balance;
  }

  async withdraw() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      let tx = null;
      // TODO: Metamask payment

      let response: any = await this.client.post(`api/v1/blockchain/rewards/withdraw`, {
        amount: this.amount * Math.pow(10, 18),
        tx
      });

      if (response && response.done) {
        this.refresh();
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

    if (this.rewardsComponent) {
      this.rewardsComponent.load(true);
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
