import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import {
  ClaimGiftCardGQL,
  ClaimGiftCardMutation,
  GetGiftCardBalancesGQL,
  GetGiftCardBalancesQuery,
  GetGiftCardByCodeGQL,
  GetGiftCardByCodeQuery,
  GiftCardBalanceByProductId,
  GiftCardNode,
} from '../../../graphql/generated.engine';

/**
 * Service for the retrieval and claiming of gift cards.
 */
@Injectable({ providedIn: 'root' })
export class GiftCardService {
  constructor(
    private getGiftCardByCodeGQL: GetGiftCardByCodeGQL,
    private getGiftCardBalancesGQL: GetGiftCardBalancesGQL,
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
}
