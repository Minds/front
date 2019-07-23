import { Component, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { WirePaymentsCreatorComponent } from '../../wire/payments-creator/creator.component';
export type PayloadType = 'onchain' | 'offchain';

@Component({
  providers: [CurrencyPipe],
  selector: 'm-payment-plan',
  templateUrl: 'payment-plan.component.html'
})

export class PaymentPlanComponent {

  minds = window.Minds;
  blockchain = window.Minds.blockchain;

  payment = {
    period: null,
    amount: null,
    recurring: null,
    entity_guid: null,
    receiver: null,
  };


  constructor(
    public session: Session,
    private cd: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private client: Client,
    private router: Router,
  ) { }

    /**
     * To be called on plan selection.
     * @param {string} tier - one of "monthly", "yearly" or "lifetime."
     */
  onClick(tier: string) {
    const payment = this.createPayment(tier);
    const creator = this.overlayModal.create(WirePaymentsCreatorComponent, Object.assign(payment, tier), {
      default: this.payment,
    });
    creator.present();
  }


  /**
   * creates a payment object to be passed to the payment creator component.
   * Will default amount to 500 if no param is fed in.
   * @param {string} period - 'monthly','yearly' or 'lifetime'.
   * @returns {object} payment object ready to be passed.
   */
  createPayment(tier: string) {
    switch (tier) {
      case 'month':
        this.payment.amount = 20;
        break;
      case 'year':
        this.payment.amount = 180;
        break;
      case 'lifetime':
        this.payment.amount = 500;
        break;
      default:
        this.payment.amount = 20;
        break;
    }

    this.payment.recurring = true;
    this.payment.entity_guid = '998622649192026120';
    this.payment.receiver = this.blockchain.plus_address;
    this.payment.period = tier;
    return this.payment;
  }

}
