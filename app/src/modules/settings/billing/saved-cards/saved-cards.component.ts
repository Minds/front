import { Component, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../../common/api/client.service';


@Component({
  selector: 'm-settings--billing-saved-cards',
  templateUrl: 'saved-cards.component.html'
})

export class SettingsBillingSavedCardsComponent {

  minds = window.Minds;
  inProgress: boolean = false;
  addNewCard: boolean = false;
  cards: Array<any> = [];

  constructor(private client: Client, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.loadSavedCards();
    this.setupStripe();
    setTimeout(() => {
      this.setupStripe();
    }, 1000); //sometimes stripe can take a while to download
  }

  setupStripe() {
    if ((<any>window).Stripe) {
      (<any>window).Stripe.setPublishableKey(this.minds.stripe_key);
    }
  }

  loadSavedCards(): Promise<any> {
    this.inProgress = true;
    this.cards = [];

    return this.client.get(`api/v1/payments/stripe/cards`)
      .then(({ cards }) => {
        this.inProgress = false;

        if (cards && cards.length) {
          this.cards = cards;
          this.detectChanges();
        }
      })
      .catch(e => {
        this.inProgress = false;
        this.detectChanges();
      });
  }

  removeCard(index: number) {
    this.inProgress = true;

    this.client.delete('api/v1/payments/stripe/card/' + this.cards[index].id)
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

  setCard(card) {
    this.inProgress = true;
    this.detectChanges();

    this.getCardNonce(card)
      .then((token) => {
        this.saveCard(token)
          .then(() => {
            this.inProgress = false;
            this.addNewCard = false;
            this.detectChanges();
            this.loadSavedCards();
          })
          .catch(e => {
            this.inProgress = false;
            this.detectChanges();
            alert((e && e.message) || 'There was an error saving your card.');
          });
      })
      .catch((e) => {
        this.inProgress = false;
        this.detectChanges();
        alert((e && e.message) || 'There was an error with your card information.');
      });
  }

  saveCard(token: string): Promise<any> {
    return this.client.put('api/v1/payments/stripe/card/' + token);
  }

  getCardNonce(card): Promise<string> {
    return new Promise((resolve, reject) => {
      (<any>window).Stripe.card.createToken({
        number: card.number,
        cvc: card.sec,
        exp_month: card.month,
        exp_year: card.year
      }, (status, response) => {
        if (response.error) {
          return reject(response.error.message);
        }
        return resolve(response.id);
      });
    });
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
