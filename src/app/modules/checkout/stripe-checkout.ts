import {
  Component,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';

import { Client } from '../../services/api';
import { ConfigsService } from '../../common/services/configs.service';

interface CreditCard {
  number?: number;
  type?: string;
  name?: string;
  sec?: number;
  month?: number | string;
  year?: number | string;
}

@Component({
  moduleId: module.id,
  selector: 'minds-payments-stripe-checkout',
  outputs: ['inputed', 'done'],
  template: `
    <div class="m-error mdl-color--red mdl-color-text--white" *ngIf="error">
      {{ error }}
    </div>

    <div
      class="m-payments-options"
      style="margin-bottom:8px;"
      *ngIf="useBitcoin"
      [class.mdl-card]="useMDLStyling"
    >
      <div id="coinbase-btn" *ngIf="useBitcoin"></div>
    </div>

    <div [hidden]="!loading" class="m-checkout-loading">
      <div
        class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"
        style="margin:auto; display:block;"
        [mdl]
      ></div>
      <p i18n="@@CHECKOUT__WAITING_LABEL">One moment please...</p>
    </div>

    <div class="m-payments--saved-cards" *ngIf="cards.length">
      <div class="m-payments-saved--title" i18n="@@CHECKOUT__SAVED_CARDS_TITLE">
        Select a card to use
      </div>
      <ul>
        <li
          *ngFor="let card of cards"
          class="m-payments--saved-card-item"
          (click)="setSavedCard(card.id)"
        >
          <span class="m-payments--saved-card-item-type">{{ card.brand }}</span>
          <span class="m-payments--saved-card-item-number"
            >**** {{ card.last4 }}</span
          >
          <span class="m-payments--saved-card-item-expiry"
            >{{ card.exp_month }} / {{ card.exp_year }}</span
          >
          <span
            class="m-payments--saved-card-item-select"
            i18n="@@M__ACTION__SELECT"
            >Select</span
          >
        </li>
        <li
          class="m-payments--saved-card-item m-payments-saved--item-new"
          (click)="cards = []"
        >
          <span
            class="m-payments--saved-card-item-type"
            i18n="@@CHECKOUT__USE_NEW_CARD"
            >Use a new card</span
          >
          <span
            class="m-payments--saved-card-item-select"
            i18n="@@M__ACTION__SELECT"
            >Select</span
          >
        </li>
      </ul>
    </div>

    <minds-checkout-card-input
      (confirm)="setCard($event)"
      [hidden]="inProgress || confirmation || loading"
      [useMDLStyling]="useMDLStyling"
      *ngIf="useCreditCard && !cards.length"
    >
    </minds-checkout-card-input>
    <div [hidden]="!inProgress" class="m-checkout-loading">
      <div
        class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"
        style="margin:auto; display:block;"
        [mdl]
      ></div>
      <p i18n="@@CHECKOUT__CAPTURING_DETAILS">Capturing card details...</p>
    </div>
  `,
})
export class StripeCheckout {
  readonly stripeKey: string;
  loading: boolean = false;
  inProgress: boolean = false;
  confirmation: boolean = false;
  error: string = '';
  card;

  inputed: EventEmitter<any> = new EventEmitter();
  done: EventEmitter<any> = new EventEmitter();

  @Input() amount: number = 0;
  @Input() merchant_guid;
  @Input() gateway: string = 'merchants';

  @Input('useMDLStyling') useMDLStyling: boolean = true;

  stripe;
  bt_checkout;
  nonce: string = '';

  cards: any[] = [];

  @Input() useCreditCard: boolean = true;
  @Input() useBitcoin: boolean = false;

  constructor(
    public client: Client,
    private cd: ChangeDetectorRef,
    configs: ConfigsService
  ) {
    this.stripeKey = configs.get('stripe_key');
  }

  ngOnInit() {
    setTimeout(() => {
      this.setupStripe();
    }, 1000); //sometimes stripe can take a while to download

    this.loadSavedCards();
  }

  setupStripe() {
    if ((<any>window).Stripe) {
      (<any>window).Stripe.setPublishableKey(this.stripeKey);
    }
  }

  loadSavedCards() {
    this.loading = true;
    this.cards = [];

    return this.client
      .get(`api/v1/payments/stripe/cards`)
      .then(({ cards }) => {
        this.loading = false;

        if (cards && cards.length) {
          /*this.cards = (<any[]>cards).map(card => ({
            id: card.id,
            label: `${card.brand} ${card.exp_month}/${('' + card.exp_year).substr(2)} **** ${card.last4}`
          }));*/
          this.cards = cards;
          this.detectChanges();
        }
        this.detectChanges();
      })
      .catch(e => {
        this.loading = false;
        this.detectChanges();
      });
  }

  setSavedCard(id) {
    this.inProgress = true;

    this.nonce = id;
    this.inputed.next(this.nonce);
    this.inProgress = false;
    this.detectChanges();
  }

  setCard(card) {
    // console.log(card);
    this.card = card;
    this.getCardNonce();
    this.detectChanges();
  }

  getCardNonce() {
    this.inProgress = true;

    (<any>window).Stripe.card.createToken(
      {
        number: this.card.number,
        cvc: this.card.sec,
        exp_month: this.card.month,
        exp_year: this.card.year,
      },
      (status, response) => {
        if (response.error) {
          this.error = response.error.message;
          this.inProgress = false;
          this.detectChanges();
          return false;
        }
        this.nonce = response.id;
        this.inputed.next(this.nonce);
        this.inProgress = false;
        this.detectChanges();
      }
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
