import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ComposerService } from '../../../services/composer.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  SUPERMIND_DEFAULT_PAYMENT_METHOD,
  SUPERMIND_DEFAULT_RESPONSE_TYPE,
  SUPERMIND_PAYMENT_METHODS,
  SupermindComposerPayloadType,
  SupermindComposerPaymentOptionsType,
} from './superminds-creation.service';
import { Subscription } from 'rxjs';
import {
  EntityResolverService,
  EntityResolverServiceOptions,
} from '../../../../../common/services/entity-resolver.service';
import { MindsUser } from '../../../../../interfaces/entities';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { SupermindSettings } from '../../../../settings-v2/payments/supermind/supermind.types';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

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

  private targetUsernameSubscription: Subscription;

  /**
   * Form group which holds all our data
   */
  formGroup: FormGroup;

  inProgress: boolean = false;

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
  private cashMin?: number;
  get CashMin(): number {
    return (
      this.cashMin ??
      (this.mindsConfig.get<object>('supermind')[
        'min_thresholds'
      ] as SupermindSettings).min_cash
    );
  }

  private tokensMin?: number;
  get TokensMin(): number {
    return (
      this.tokensMin ??
      (this.mindsConfig.get<object>('supermind')[
        'min_thresholds'
      ] as SupermindSettings).min_offchain_tokens
    );
  }

  /**
   * The value of the inputted username
   */
  get recipientUsername(): string {
    return this.formGroup.controls.username.value;
  }

  get isFormValid(): boolean {
    return this.formGroup.valid;
  }

  private targetUser?: MindsUser;

  /**
   * Constructor
   * @param service
   * @param configs
   */
  constructor(
    protected service: ComposerService,
    private fb: FormBuilder,
    private mindsConfig: ConfigsService,
    private entityResolverService: EntityResolverService,
    private changeDetector: ChangeDetectorRef
  ) {}

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this.formGroup = this.fb.group({
      username: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'change',
        },
      ],
      offerUsd: [this.CashMin],
      offerTokens: [this.TokensMin],
      termsAccepted: [false, [Validators.requiredTrue]],
      refundPolicyAccepted: [false, [Validators.requiredTrue]],
      responseType: [
        SUPERMIND_DEFAULT_RESPONSE_TYPE.toString(),
        [Validators.required],
      ],
      paymentMethod: [SUPERMIND_DEFAULT_PAYMENT_METHOD],
      cardId: [''], // Card
    });

    this.targetUsernameSubscription = this.formGroup.controls.username.valueChanges
      .pipe(
        filter((username: string) => username !== ''),
        distinctUntilChanged(),
        switchMap((username: string) => {
          this.inProgress = true;
          let options = new EntityResolverServiceOptions();
          options.refType = 'username';
          options.ref = username;

          return this.entityResolverService.get$<MindsUser>(options);
        })
      )
      .subscribe(user => {
        this.targetUser = user;
        this.inProgress = false;
        this.setMinimumPaymentAmountFromUser(user);
        this.refreshMerchantValidator();
      });

    /**
     * Sets the values from the composer payload
     * (note, this is only ever updated onSave() or by the composer edit functions, updating the form itself will not emit an event)
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
            this.formGroup.controls.offerUsd.addValidators(
              this.cashMinAmountValidator()
            );
            this.formGroup.controls.cardId.setValue(
              supermindRequest.payment_options.payment_method_id
            );
            break;
          case SUPERMIND_PAYMENT_METHODS.TOKENS:
            this.formGroup.controls.offerTokens.setValue(
              supermindRequest.payment_options.amount
            );
            this.formGroup.controls.offerTokens.addValidators(
              this.tokensMinAmountValidator()
            );
            break;
        }

        this.formGroup.controls.responseType.setValue(
          supermindRequest.reply_type.toString()
        );

        this.formGroup.controls.termsAccepted.setValue(
          supermindRequest.terms_agreed
        );

        this.formGroup.controls.refundPolicyAccepted.setValue(
          supermindRequest.refund_policy_agreed
        );

        this.setMinimumPaymentAmountFromUser(supermindRequest.receiver_user);

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
    this.targetUsernameSubscription.unsubscribe();
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
      receiver_user: this.targetUser,
      receiver_guid: this.formGroup.controls.username.value, // we can pass a username to the guid field
      reply_type: parseInt(this.formGroup.controls.responseType.value),
      twitter_required: false,
      payment_options: paymentOptions,
      terms_agreed: this.formGroup.controls.termsAccepted.value,
      refund_policy_agreed: this.formGroup.controls.refundPolicyAccepted.value,
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

  private setMinimumPaymentAmountFromUser(user: MindsUser | null): void {
    this.cashMin = user?.supermind_settings.min_cash;
    this.tokensMin = user?.supermind_settings.min_offchain_tokens;

    this.refreshCashMinAmountValidator();
    this.refreshTokensMinAmountValidator();
  }

  private cashMinAmountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.paymentMethod === SUPERMIND_PAYMENT_METHODS.CASH &&
        control.value < this.CashMin
      ) {
        return {
          cashMinAmountInvalid: true,
        };
      }
    };
  }

  private tokensMinAmountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.paymentMethod === SUPERMIND_PAYMENT_METHODS.TOKENS &&
        control.value < this.TokensMin
      ) {
        return {
          tokensMinAmountInvalid: true,
        };
      }
    };
  }

  private refreshCashMinAmountValidator(): void {
    this.formGroup.controls.offerUsd?.updateValueAndValidity({
      onlySelf: true,
    });
    this.formGroup.controls.offerUsd?.markAsDirty({ onlySelf: true });
  }

  private refreshTokensMinAmountValidator(): void {
    this.formGroup.controls.offerTokens?.updateValueAndValidity({
      onlySelf: true,
    });
    this.formGroup.controls.offerTokens?.markAsDirty({ onlySelf: true });
  }

  private merchantValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.targetUser?.merchant) {
        return {
          merchantInvalid: true,
        };
      }
    };
  }

  private latestMerchantValidator: ValidatorFn = null;
  private refreshMerchantValidator(): void {
    if (this.latestMerchantValidator !== null) {
      this.formGroup.controls.username?.removeValidators(
        this.latestMerchantValidator
      );
    }
    this.latestMerchantValidator = this.merchantValidator();
    this.formGroup.controls.username?.addValidators(
      this.latestMerchantValidator
    );

    this.formGroup.controls.username?.updateValueAndValidity({
      onlySelf: true,
    });
    this.formGroup.controls.username?.markAsDirty({ onlySelf: true });
    this.changeDetector.detectChanges();
  }
}
