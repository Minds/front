import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThemeService } from '../../../../../common/services/theme.service';
import {
  BoostModalService,
  BoostPaymentMethod,
} from '../../boost-modal.service';

/**
 * Payment method selector component (offchain / onchain etc).
 */
@Component({
  selector: 'm-boostModal__paymentMethodSelector',
  template: `
    <div class="m-boostModalPayments__header">
      <h2
        class="m-boostModalPayments__title"
        i18n="@@BOOST_MODAL__PAYMENT_METHOD"
      >
        Payment Method
      </h2>
      <a href="/token" target="_blank">
        <span
          class="m-boostModalPayments__buyTokens"
          i18n="@@BOOST_MODAL__BUY_TOKENS"
          >Buy tokens</span
        >
      </a>
    </div>
    <select
      class="m-boostModalPayments__optionSelect"
      [ngModel]="paymentMethod$ | async"
      (ngModelChange)="paymentMethod$.next($event)"
      [ngStyle]="selectBackground$ | async"
      data-cy="data-minds-boost-modal-method-select"
    >
      <option value="onchain">
        On-chain ({{ onchainBalance$ | async }} Tokens)
      </option>
      <option value="offchain">
        Off-chain ({{ offchainBalance$ | async }} Tokens)
      </option>
    </select>
  `,
  styleUrls: ['./payment-method-selector.component.ng.scss'],
})
export class BoostModalPaymentMethodSelectorComponent implements OnInit {
  constructor(
    private service: BoostModalService,
    private theme: ThemeService
  ) {}

  async ngOnInit(): Promise<void> {
    // avoid having to pull in subscription OnDestroy hook.
    await this.service.fetchBalance().toPromise();
  }

  /**
   * Users onchain balance - must be fetched from service before it holds a value.
   * @returns { BehaviorSubject<number> } Users onchain balance.
   */
  get onchainBalance$(): BehaviorSubject<number> {
    return this.service.onchainBalance$;
  }

  /**
   * Users offchain balance - must be fetched from service before it holds a value.
   * @returns { BehaviorSubject<number> } Users offchain balance.
   */
  get offchainBalance$(): BehaviorSubject<number> {
    return this.service.offchainBalance$;
  }

  /**
   * Payment method from service.
   * @returns { BehaviorSubject<BoostPaymentMethod> } - payment method.
   */
  get paymentMethod$(): BehaviorSubject<BoostPaymentMethod> {
    return this.service.paymentMethod$;
  }

  /**
   * Sets background of select dropdown to add a stylable dropdown icon based on theme.
   * @returns { Observable<{ background: string }> } Style for select element.
   */
  get selectBackground$(): Observable<{ background: string }> {
    return this.theme.isDark$.pipe(
      map(isDark => {
        return isDark
          ? {
              background:
                "url('/assets/icons/arrow-drop-down-white.svg') 98% center no-repeat",
            }
          : {
              background:
                "url('/assets/icons/arrow-drop-down-black.svg') 98% center no-repeat",
            };
      })
    );
  }
}
