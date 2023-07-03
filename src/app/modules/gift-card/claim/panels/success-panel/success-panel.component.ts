import { Component, OnDestroy, OnInit } from '@angular/core';
import { GiftCardClaimPanelService } from '../panel.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  combineLatest,
  map,
  of,
  take,
} from 'rxjs';
import {
  GiftCardBalanceByProductId,
  GiftCardProductIdEnum,
} from '../../../../../../graphql/generated.engine';
import { GiftCardService } from '../../../gift-card.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { Router } from '@angular/router';

/**
 * Panel shown on success of a gift card claim.
 */
@Component({
  selector: 'm-giftCardClaimPanel__success',
  templateUrl: 'success-panel.component.html',
  styleUrls: ['./success-panel.component.ng.scss'],
})
export class GiftCardClaimSuccessPanelComponent implements OnInit, OnDestroy {
  /** Updated user balance for product specified in panel service. */
  public readonly balance$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);

  /** Product credit name - as displayed in template. */
  public readonly productCreditName$: Observable<
    string
  > = this.giftCardPanel.productId$.pipe(
    map((productId: GiftCardProductIdEnum): string => {
      switch (productId) {
        case GiftCardProductIdEnum.Boost:
          return $localize`:@@GIFT_CARD_SUCCESS_PANEL__BOOST_CREDITS:Boost Credits`;
        default:
          return $localize`:@@GIFT_CARD_SUCCESS_PANEL__GENERIC_CREDITS:Credits`;
      }
    })
  );

  /** Text within action button, varies depending on product ID */
  public readonly actionButtonText$: Observable<
    string
  > = this.giftCardPanel.productId$.pipe(
    map((productId: GiftCardProductIdEnum): string => {
      switch (productId) {
        case GiftCardProductIdEnum.Boost:
          return $localize`:@@GIFT_CARD_SUCCESS_PANEL__CREATE_A_BOOST:Create a Boost`;
        default:
          return $localize`:@@GIFT_CARD_SUCCESS_PANEL__VIEW_YOUR_BALANCES:View your balances`;
      }
    })
  );

  // subscriptions.
  private actionButtonClickSubscription: Subscription;
  private getGiftCardBalancesSubscription: Subscription;

  constructor(
    private service: GiftCardService,
    private giftCardPanel: GiftCardClaimPanelService,
    private router: Router,
    private toast: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadBalances();
  }

  ngOnDestroy(): void {
    this.getGiftCardBalancesSubscription?.unsubscribe();
    this.actionButtonClickSubscription?.unsubscribe();
  }

  /**
   * On action button click handle appropriate action for product id.
   * @returns { void }
   */
  public onActionButtonClick(): void {
    this.actionButtonClickSubscription = this.giftCardPanel.productId$.subscribe(
      (productId: GiftCardProductIdEnum): void => {
        switch (productId) {
          case GiftCardProductIdEnum.Boost:
            this.router.navigate(['/boost/boost-console']);
            break;
          default:
            this.router.navigate([this.getViewBalanceUrl()]);
        }
      }
    );
  }

  /**
   * Get view balance URL.
   * TODO: minds#4142 Update with gift-card balance page when available.
   * @returns { string } view balance URL.
   */
  public getViewBalanceUrl(): string {
    return '/wallet';
  }

  /**
   * Load balances for product specified in panel service,
   * store it in local balance$ subject.
   * @returns { void }
   */
  private loadBalances(): void {
    this.getGiftCardBalancesSubscription = combineLatest([
      this.service.getGiftCardBalances(),
      this.giftCardPanel.productId$,
    ])
      .pipe(
        take(1),
        catchError(
          (e: unknown): Observable<unknown[]> => {
            console.error(e);
            return of([]);
          }
        )
      )
      .subscribe(
        ([giftCardBalances = [], productId = null]: [
          GiftCardBalanceByProductId[],
          GiftCardProductIdEnum
        ]) => {
          try {
            if (!giftCardBalances?.length || !productId) {
              throw new Error('Gift card balances or productId missing');
            }

            const balance: GiftCardBalanceByProductId = giftCardBalances.filter(
              (balance: GiftCardBalanceByProductId): boolean => {
                return balance.productId === productId;
              }
            )?.[0];

            if (balance) {
              this.balance$.next(balance?.balance);
            }

            throw new Error('Unable to load gift card balance.');
          } catch (e) {
            console.error(e);
            this.toast.warn('Unable to load gift card balance.');
            return;
          }
        }
      );
  }
}
