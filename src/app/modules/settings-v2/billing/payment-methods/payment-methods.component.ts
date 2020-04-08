import { Component, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../../common/api/client.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { PaymentsNewCard } from '../../../payments/new-card/new-card.component';
import * as moment from 'moment';

@Component({
  selector: 'm-settingsV2__paymentMethods',
  templateUrl: './payment-methods.component.html',
})
export class SettingsV2PaymentMethodsComponent {
  init: boolean = false;
  inProgress: boolean = false;
  addingNewCard: boolean = false;
  cards: Array<any> = [];

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private overlayModal: OverlayModalService
  ) {}

  ngOnInit() {
    this.loadSavedCards();
  }

  loadSavedCards(): Promise<any> {
    this.inProgress = true;
    this.cards = [];

    return this.client
      .get(`api/v2/payments/stripe/paymentmethods`)
      .then(({ paymentmethods }) => {
        this.inProgress = false;
        this.init = true;

        if (paymentmethods && paymentmethods.length) {
          this.cards = paymentmethods;
          this.detectChanges();
        }
      })
      .catch(e => {
        this.inProgress = false;
        this.init = true;

        this.detectChanges();
      });
  }

  removeCard(index: number) {
    this.inProgress = true;

    this.client
      .delete('api/v2/payments/stripe/paymentmethods/' + this.cards[index].id)
      .then(() => {
        this.cards.splice(index, 1);

        this.inProgress = false;
        this.detectChanges();
      })
      .catch(() => {
        this.inProgress = false;
        this.detectChanges();
      });
  }

  addNewCard() {
    this.overlayModal
      .create(
        PaymentsNewCard,
        {},
        {
          class: '',
          onCompleted: () => {
            this.loadSavedCards(); //refresh list
            this.overlayModal.dismiss();
          },
        }
      )
      .present();
  }

  cardExpired(expiry) {
    const lastDayThisMonth = moment().endOf('month'),
      lastDayExpiryMonth = moment(expiry, 'M/YYYY').endOf('month');

    return lastDayThisMonth > lastDayExpiryMonth;
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
