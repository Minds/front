import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { ThemeService } from '../../../../../common/services/theme.service';
import { BoostModalService } from '../../boost-modal.service';
import { BoostTab, BoostTokenPaymentMethod } from '../../boost-modal.types';

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
          data-ref="boost-modal-buy-tokens-link"
          >Buy tokens</span
        >
      </a>
    </div>
    <select
      *ngIf="(activeTab$ | async) === 'tokens'"
      class="m-boostModalPayments__optionSelect"
      [ngModel]="tokenPaymentMethod$ | async"
      (ngModelChange)="tokenPaymentMethod$.next($event)"
      [ngStyle]="selectBackground$ | async"
      data-ref="boost-modal-token-payment-select"
    >
      <option value="onchain">
        On-chain ({{ onchainBalance$ | async }} Tokens)
      </option>
      <option value="offchain">
        Off-chain ({{ offchainBalance$ | async }} Tokens)
      </option>
    </select>
    <m-payments__selectCard
      *ngIf="(activeTab$ | async) === 'cash'"
      [selected]="cashPaymentMethod$ | async"
      (selected)="cashPaymentMethod$.next($event)"
      data-ref="boost-modal-cash-payment-custom-selector"
    ></m-payments__selectCard>
  `,
  styleUrls: ['./payment-method-selector.component.ng.scss'],
})
export class BoostModalPaymentMethodSelectorComponent
  implements OnInit, OnDestroy {
  // cdn url
  private readonly cdnAssetsUrl: string;

  // Currently active tab.
  public activeTab$: BehaviorSubject<BoostTab> = this.service.activeTab$;

  // Users onchain balance - must be fetched from service before it holds a value.
  public onchainBalance$: BehaviorSubject<number> = this.service
    .onchainBalance$;

  // Users offchain balance - must be fetched from service before it holds a value.
  public offchainBalance$: BehaviorSubject<number> = this.service
    .offchainBalance$;

  // Token payment method from service.
  public tokenPaymentMethod$: BehaviorSubject<BoostTokenPaymentMethod> = this
    .service.tokenPaymentMethod$;

  // Cash payment method from service. Will hold the ID of a card to be used.
  public cashPaymentMethod$: BehaviorSubject<string> = this.service
    .cashPaymentMethod$;

  // Background of select dropdown to add a stylable dropdown icon based on theme.
  public selectBackground$: Observable<{
    background: string;
  }> = this.theme.isDark$.pipe(
    map(isDark => {
      return {
        background: `url('${this.cdnAssetsUrl}assets/icons/arrow-drop-down-${
          isDark ? 'white' : 'black'
        }.svg') 98% center no-repeat`,
      };
    })
  );

  // subscription to load balance when active tab changes to tokens.
  private balanceLoadSubscription: Subscription;

  constructor(
    private service: BoostModalService,
    private theme: ThemeService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    // Load token balance on active tab switch to 'tokens'.
    this.balanceLoadSubscription = this.activeTab$
      .pipe(
        filter((activeTab: BoostTab) => activeTab === 'tokens'),
        switchMap(_ => this.service.fetchTokenBalance())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.balanceLoadSubscription?.unsubscribe();
  }
}
