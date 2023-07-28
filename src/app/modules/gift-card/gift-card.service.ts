import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import {
  ClaimGiftCardGQL,
  ClaimGiftCardMutation,
  GetGiftCardBalancesGQL,
  GetGiftCardBalancesQuery,
  GetGiftCardBalancesWithExpiryDataGQL,
  GetGiftCardBalancesWithExpiryDataQuery,
  GetGiftCardByCodeGQL,
  GetGiftCardByCodeQuery,
  GiftCardBalanceByProductId,
  GiftCardNode,
  GiftCardProductIdEnum,
} from '../../../graphql/generated.engine';
import { QueryOptionsAlone } from 'apollo-angular/types';

/**
 * Service for the retrieval and claiming of gift cards.
 */
@Injectable({ providedIn: 'root' })
export class GiftCardService {
  constructor(
    private getGiftCardByCodeGQL: GetGiftCardByCodeGQL,
    private getGiftCardBalancesGQL: GetGiftCardBalancesGQL,
    private getGiftCardBalancesWithExpiryDataGQL: GetGiftCardBalancesWithExpiryDataGQL,
    private claimGiftCardGQL: ClaimGiftCardGQL
  ) {}

  /**
   * Get a gift card by its claim code.
   * @param { string } claimCode - claim code to get by.
   * @returns { Observable<GiftCardNode> } - gift card node or null if one was not found.
   */
  public getGiftCardByCode(claimCode: string): Observable<GiftCardNode> {
    return this.getGiftCardByCodeGQL.fetch({ claimCode: claimCode }).pipe(
      map(
        (result: ApolloQueryResult<GetGiftCardByCodeQuery>): GiftCardNode => {
          const giftCard: GiftCardNode = result?.data
            ?.giftCardByClaimCode as GiftCardNode;
          if (!giftCard) {
            return null;
          }
          return giftCard;
        }
      )
    );
  }

  /**
   * Get the users gift card balances.
   * @returns { Observable<GiftCardBalanceByProductId[]> } - the users various gift card balances.
   */
  public getGiftCardBalances(): Observable<GiftCardBalanceByProductId[]> {
    return this.getGiftCardBalancesGQL.fetch().pipe(
      map(
        (
          result: ApolloQueryResult<GetGiftCardBalancesQuery>
        ): GiftCardBalanceByProductId[] => {
          return result?.data?.giftCardsBalances;
        }
      )
    );
  }

  /**
   * Get the users gift card balances with data on the first expiring gift card for each product.
   * @returns { Observable<GiftCardBalanceByProductId[]> } - gift card balances for each product.
   */
  public getGiftCardBalancesWithExpiryData(
    queryOpts: QueryOptionsAlone = null
  ): Observable<GiftCardBalanceByProductId[]> {
    return this.getGiftCardBalancesWithExpiryDataGQL
      .fetch(null, queryOpts)
      .pipe(
        map(
          (
            result: ApolloQueryResult<GetGiftCardBalancesWithExpiryDataQuery>
          ): GiftCardBalanceByProductId[] => {
            return result?.data
              ?.giftCardsBalances as GiftCardBalanceByProductId[];
          }
        )
      );
  }

  /**
   * Claims a gift card, consuming the given claim code.
   * @param { string } claimCode - claim code to claim.
   * @returns { Observable<GiftCardNode> } - gift card node or null if the operation was not fully successful.
   */
  public claimGiftCard(claimCode: string): Observable<GiftCardNode> {
    return this.claimGiftCardGQL.mutate({ claimCode: claimCode }).pipe(
      map(
        (result: ApolloQueryResult<ClaimGiftCardMutation>): GiftCardNode => {
          const giftCard: GiftCardNode = result?.data
            ?.claimGiftCard as GiftCardNode;
          if (!giftCard) {
            return null;
          }
          return giftCard;
        }
      )
    );
  }

  /**
   * Gets product name by product id.
   * @param { GiftCardProductIdEnum } productId - product id to get name for.
   * @param { boolean } plural - whether to return name in plural form.
   * @returns { string } name of product from enum for UI consumption.
   */
  public getProductNameByProductId(
    productId: GiftCardProductIdEnum,
    plural: boolean = true
  ): string {
    switch (productId) {
      case GiftCardProductIdEnum.Boost:
        if (plural) {
          return $localize`:@@GIFT_CARD__BOOST_CREDITS_TEXT:Boost Credits`;
        }
        return $localize`:@@GIFT_CARD__BOOST_CREDIT_TEXT:Boost Credit`;
      case GiftCardProductIdEnum.Plus:
        if (plural) {
          return $localize`:@@GIFT_CARD__PLUS_CREDITS_TEXT:Minds+ Credits`;
        }
        return $localize`:@@GIFT_CARD__PLUS_CREDIT_TEXT:Minds+ Credit`;
      case GiftCardProductIdEnum.Pro:
        if (plural) {
          return $localize`:@@GIFT_CARD__PRO_CREDITS_TEXT:Pro Credits`;
        }
        return $localize`:@@GIFT_CARD__PRO_CREDIT_TEXT:Pro Credit`;
      case GiftCardProductIdEnum.Supermind:
        if (plural) {
          return $localize`:@@GIFT_CARD__SUPERMIND_CREDITS_TEXT:Supermind Credits`;
        }
        return $localize`:@@GIFT_CARD__SUPERMIND_CREDIT_TEXT:Supermind Credit`;
      default:
        console.error('Unknown product id handled: ', productId);
        if (plural) {
          return $localize`:@@GIFT_CARD__OTHER_CREDITS_TEXT:Other Credits`;
        }
        return $localize`:@@GIFT_CARD__OTHER_CREDIT_TEXT:Other Credit`;
    }
  }
}
