import { Component, EventEmitter, Input, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { SessionFactory } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-paywall',
  templateUrl: 'paywall.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PayWall {

  minds = (<any>window).Minds;

  inProgress: boolean = false;
  error: string;
  showCheckout: boolean = false;
  amount: number;
  nonce: string = '';
  showSignupModal: boolean = false;
  session = SessionFactory.build();

  @Output('entityChange') update: EventEmitter<any> = new EventEmitter;

  @Input() entity;

  constructor(public client: Client, public cd: ChangeDetectorRef) {
  }

  checkout() {
    if (!this.session.isLoggedIn()) {
      this.showSignupModal = true;
      this.detectChanges();
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    this.client.get('api/v1/payments/plans/exclusive/' + this.entity.guid)
      .then((response: any) => {
        this.inProgress = false;
        if (response.subscribed) {
          this.update.next(response.entity);
          this.detectChanges();
          return;
        }
        this.showCheckout = true;
        this.amount = response.amount;
        this.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.error = 'Sorry, there was an error.';
        this.detectChanges();
      });
  }

  subscribe(nonce) {
    this.showCheckout = false;
    this.inProgress = true;
    this.detectChanges();
    console.log('nonce: ' + nonce);
    this.client.post('api/v1/payments/plans/subscribe/' + this.entity.owner_guid + '/exclusive', {
      nonce: nonce
    })
      .then((response) => setTimeout(() => this.checkout(), 0))
      .catch(e => {
        this.inProgress = false;
        this.error = 'Sorry, we couldn\'t complete the transaction.';
        this.detectChanges();
      });
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
