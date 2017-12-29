import { Component, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { CreditCard } from '../../../interfaces/card-interface';


@Component({
  moduleId: module.id,
  selector: 'm-wallet-purchase',
  templateUrl: 'purchase.component.html',
  inputs: ['toggled']
})

export class WalletPurchaseComponent {

  card: CreditCard = <CreditCard>{ month: 'mm', year: 'yyyy' };

  ex: number = 0.01;
  points: number = 10000;
  usd: number;

  subscription;

  inProgress: boolean = false;
  confirmation: boolean = false;
  source: string | number = '';
  recurring: boolean = true;
  coupon: string = '';
  error: string = '';

  toggled: boolean = true;

  constructor(public client: Client, public wallet: WalletService, private cd: ChangeDetectorRef) {
    this.getRate();
    this.calculateUSD();
    this.getSubscription();
  }

  validate() {
    if (this.usd < 0.01) {
      return false;
    }
    return true;
  }

  getRate() {
    this.client.get('api/v1/wallet/count')
      .then((response: any) => {
        this.ex = response.ex.usd;
        this.detectChanges();
      });
  }

  calculatePoints() {
    this.points = this.usd / this.ex;
    this.detectChanges();
  }

  calculateUSD() {
    this.usd = this.points * this.ex;
    this.client.post('api/v1/wallet/quote', { points: this.points })
      .then((response: any) => {
        this.usd = response.usd;
        this.detectChanges();
      });
  }

  getSubscription() {
    this.client.get('api/v1/wallet/subscription')
      .then((response: any) => {
        if (response.subscription) {
          this.subscription = response.subscription;
        }
        this.detectChanges();
      });
  }

  buy() {
    if (!this.toggled) {
      this.toggled = true;
    }
    this.detectChanges();
  }

  purchase() {
    if (!this.validate()) {
      this.error = 'Sorry, please check your details and try again';
      this.detectChanges();
      return false;
    }
    this.inProgress = true;
    this.error = '';

    if (this.recurring) {
      if (!confirm('Are you sure you want to repeat this transaction every month and get 10% more points?')) {
        return;
      }
      this.client.post('api/v1/wallet/subscription', {
        points: this.points,
        source: this.source,
        coupon: this.coupon
      })
        .then((response: any) => {
          if (response.status !== 'success') {
            this.error = 'Please check your payment details and try again.';
            this.inProgress = false;
            this.source = null;
            this.detectChanges();
            return false;
          }
          this.confirmation = true;
          this.inProgress = false;
          this.detectChanges();
        })
        .catch((e) => {
          this.error = e.message;
          this.inProgress = false;
          this.source = null;
          this.detectChanges();
        });
    } else {
      this.client.post('api/v1/wallet/purchase-once', {
        amount: this.usd,
        points: this.points,
        source: this.source
      })
        .then((response: any) => {
          if (response.status !== 'success') {
            this.error = 'Please check your payment details and try again.';
            this.detectChanges();
            return false;
          }
          this.confirmation = true;
          this.inProgress = false;
          this.detectChanges();
        })
        .catch((e) => {
          this.error = e.message;
          this.inProgress = false;
          this.source = null;
          this.detectChanges();
        });
    }
  }

  cancelSubscription() {
    if (!confirm('Are you sure you wish to cancel your monthly points subscription?')) {
      return false;
    }

    this.client.delete('api/v1/wallet/subscription')
      .then((response: any) => {
        this.subscription = null;
        this.detectChanges();
      });
  }

  setSource(source: string) {
    this.source = source;
    this.purchase();
    this.detectChanges();
  }

  reset() {
    this.getSubscription();
    this.confirmation = false;
    this.source = null;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
