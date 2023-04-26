import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { BoostContractService } from '../../blockchain/contracts/boost-contract.service';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import toFriendlyCryptoVal from '../../../helpers/friendly-crypto';
import {
  BalanceResponse,
  BoostableEntity,
  BoostActivityPostResponse,
  BoostImpressionRates,
  BoostPayload,
  BoostSubject,
  BoostTab,
  BoostTokenPaymentMethod,
  PayloadPaymentMethod,
  PrepareResponse,
} from './boost-modal.types';
import { ConfigsService } from '../../../common/services/configs.service';

export const MAXIMUM_SINGLE_BOOST_IMPRESSIONS = 5000;
export const MINIMUM_SINGLE_BOOST_IMPRESSIONS = 500;
export const MINIMUM_BOOST_CURRENCY_AMOUNT = 1;
export const DEFAULT_ACTIVE_TAB = 'cash';
export const DEFAULT_TOKEN_PAYMENT_METHOD = 'offchain';
export const DEFAULT_IMPRESSIONS = MAXIMUM_SINGLE_BOOST_IMPRESSIONS / 2;
export const DEFAULT_CURRENCY_AMOUNT = DEFAULT_IMPRESSIONS / 1000;
export const DEFAULT_ENTITY = { guid: '' };
export const DEFAULT_TARGET_USER = null;
export const DEFAULT_BALANCE = 0;
export const DEFAULT_BOOST_IMPRESSION_RATES = {
  cash: 1000,
  tokens: 1000,
};

/**
 * Main service for boost modal. Handles logic involved in boost preparation and submission.
 */
@Injectable({ providedIn: 'root' })
export class BoostModalService implements OnDestroy {
  // Impression rate for boosts - holds amount of impressions per major currency unit (usd / token) for all currencies.
  public readonly impressionRates$: BehaviorSubject<
    BoostImpressionRates
  > = new BehaviorSubject<BoostImpressionRates>(null);

  // Active boost tab.
  public readonly activeTab$: BehaviorSubject<BoostTab> = new BehaviorSubject<
    BoostTab
  >(DEFAULT_ACTIVE_TAB);

  // Token payment method, onchain or offchain.
  public readonly tokenPaymentMethod$: BehaviorSubject<
    BoostTokenPaymentMethod
  > = new BehaviorSubject<BoostTokenPaymentMethod>(
    DEFAULT_TOKEN_PAYMENT_METHOD
  );

  // Cash payment method id - reference to the card that the user wants to use to boost.
  public readonly cashPaymentMethod$: BehaviorSubject<
    string
  > = new BehaviorSubject<string>(null);

  // Target impressions of the boost.
  public readonly impressions$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(DEFAULT_IMPRESSIONS);

  // Currency value in tokens or USD.
  public readonly currencyAmount$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(DEFAULT_CURRENCY_AMOUNT);

  // Entity being boosted.
  public readonly entity$: BehaviorSubject<
    BoostableEntity
  > = new BehaviorSubject<BoostableEntity>(DEFAULT_ENTITY);

  // Users onchain balance. Populated via fetchBalance.
  public readonly onchainBalance$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(DEFAULT_BALANCE);

  // Users offchain balance. Populated via fetchBalance.
  public readonly offchainBalance$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(DEFAULT_BALANCE);

  // Is the subject a post or a channel
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

  // Cash boosts must select checkbox
  public readonly cashRefundPolicy$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  // Disable the ability to boost
  get disabled$(): Observable<boolean> {
    return combineLatest([
      this.activeTab$,
      this.tokenPaymentMethod$,
      this.impressions$,
      this.onchainBalance$,
      this.offchainBalance$,
      this.impressionRates$,
      this.entity$,
    ]).pipe(
      map(
        ([
          activeTab,
          tokenPaymentMethod,
          impressions,
          onchainBalance,
          offchainBalance,
          impressionRates,
          entity,
        ]: [
          BoostTab,
          BoostTokenPaymentMethod,
          number,
          number,
          number,
          BoostImpressionRates,
          BoostableEntity
        ]) => {
          // disabled if scheduled post
          if (this.isScheduled(entity)) {
            return true;
          }

          if (!this.hasValidImpressions(impressions)) {
            return true;
          }

          if (activeTab === 'tokens') {
            // set balance depending on payment method.
            const balance =
              tokenPaymentMethod === 'onchain'
                ? onchainBalance
                : offchainBalance;

            // if user has funds.
            if (
              !this.hasTokenBoostFunds(
                impressions,
                balance,
                impressionRates['tokens']
              )
            ) {
              return true;
            }

            return false;
          }

          return false;
        }
      )
    );
  }

  constructor(
    private api: ApiService,
    private toast: ToasterService,
    private web3Wallet: Web3WalletService,
    private boostContract: BoostContractService,
    private configs: ConfigsService
  ) {
    this.setImpressionRates();
  }

  ngOnDestroy(): void {
    this.reset();
  }

  /**
   * Populates service level offchain and onchain balances, and returns observable
   * containing response data from server.
   * @returns { Observable<BalanceResponse> } - response data from server.
   */
  public fetchTokenBalance(): Observable<BalanceResponse> {
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

    if (this.activeTab$.getValue() === 'cash') {
      const payload = await this.assembleCashBoostPayload(prepared);
      return this.postBoostActivity(payload).toPromise();
    }

    const payload = await this.assembleTokenBoostPayload(prepared);
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
   * Builds the payload for token boosts.
   * @param { PreparedResponse } preparedResponse - prepared response from boost/prepare endpoint.
   * @returns { Promise<BoostPayload> } - Assembled payload to be sent to server.
   */
  private async assembleTokenBoostPayload(
    preparedResponse: PrepareResponse
  ): Promise<BoostPayload> {
    const tokenPaymentMethod = this.tokenPaymentMethod$.getValue();
    const impressions = this.impressions$.getValue();

    let response: BoostPayload = {
      guid: preparedResponse.guid,
      bidType: 'tokens',
      impressions: impressions,
      checksum: preparedResponse.checksum,
    };

    if (tokenPaymentMethod === 'offchain') {
      return {
        ...response,
        paymentMethod: {
          method: 'offchain',
          address: 'offchain',
        },
      };
    }

    if (tokenPaymentMethod === 'onchain') {
      return {
        ...response,
        paymentMethod: {
          ...(await this.getOnchainPaymentMethod(
            preparedResponse.guid,
            this.currencyAmount$.getValue(),
            preparedResponse.checksum
          )),
        },
      };
    }
  }

  private async assembleCashBoostPayload(
    preparedResponse: PrepareResponse
  ): Promise<BoostPayload> {
    return {
      guid: preparedResponse.guid,
      bidType: 'cash',
      impressions: this.impressions$.getValue(),
      checksum: preparedResponse.checksum,
      paymentMethod: {
        method: 'cash',
        payment_method_id: this.cashPaymentMethod$.getValue(),
      },
    };
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
    currencyAmount: number,
    checksum: string
  ): Promise<PayloadPaymentMethod> {
    if (!this.web3Wallet.checkDeviceIsSupported()) {
      throw new Error('Currently not supported on this device.');
    }

    if (this.web3Wallet.isUnavailable()) {
      throw new Error('No Ethereum wallets available on your browser.');
    }

    if (!(await this.web3Wallet.unlock())) {
      throw new Error(
        'Your Ethereum wallet is locked or connected to another network.'
      );
    }

    return {
      method: 'onchain',
      txHash: await this.boostContract.create(guid, currencyAmount, checksum),
      address: await this.web3Wallet.getCurrentWallet(true),
    };
  }

  private handleError(e): Observable<null> {
    console.error(e);
    this.toast.error(e.error?.message ?? e);
    return of(null);
  }

  /**
   * True if user has enough tokens.
   * @param { number } impressions - amount of impressions to boost for.
   * @param { number } balance - balance of users wallet.
   * @param { number } rate - token rate.
   * @returns { boolean } true if user has enough tokens.
   */
  private hasTokenBoostFunds(
    impressions: number,
    balance: number,
    rate: number
  ): boolean {
    let tokenCost = impressions / rate;
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
   * Returns true if entity is scheduled.
   * @param { BoostableEntity } entity - entity to check
   * @returns { boolean } - true if entity is scheduled.
   */
  private isScheduled(entity: BoostableEntity): boolean {
    return Number(entity.time_created) * 1000 > Date.now();
  }

  /**
   * Set impression rates from config.
   * @returns { void }
   */
  private setImpressionRates(): void {
    this.impressionRates$.next(
      this.configs.get<BoostImpressionRates>('boost_rates') ??
        DEFAULT_BOOST_IMPRESSION_RATES
    );
  }

  /**
   * Resets local state to default values.
   * @returns { void }
   */
  public reset(): void {
    this.tokenPaymentMethod$.next(DEFAULT_TOKEN_PAYMENT_METHOD);
    this.cashPaymentMethod$.next(null);
    this.impressions$.next(DEFAULT_IMPRESSIONS);
    this.currencyAmount$.next(DEFAULT_CURRENCY_AMOUNT);
    this.entity$.next(DEFAULT_ENTITY);
    this.onchainBalance$.next(DEFAULT_BALANCE);
    this.offchainBalance$.next(DEFAULT_BALANCE);
    this.activeTab$.next(DEFAULT_ACTIVE_TAB);
    this.cashRefundPolicy$.next(false);
  }
}
