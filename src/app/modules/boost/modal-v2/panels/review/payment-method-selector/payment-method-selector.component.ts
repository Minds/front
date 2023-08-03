import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  shareReplay,
  Subscription,
  take,
} from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { ThemeService } from '../../../../../../common/services/theme.service';
import { TokenBalanceService } from '../../../../../wallet/tokens/onboarding/balance.service';
import {
  BoostPaymentCategory,
  BoostPaymentMethod,
  BoostPaymentMethodId,
} from '../../../boost-modal-v2.types';
import { BoostModalV2Service } from '../../../services/boost-modal-v2.service';
import { GiftCardProductIdEnum } from '../../../../../../../graphql/generated.engine';

/**
 * Payment method selector component (offchain / onchain / cash etc).
 */
@Component({
  selector: 'm-boostModalV2__paymentMethodSelector',
  template: `
    <select
      *ngIf="(paymentCategory$ | async) === BoostPaymentCategory.TOKENS"
      class="m-boostModalPayments__optionSelect"
      [ngModel]="paymentMethod$ | async"
      (ngModelChange)="paymentMethod$.next($event)"
      [ngStyle]="selectBackground$ | async"
      data-ref="boost-modal-v2-token-payment-select"
    >
      <option
        [value]="BoostPaymentMethod.OFFCHAIN_TOKENS"
        data-ref="boost-modal-v2-token-payment-select-offchain-option"
      >
        Off-chain ({{ offchainBalance$ | async }} Tokens)
      </option>
      <option
        [value]="BoostPaymentMethod.ONCHAIN_TOKENS"
        data-ref="boost-modal-v2-token-payment-select-onchain-option"
      >
        On-chain ({{ onchainBalance$ | async }} Tokens)
      </option>
    </select>
    <m-payments__selectCard
      *ngIf="(paymentCategory$ | async) === BoostPaymentCategory.CASH"
      [selected]="paymentMethodId$ | async"
      (selected)="onSelectCard($event)"
      [paymentTotal]="totalPaymentAmount$ | async"
      [giftCardProductIdEnum]="GiftCardProductIdEnum.Boost"
      data-ref="boost-modal-v2-cash-payment-custom-selector"
    ></m-payments__selectCard>
  `,
  styleUrls: ['./payment-method-selector.component.ng.scss'],
})
export class BoostModalV2PaymentMethodSelectorComponent
  implements OnInit, OnDestroy {
  // enums.
  public BoostPaymentMethod: typeof BoostPaymentMethod = BoostPaymentMethod;
  public BoostPaymentCategory: typeof BoostPaymentCategory = BoostPaymentCategory;

  // cdn url
  private readonly cdnAssetsUrl: string;

  // Currently active tab.
  public paymentCategory$: BehaviorSubject<BoostPaymentCategory> = this.service
    .paymentCategory$;

  public dailyBid$: BehaviorSubject<number> = this.service.dailyBudget$;
  public bidDuration$: BehaviorSubject<number> = this.service.duration$;

  // Users onchain balance - must be fetched from service before it holds a value.
  public onchainBalance$: BehaviorSubject<number> = this.tokenBalance.onchain$;

  // Users offchain balance - must be fetched from service before it holds a value.
  public offchainBalance$: BehaviorSubject<number> = this.tokenBalance
    .offchain$;

  // Token payment method from service.
  public readonly paymentMethod$: BehaviorSubject<BoostPaymentMethod> = this
    .service.paymentMethod$;

  // Token payment method id from service.
  public readonly paymentMethodId$: BehaviorSubject<BoostPaymentMethodId> = this
    .service.paymentMethodId$;

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
  private paymentMethodInitSubscription: Subscription;
  public totalPaymentAmount$: Observable<
    number
  > = this.service.totalPaymentAmount$?.pipe(shareReplay());

  constructor(
    private service: BoostModalV2Service,
    private tokenBalance: TokenBalanceService,
    private theme: ThemeService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    // Load token balance on active tab switch to 'tokens'.
    this.balanceLoadSubscription = this.paymentCategory$
      .pipe(
        filter(
          (paymentCategory: BoostPaymentCategory) =>
            paymentCategory === BoostPaymentCategory.TOKENS
        ),
        switchMap(_ => this.tokenBalance.fetch())
      )
      .subscribe();

    // if payment category is tokens, init payment method to offchain_tokens so that select box has a default value.
    this.paymentMethodInitSubscription = this.paymentCategory$.subscribe(
      (paymentCategory: BoostPaymentCategory) => {
        if (paymentCategory === BoostPaymentCategory.TOKENS) {
          this.paymentMethod$.next(BoostPaymentMethod.OFFCHAIN_TOKENS);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.paymentMethodInitSubscription?.unsubscribe();
    this.balanceLoadSubscription?.unsubscribe();
  }

  /**
   * On card select.
   * @param { string } value - card id.
   * @returns { void }
   */
  public onSelectCard(value: string): void {
    this.paymentMethod$.next(BoostPaymentMethod.CASH);
    this.paymentMethodId$.next(value);
  }

  protected readonly GiftCardProductIdEnum = GiftCardProductIdEnum;
}
