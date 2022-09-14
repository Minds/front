import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ComposerService } from '../../../services/composer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SupermindComposerPayloadType,
  SupermindComposerPaymentOptionsType,
  SUPERMIND_DEFAULT_CASH_MIN,
  SUPERMIND_DEFAULT_PAYMENT_METHOD,
  SUPERMIND_DEFAULT_RESPONSE_TYPE,
  SUPERMIND_DEFAULT_TOKENS_MIN,
  SUPERMIND_PAYMENT_METHODS,
} from './superminds-creation.service';
import { Subscription } from 'rxjs';

/**
 * Composer supermind popup component. Called programatically via PopupService.
 * Supermind creation screen
 */
@Component({
  selector: 'm-composer__supermind',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'supermind.component.html',
  styleUrls: ['./supermind.component.ng.scss'],
})
export class ComposerSupermindComponent implements OnInit, OnDestroy {
  /**
   * Signal event emitter to parent's popup service
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Subscription against the composer servicem where source of truth data exists
   */
  supermindRequestDataSubscription: Subscription;

  /**
   * Form group which holds all our data
   */
  formGroup: FormGroup;

  /**
   * The value of the payment method
   */
  get paymentMethod(): SUPERMIND_PAYMENT_METHODS {
    return this.formGroup.controls.paymentMethod.value;
  }

  /**
   * Alias to the payment method enum (so html template can access)
   */
  PaymentMethods = SUPERMIND_PAYMENT_METHODS;

  /**
   * Alias for amount mins (so html template can access)
   */
  CashMin = SUPERMIND_DEFAULT_CASH_MIN;
  TokensMin = SUPERMIND_DEFAULT_TOKENS_MIN;

  /**
   * The value of the inputted username
   */
  get recipientUsername(): string {
    return this.formGroup.controls.username.value;
  }

  get isFormValid(): boolean {
    return this.formGroup.valid;
  }

  /**
   * Constructor
   * @param service
   * @param configs
   */
  constructor(protected service: ComposerService, private fb: FormBuilder) {}

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this.formGroup = this.fb.group({
      username: ['', [Validators.required]],
      offerUsd: [
        SUPERMIND_DEFAULT_CASH_MIN,
        [Validators.min(SUPERMIND_DEFAULT_CASH_MIN)],
      ],
      offerTokens: [
        SUPERMIND_DEFAULT_TOKENS_MIN,
        [Validators.min(SUPERMIND_DEFAULT_TOKENS_MIN)],
      ],
      termsAccepted: [false, [Validators.requiredTrue]],
      responseType: [
        SUPERMIND_DEFAULT_RESPONSE_TYPE.toString(),
        [Validators.required],
      ],
      paymentMethod: [SUPERMIND_DEFAULT_PAYMENT_METHOD],
      cardId: [''], // Card
    });

    /**
     * Sets the values from the composer payload
     * (note, this is only every updated onSave() or by the composer edit functions, updating the form itself will not emit an event)
     */
    this.supermindRequestDataSubscription = this.service.supermindRequest$.subscribe(
      supermindRequest => {
        if (!supermindRequest) {
          if (this.formGroup.dirty) {
            this.formGroup.reset();
          }
          return;
        }

        this.formGroup.controls.username.setValue(
          supermindRequest.receiver_guid
        );

        this.formGroup.controls.paymentMethod.setValue(
          supermindRequest.payment_options.payment_type
        );

        switch (supermindRequest.payment_options.payment_type) {
          case SUPERMIND_PAYMENT_METHODS.CASH:
            this.formGroup.controls.offerUsd.setValue(
              supermindRequest.payment_options.amount
            );
            this.formGroup.controls.cardId.setValue(
              supermindRequest.payment_options.payment_method_id
            );
            break;
          case SUPERMIND_PAYMENT_METHODS.TOKENS:
            this.formGroup.controls.offerTokens.setValue(
              supermindRequest.payment_options.amount
            );
            break;
        }

        this.formGroup.controls.responseType.setValue(
          supermindRequest.reply_type.toString()
        );

        this.formGroup.controls.termsAccepted.setValue(
          supermindRequest.terms_agreed
        );

        // Will ensure clear button is displayed
        this.formGroup.markAsDirty();
      }
    );
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy() {
    this.supermindRequestDataSubscription.unsubscribe();
  }

  /**
   * Sets the payment method from outside of the form
   * @param paymentMethod
   */
  setPaymentMethod(paymentMethod: SUPERMIND_PAYMENT_METHODS): void {
    this.formGroup.controls.paymentMethod.setValue(paymentMethod);
  }

  /**
   * The card selector component will call this
   * - Ideally it would also be a form component :/
   */
  onCardSelected(cardId: string) {
    console.log(cardId);
    this.formGroup.controls.cardId.setValue(cardId);
  }

  /**
   * Emits the internal state to the composer service, stores to MRU cache and attempts to dismiss the modal
   */
  onSave(): void {
    let paymentOptions: SupermindComposerPaymentOptionsType = {
      amount:
        this.paymentMethod === SUPERMIND_PAYMENT_METHODS.CASH
          ? this.formGroup.controls.offerUsd.value
          : this.formGroup.controls.offerTokens.value,
      payment_type: this.paymentMethod,
    };

    if (this.paymentMethod === SUPERMIND_PAYMENT_METHODS.CASH) {
      paymentOptions.payment_method_id = this.formGroup.controls.cardId.value;
    }

    const supermindRequest: SupermindComposerPayloadType = {
      receiver_guid: this.formGroup.controls.username.value, // we can pass a username to the guid field
      reply_type: parseInt(this.formGroup.controls.responseType.value),
      twitter_required: false,
      payment_options: paymentOptions,
      terms_agreed: this.formGroup.controls.termsAccepted.value,
    };

    this.service.supermindRequest$.next(supermindRequest);

    this.dismissIntent.emit();
  }

  /**
   * Cancels the supermind request
   */
  onClear(): void {
    this.service.supermindRequest$.next(null);

    this.dismissIntent.emit();
  }
}
