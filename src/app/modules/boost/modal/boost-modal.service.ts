import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { BoostContractService } from '../../blockchain/contracts/boost-contract.service';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { MindsUser } from '../../../interfaces/entities';

import * as BN from 'bn.js';
import toFriendlyCryptoVal from '../../../helpers/friendly-crypto';

// TODO: Source from server.
export const MAXIMUM_SINGLE_BOOST_IMPRESSIONS = 5000;

// TODO: Source from server.
export const MINIMUM_SINGLE_BOOST_IMPRESSIONS = 500;

export const MINIMUM_BOOST_OFFER_TOKENS = 1;

export const DEFAULT_BOOST_RATE = 1000;
export const DEFAULT_ACTIVE_TAB = 'newsfeed';
export const DEFAULT_PAYMENT_METHOD = 'offchain';
export const DEFAULT_IMPRESSIONS = MAXIMUM_SINGLE_BOOST_IMPRESSIONS / 2;
export const DEFAULT_TOKENS = DEFAULT_IMPRESSIONS / 1000;
export const DEFAULT_ENTITY = { guid: '' };
export const DEFAULT_TARGET_USER = null;
export const DEFAULT_BALANCE = 0;

/**
 * Subject of the boost, a channel or post.
 */
export type BoostSubject = 'channel' | 'post' | 'blog' | '';

/**
 * Selected tab, newsfeed or offer.
 */
export type BoostTab = 'newsfeed' | 'offer';

/**
 * Selected payment method, onchain or offchain.
 */
export type BoostPaymentMethod = 'onchain' | 'offchain';

/**
 * Target user used for offers.
 */
export type TargetUser = MindsUser | null;

/**
 * Boost wallet.
 */
export type BoostWallet = {
  balance: string;
  address: string;
  label: string;
  ether_balance?: string;
  available?: string;
};

/**
 * Entity that is boostable.
 */
export type BoostableEntity = {
  guid?: string;
  type?: string;
  subtype?: string;
  owner_guid?: string;
  time_created?: number | string;
};

/**
 * Balance endpoint response.
 */
export type BalanceResponse = {
  status?: string;
  addresses?: BoostWallet[];
  balance?: string;
  wireCap?: string;
  boostCap?: string;
  testnetBalance?: string;
};

/**
 * Boost prepare endpoint response.
 */
export type PrepareResponse = {
  status?: string;
  guid?: string;
  checksum?: string;
};

/**
 * Boost activity post response.
 */
export type BoostActivityPostResponse = {
  status?: string;
};

/**
 * POST Boost payload.
 */
export type BoostPayload = {
  bidType?: string;
  checksum?: string;
  guid?: string;
  impressions?: number;
  paymentMethod?: PayloadPaymentMethod;
};

/**
 * Payment method for boost payload.
 */
export type PayloadPaymentMethod = {
  method?: string;
  address?: string | false;
  txHash?: string | false;
};

/**
 * Peer boost payload (offers).
 */
export type PeerBoostPayload = {
  bid: string; // tokens
  checksum: string;
  currency: string; // e.g. "tokens"
  destination: string; // offer target guid
  guid: string; // entity guid
  paymentMethod?: PayloadPaymentMethod;
};

/**
 * Post response for peer boosts (boost offers)
 */
export type PeerBoostPostResponse = {
  status: string;
  boost_guid: string;
};

/**
 * Main service for boost modal. Handles logic involved in boost preparation and submission.
 */
@Injectable({ providedIn: 'root' })
export class BoostModalService implements OnDestroy {
  // TODO: Get rate dynamically from server.
  public readonly rate$: BehaviorSubject<number> = new BehaviorSubject<number>(
    DEFAULT_BOOST_RATE
  );

  /**
   * Active boost tab.
   */
  public readonly activeTab$: BehaviorSubject<BoostTab> = new BehaviorSubject<
    BoostTab
  >(DEFAULT_ACTIVE_TAB);

  /**
   * Payment method, onchain or offchain.
   */
  public readonly paymentMethod$: BehaviorSubject<
    BoostPaymentMethod
  > = new BehaviorSubject<BoostPaymentMethod>(DEFAULT_PAYMENT_METHOD);

  /**
   * Target impressions of the boost.
   */
  public readonly impressions$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(DEFAULT_IMPRESSIONS);

  /**
   * Value of tokens.
   */
  public readonly tokens$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(DEFAULT_TOKENS);

  /**
   * Entity being boosted.
   */
  public readonly entity$: BehaviorSubject<
    BoostableEntity
  > = new BehaviorSubject<BoostableEntity>(DEFAULT_ENTITY);

  /**
   * Target user for boost offers.
   */
  public targetUser$: BehaviorSubject<TargetUser> = new BehaviorSubject<
    TargetUser
  >(DEFAULT_TARGET_USER);

  /**
   * Users onchain balance. Populated via fetchBalance.
   */
  public readonly onchainBalance$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(DEFAULT_BALANCE);

  /**
   * Users offchain balance. Populated via fetchBalance.
   */
  public readonly offchainBalance$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(DEFAULT_BALANCE);

  /**
   * Is the subject a post or a channel
   */
  get entityType$(): Observable<BoostSubject> {
    return this.entity$.pipe(
      map(entity => {
        if (entity.type === 'object' || entity.subtype === 'blog') {
          return 'blog';
        }

        if (entity.type === 'user') {
          return 'channel';
        }
        return 'post';
      })
    );
  }

  /**
   * Disable the ability to boost?
   */
  get disabled$(): Observable<boolean> {
    // combine latest values of all relevant observables
    return combineLatest([
      /**
       * Workaround for typescript imposed limit
       * of 8 params in combineLatest.
       */
      combineLatest([
        this.activeTab$,
        this.paymentMethod$,
        this.impressions$,
        this.tokens$,
        this.targetUser$,
      ]),
      combineLatest([
        this.onchainBalance$,
        this.offchainBalance$,
        this.rate$,
        this.entity$,
      ]),
    ]).pipe(
      map(
        ([
          [activeTab, paymentMethod, impressions, tokens, targetUser],
          [onchainBalance, offchainBalance, rate, entity],
        ]) => {
          // disabled if scheduled post
          if (this.isScheduled(entity)) {
            return true;
          }

          // set balance depending on payment method.
          const balance =
            paymentMethod === 'onchain' ? onchainBalance : offchainBalance;

          // check impressions are within max and min bounds.
          if (activeTab === 'newsfeed') {
            if (!this.hasValidImpressions(impressions)) {
              return true;
            }

            // if user has funds.
            if (!this.hasBoostFunds(impressions, balance, rate)) {
              return true;
            }

            return false;
          }
          // is an offer
          if (!this.hasValidBid(tokens)) {
            return true;
          }

          // if user has funds.
          if (!this.hasOfferFunds(tokens, balance)) {
            return true;
          }

          // if tab is offer, we need to make sure there is a target user.
          if (!targetUser) {
            return true;
          }

          return false;
        }
      )
    );
  }

  constructor(
    private api: ApiService,
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
    private boostContract: BoostContractService
  ) {}

  ngOnDestroy(): void {
    this.reset();
  }

  /**
   * Populates service level offchain and onchain balances, and returns observable
   * containing response data from server.
   * @returns { Observable<BalanceResponse> } - response data from server.
   */
  public fetchBalance(): Observable<BalanceResponse> {
    return this.api.get('api/v2/blockchain/wallet/balance').pipe(
      take(1),
      map(response => {
        const addresses = response.addresses;

        for (let address of addresses) {
          if (address.address === 'offchain') {
            this.offchainBalance$.next(toFriendlyCryptoVal(address.balance));
          }
          if (address.address.startsWith('0x')) {
            this.onchainBalance$.next(toFriendlyCryptoVal(address.balance));
          }
        }
        return response;
      }),
      catchError(e => this.handleError(e))
    );
  }

  /**
   * Submit a boost async - avoiding complicated switchMap chains for readability.
   * @returns { Promise<BoostActivityPostResponse> } - response from server.
   */
  public async submitBoostAsync(): Promise<BoostActivityPostResponse> {
    // await checksum generation from server.
    const prepared = await this.prepareBoostPayload().toPromise();

    // if not on the newsfeed tab, this is a peer boost / boost offer.
    if (this.activeTab$.getValue() === 'offer') {
      const payload = await this.assemblePeerBoostPayload(prepared);
      return this.postPeerBoost(payload).toPromise();
    }

    // else its a direct newsfeed boost.
    const payload = await this.assembleDirectBoostPayload(prepared);
    return this.postBoostActivity(payload).toPromise();
  }

  /**
   * Prepares the payload to be sent to the server for a boost.
   * @returns { Observable<PrepareResponse> } payload to pass to server.
   */
  private prepareBoostPayload(): Observable<PrepareResponse> {
    return this.entity$.pipe(
      take(1),
      switchMap(entity => this.api.get(`api/v2/boost/prepare/${entity.guid}`)),
      catchError(e => this.handleError(e))
    );
  }

  /**
   * Makes POST request for boost.
   * @param { BoostPayload } payload - a valid payload.
   * @returns { Observable<BoostActivityPostResponse> } - response from server.
   */
  private postBoostActivity(
    payload: BoostPayload
  ): Observable<BoostActivityPostResponse> {
    return this.entity$.pipe(
      take(1),
      switchMap(entity => {
        const ownerGuid =
          entity.type === 'user' ? entity.guid : entity.owner_guid;
        return this.api.post(
          `api/v2/boost/${entity.type}/${entity.guid}/${ownerGuid}`,
          payload
        );
      }),
      catchError(e => this.handleError(e))
    );
  }

  /**
   * Makes POST request for a peer boost (boost offer).
   * @param { BoostPayload } payload - a valid payload.
   * @returns { ApiResponse } -response from server.
   */
  private postPeerBoost(payload: PeerBoostPayload): Observable<ApiResponse> {
    return this.entity$.pipe(
      take(1),
      switchMap(entity => {
        return this.api.post(
          `api/v2/boost/peer/${entity.guid}/${entity.owner_guid}`,
          payload
        );
      }),
      catchError(e => this.handleError(e))
    );
  }

  /**
   * Builds the payload for direct boosts.
   * @param { PreparedResponse } preparedResponse - prepared response from boost/prepare endpoint.
   * @returns { Promise<BoostPayload> } - Assembled payload to be sent to server.
   */
  private async assembleDirectBoostPayload(
    preparedResponse: PrepareResponse
  ): Promise<BoostPayload> {
    const paymentMethod = this.paymentMethod$.getValue();
    const impressions = this.impressions$.getValue();

    let response: BoostPayload = {
      guid: preparedResponse.guid,
      bidType: 'tokens',
      impressions: impressions,
      checksum: preparedResponse.checksum,
    };

    if (paymentMethod === 'offchain') {
      return {
        ...response,
        paymentMethod: {
          method: 'offchain',
          address: 'offchain',
        },
      };
    }

    if (paymentMethod === 'onchain') {
      return {
        ...response,
        paymentMethod: {
          ...(await this.getOnchainPaymentMethod(
            preparedResponse.guid,
            impressions,
            preparedResponse.checksum
          )),
        },
      };
    }
  }

  /**
   * Builds the payload for peer boosts (boost offers).
   * @param { PreparedResponse } preparedResponse - prepared response from boost/prepare endpoint.
   * @returns { Promise<PeerBoostPayload> } - Assembled payload to be sent to server.
   */
  private async assemblePeerBoostPayload(
    preparedResponse
  ): Promise<PeerBoostPayload> {
    const paymentMethod = this.paymentMethod$.getValue();
    const tokens = this.tokens$.getValue();

    let response = {
      guid: preparedResponse.guid,
      bid: this.getBid(tokens),
      currency: 'tokens',
      checksum: preparedResponse.checksum,
      destination: this.targetUser$.getValue().guid,
    };

    if (paymentMethod === 'offchain') {
      return {
        ...response,
        paymentMethod: {
          method: 'offchain',
          address: 'offchain',
        },
      };
    }

    if (paymentMethod === 'onchain') {
      return {
        ...response,
        paymentMethod: {
          ...(await this.getOnchainPaymentMethod(
            preparedResponse.guid,
            tokens,
            preparedResponse.checksum
          )),
        },
      };
    }
  }

  /**
   * Get onchain paymentMethod object for payload.
   * will trigger web3 wallet popups such as the WalletConnect modal
   * and await a users response.
   * @param { string } guid - the guid of the boost.
   * @param { number } impressions - amount of impressions.
   * @param { string } checksum - the prepared checksum from server.
   */
  private async getOnchainPaymentMethod(
    guid: string,
    tokens: number,
    checksum: string
  ): Promise<PayloadPaymentMethod> {
    if (!this.web3Wallet.checkDeviceIsSupported()) {
      throw new Error('Currently not supported on this device.');
    }
    const rate = this.rate$.getValue();
    if (this.web3Wallet.isUnavailable()) {
      throw new Error('No Ethereum wallets available on your browser.');
    }

    if (!(await this.web3Wallet.unlock())) {
      throw new Error(
        'Your Ethereum wallet is locked or connected to another network.'
      );
    }

    let amount = tokens;
    if (this.activeTab$.getValue() !== 'offer') {
      const tokensFixRate = this.rate$.getValue() / 10000;
      amount = Math.ceil(<number>tokens / tokensFixRate) / 10000;
    }

    return {
      method: 'onchain',
      txHash: await this.boostContract.create(guid, amount, checksum),
      address: await this.web3Wallet.getCurrentWallet(true),
    };
  }

  /**
   * Convert tokens to bid amount.
   * @param { number } amount - amount of tokens.
   * @returns { string } bid amount.
   */
  private getBid(amount: number): string {
    const tokenDec = new BN(10).pow(new BN(18));
    return new BN(amount || 0).mul(tokenDec).toString();
  }

  private handleError(e): Observable<null> {
    console.error(e);
    this.toast.error(e.error?.message ?? e);
    return of(null);
  }

  /**
   * True if user has enough funds.
   * @param { number } impressions - amount of impressions to boost for.
   * @param { number } balance - balance of users wallet.
   * @param { number } rate - token rate.
   * @returns { boolean } true if user has funds.
   */
  private hasBoostFunds(
    impressions: number,
    balance: number,
    rate: number
  ): boolean {
    let tokenCost = impressions / rate;
    return balance >= tokenCost;
  }

  /**
   * True if user has enough funds.
   * @param { number } tokenCost - amount of tokens.
   * @param { number } balance - balance of users wallet.
   * @returns { boolean } true if user has funds.
   */
  private hasOfferFunds(tokenCost: number, balance: number): boolean {
    return balance >= tokenCost;
  }

  /**
   * True is user is between the min and max impressions thresholds.
   * @param { number } impressions - amount of impressions
   * @returns { boolean } true if users impressions are above the minimum and below the maximum amount.
   */
  private hasValidImpressions(impressions: number): boolean {
    return (
      impressions <= MAXIMUM_SINGLE_BOOST_IMPRESSIONS &&
      impressions >= MINIMUM_SINGLE_BOOST_IMPRESSIONS
    );
  }

  /**
   * True is user is above the min offered tokens thresholds.
   * @param { number } tokens - amount of tokens
   * @returns { boolean } true if users impressions are above the minimum and below the maximum amount.
   */
  private hasValidBid(tokens: number): boolean {
    return tokens >= MINIMUM_BOOST_OFFER_TOKENS;
  }

  /**
   * Returns true if entity is scheduled.
   * @param { BoostableEntity } entity - entity to check
   * @returns { boolean } - true if entity is scheduled.
   */
  private isScheduled(entity: BoostableEntity): boolean {
    return Number(entity.time_created) * 1000 > Date.now();
  }

  /**
   * Resets local state to default values.
   * @returns { void }
   */
  public reset(): void {
    this.rate$.next(DEFAULT_BOOST_RATE);
    this.activeTab$.next(DEFAULT_ACTIVE_TAB);
    this.paymentMethod$.next(DEFAULT_PAYMENT_METHOD);
    this.impressions$.next(DEFAULT_IMPRESSIONS);
    this.tokens$.next(DEFAULT_TOKENS);
    this.entity$.next(DEFAULT_ENTITY);
    this.targetUser$.next(DEFAULT_TARGET_USER);
    this.onchainBalance$.next(DEFAULT_BALANCE);
    this.offchainBalance$.next(DEFAULT_BALANCE);
  }
}
