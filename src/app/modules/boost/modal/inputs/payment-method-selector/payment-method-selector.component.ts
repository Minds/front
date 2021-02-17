import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ThemeService } from '../../../../../common/services/theme.service';
import toFriendlyCryptoVal from '../../../../../helpers/friendly-crypto';
import {
  BalanceResponse,
  BoostModalService,
  BoostPaymentMethod,
} from '../../boost-modal.service';

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
      <span
        class="m-boostModalPayments__buyTokens"
        i18n="@@BOOST_MODAL__BUY_TOKENS"
        >Buy tokens</span
      >
    </div>
    <select
      class="m-boostModalPayments__optionSelect"
      [ngModel]="paymentMethod$ | async"
      [ngStyle]="selectBackground$ | async"
    >
      <option value="onchain">
        On-chain ({{ onchainBalance$ | async }} Tokens)
      </option>
      <option value="onchain">
        Off-chain ({{ offchainBalance$ | async }} Tokens)
      </option>
    </select>
  `,
  styleUrls: ['./payment-method-selector.component.ng.scss'],
})
export class BoostModalPaymentMethodSelectorComponent implements OnInit {
  onchainBalance$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  offchainBalance$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private service: BoostModalService,
    private theme: ThemeService
  ) {}

  get balance$() {
    return;
  }

  ngOnInit(): void {
    this.service.getBalance().subscribe((response: BalanceResponse) => {
      const addresses = response.addresses;

      for (let address of addresses) {
        if (address.address === 'offchain') {
          this.offchainBalance$.next(toFriendlyCryptoVal(address.balance));
        }
        if (address.address.startsWith('0x')) {
          this.onchainBalance$.next(toFriendlyCryptoVal(address.balance));
        }
      }
    });
  }

  get paymentMethod$(): BehaviorSubject<BoostPaymentMethod> {
    return this.service.paymentMethod$;
  }

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

  public onSelected(): void {
    // TODO: Output?
    // TODO: Add balance to dropdown
  }
}
