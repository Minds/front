import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { MindsUser } from '../../../interfaces/entities';
import { ApiService } from '../../../common/api/api.service';
import {
  Wallet,
  WalletV2Service,
} from '../../wallet/components/wallet-v2.service';
import { WireService as WireV1Service, WireStruc } from '../wire.service';
import { UpgradeOptionInterval } from '../../../common/types/upgrade-options.types';
import { ConfigsService } from '../../../common/services/configs.service';
import { SupportTier } from './support-tiers.service';
import { Session } from '../../../services/session';
import { ToasterService } from '../../../common/services/toaster.service';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';
import { isSafari } from '../../../helpers/is-safari';
import { GiftCardService } from '../../gift-card/gift-card.service';
import { GiftCardProductIdEnum } from '../../../../graphql/generated.engine';

/**
 * Wire event types
 */
export enum WireEventType {
  Completed = 1,
  Cancelled,
}

/**
 * Wire event
 */
export interface WireEvent {
  type: WireEventType;
  payload?: any;
}

/**
 * Wire reward structure
 */
interface WireReward {
  id: string;
  amount: number;
  description: string;
}

const buildWireRewardEntries = (
  key: string,
  data: Array<any>
): Array<WireReward> =>
  (data || [])
    .map((entry) => ({
      id: `${key}:${entry.amount}`,
      amount: entry.amount,
      description: entry.description,
    }))
    .sort((a, b) => a.amount - b.amount);

/**
 * Wire rewards
 */
interface WireRewards {
  description: string;
  count: number;
  tokens: Array<WireReward>;
  usd: Array<WireReward>;
}

/**
 * Upgrade pricing structure
 *  */
export interface WireUpgradePricingOptions {
  monthly: number;
  yearly: number;
  lifetime: number;
}

export interface WireCurrencyOptions {
  tokens: boolean;
  usd: boolean;
  eth: boolean;
  btc: boolean;
}

const DEFAULT_CURRENCY_OPTIONS_VALUE: WireCurrencyOptions = {
  tokens: true,
  usd: false,
  eth: false,
  btc: false,
};

/**
 * Wire types
 */
export type WireType = 'tokens' | 'usd' | 'eth' | 'btc';

/**
 * Default type value
 */
const DEFAULT_TYPE_VALUE: WireType = 'tokens';

/**
 * Upgrade types
 */
export type WireUpgradeType = 'plus' | 'pro';

/**
 * Default upgrade type value
 */
const DEFAULT_UPGRADE_TYPE_VALUE: WireUpgradeType = 'plus';

/**
 * Default isUpgrade flag value
 */
const DEFAULT_IS_UPGRADE_VALUE: boolean = false;

/**
 * Default upgrade type value
 */
const DEFAULT_UPGRADE_INTERVAL_VALUE: UpgradeOptionInterval = 'yearly';

/**
 * Default empty upgrade pricing options
 * (to be populated from configs later)
 */
const DEFAULT_WIRE_UPGRADE_PRICING_OPTIONS: WireUpgradePricingOptions = {
  monthly: 0,
  yearly: 0,
  lifetime: 0,
};

/**
 * Wire token types
 */
export type WireTokenType = 'offchain' | 'onchain';

/**
 * Default token type value
 */
const DEFAULT_TOKEN_TYPE_VALUE: WireTokenType = 'offchain';

/**
 * Default amount value
 */
const DEFAULT_AMOUNT_VALUE: number = 1;

/**
 * Default recurring flag value
 */
const DEFAULT_RECURRING_VALUE: boolean = false;

/**
 * Default refund policy agreed value
 */
const DEFAULT_REFUND_POLICY_ACCEPTED_VALUE: boolean = false;

/**
 * Default empty wire rewards
 */
const DEFAULT_WIRE_REWARDS_VALUE: WireRewards = {
  description: '',
  count: 0,
  tokens: [],
  usd: [],
};

/**
 * Data payload. Must match definition below.
 * @see {DataArray}
 */
interface Data {
  entityGuid: string;
  type: WireType;
  supportTier: SupportTier;
  upgradeType: WireUpgradeType;
  isUpgrade: boolean;
  upgradeInterval: UpgradeOptionInterval;
  upgradePricingOptions: WireUpgradePricingOptions;
  tokenType: WireTokenType;
  amount: number;
  recurring: boolean;
  refundPolicyAgreed: boolean;
  owner: MindsUser | null;
  usdPaymentMethodId: string;
  wallet: Wallet;
  sourceEntityGuid: string;
  isSendingGift?: boolean;
  isSelfGift?: boolean;
  giftRecipientUsername?: string;
}

/**
 * Data payload as sorted array. Must match above definition.
 * @see {Data}
 */
type DataArray = [
  string,
  WireType,
  SupportTier,
  WireUpgradeType,
  boolean,
  UpgradeOptionInterval,
  WireUpgradePricingOptions,
  WireTokenType,
  number,
  boolean,
  boolean,
  MindsUser,
  string,
  Wallet,
  string | null,
  boolean | null,
  boolean | null,
  string | null,
];

/**
 * Data validation.
 */
interface DataValidation {
  isValid: boolean;
  isErrorVisible?: boolean;
  error?: string;
}

/**
 * Wire v2 service, using v1 Wire as low-level implementation
 */
@Injectable()
export class WireV2Service implements OnDestroy {
  /**
   * The entity that's going to receive the payment
   */
  readonly entityGuid$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  readonly sourceEntityGuid$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  /**
   * Wire type subject
   */
  readonly type$: BehaviorSubject<WireType> = new BehaviorSubject<WireType>(
    DEFAULT_TYPE_VALUE
  );

  readonly supportTier$: BehaviorSubject<SupportTier> =
    new BehaviorSubject<SupportTier>(null);

  /**
   * Wire upgrade type subject
   */
  readonly upgradeType$: BehaviorSubject<WireUpgradeType> =
    new BehaviorSubject<WireUpgradeType>(DEFAULT_UPGRADE_TYPE_VALUE);

  /**
   * Wire type subject
   */
  readonly isUpgrade$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    DEFAULT_IS_UPGRADE_VALUE
  );

  /**
   * True if wire modal is in gift giving mode.
   */
  public readonly isSendingGift$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * True if the modal is in gift receipt mode.
   */
  public readonly isReceivingGift$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Gift recipient username for when sending a gift.
   */
  public readonly giftRecipientUsername$: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  /**
   * True if sending a self gift (allowing the user to give the code out themselves).
   */
  public readonly isSelfGift$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Wire upgrade interval subject
   */
  readonly upgradeInterval$: BehaviorSubject<UpgradeOptionInterval> =
    new BehaviorSubject<UpgradeOptionInterval>(DEFAULT_UPGRADE_INTERVAL_VALUE);

  /**
   * Wire upgrade pricing options subject
   */
  readonly upgradePricingOptions$: BehaviorSubject<WireUpgradePricingOptions> =
    new BehaviorSubject<WireUpgradePricingOptions>(
      DEFAULT_WIRE_UPGRADE_PRICING_OPTIONS
    );

  /**
   * Wire upgrade trial observable
   */
  readonly upgradeCanHaveTrial$: Observable<boolean>;

  /**
   * Wire token type subject
   */
  readonly tokenType$: BehaviorSubject<WireTokenType> =
    new BehaviorSubject<WireTokenType>(DEFAULT_TOKEN_TYPE_VALUE);

  /**
   * Amount subject
   */
  readonly amount$: BehaviorSubject<number> = new BehaviorSubject<number>(
    DEFAULT_AMOUNT_VALUE
  );

  /**
   * Recurring flag subject
   */
  readonly recurring$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    DEFAULT_RECURRING_VALUE
  );

  /**
   * Refund policy agreed subject
   */
  readonly refundPolicyAgreed$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(DEFAULT_REFUND_POLICY_ACCEPTED_VALUE);

  /**
   * USD payload subject (card selector payment ID)
   */
  readonly usdPaymentMethodId$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  /**
   * User resolver that's going to asynchronously re-sync the reward tiers (state)
   */
  readonly ownerResolver$: BehaviorSubject<MindsUser | null> =
    new BehaviorSubject<MindsUser | null>(null);

  /**
   * User that's going to receive the payment (might be the same as the entity itself) (state)
   */
  readonly owner$: BehaviorSubject<MindsUser | null> =
    new BehaviorSubject<MindsUser | null>(null);

  /**
   * Wire Rewards (Shop support tiers)
   */
  readonly wireRewards$: BehaviorSubject<WireRewards> =
    new BehaviorSubject<WireRewards>(DEFAULT_WIRE_REWARDS_VALUE);

  /**
   * Sum of the accumulated Wires in the last 30 days, per currency
   */
  readonly sums$: BehaviorSubject<{
    [key: string]: string;
  }> = new BehaviorSubject<{ [key: string]: string }>({});

  /**
   * "In Progress" flag subject (state)
   */
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  protected readonly currencyOptions$: BehaviorSubject<WireCurrencyOptions> =
    new BehaviorSubject<WireCurrencyOptions>(DEFAULT_CURRENCY_OPTIONS_VALUE);

  /**
   * Validate data observable
   */
  readonly validation$: Observable<DataValidation>;

  /**
   * Wire payload observable
   */
  protected readonly wirePayload$: Observable<WireStruc>;

  /**
   * Wire payload snapshot
   */
  protected wirePayload: WireStruc;

  /**
   * Wire snapshot subscription
   */
  protected readonly wirePayloadSnapshotSubscription: Subscription;

  /**
   * Observer subscription that emits passed User, then refresh its rewards data
   */
  protected ownerResolverSubscription: Subscription;

  /**
   * Subscription to creating a gift card.
   */
  private createGiftCardSubscription: Subscription;

  /**
   * Prices for upgrades to Pro/Plus
   */
  upgrades: any; // readonly removed as component reydrates post authModal login

  handlers: any;

  userIsPlus: boolean;
  userIsPro: boolean;

  /**
   * Constructor. Initializes data payload observable subscription.
   * @param wallet
   * @param api
   * @param v1Wire
   */
  constructor(
    public wallet: WalletV2Service,
    protected api: ApiService,
    protected v1Wire: WireV1Service,
    private session: Session,
    configs: ConfigsService,
    private toasterService: ToasterService,
    private giftCardService: GiftCardService
  ) {
    this.upgrades = configs.get('upgrades');
    this.handlers = configs.get('handlers');

    const user = session.getLoggedInUser();
    this.userIsPlus = user && user.plus;
    this.userIsPro = user && user.pro;

    // Combine state
    const wireData$ = combineLatest([
      this.entityGuid$,
      this.type$,
      this.supportTier$,
      this.upgradeType$,
      this.isUpgrade$,
      this.upgradeInterval$,
      this.upgradePricingOptions$,
      this.tokenType$,
      this.amount$,
      this.recurring$,
      this.refundPolicyAgreed$,
      this.owner$.pipe(
        distinctUntilChanged(),
        tap((owner) => {
          // Reset the currency options when the owner obj changes
          this.currencyOptions$.next({
            tokens: true,
            usd: owner && owner.merchant && owner.merchant.id,
            eth: owner && !!owner.eth_wallet,
            btc: owner && !!owner.btc_address,
          });
        })
      ),
      this.usdPaymentMethodId$,
      this.wallet.wallet$,
      this.sourceEntityGuid$,
      this.isSendingGift$,
      this.isSelfGift$,
      this.giftRecipientUsername$,
    ]).pipe(
      map(
        ([
          entityGuid,
          type,
          supportTier,
          upgradeType,
          isUpgrade,
          upgradeInterval,
          upgradePricingOptions,
          tokenType,
          amount,
          recurring,
          refundPolicyAgreed,
          owner,
          usdPaymentMethodId,
          wallet,
          sourceEntityGuid,
          isSendingGift,
          isSelfGift,
          giftRecipientUsername,
        ]: DataArray): Data => ({
          entityGuid,
          type,
          supportTier,
          upgradeType,
          isUpgrade,
          upgradeInterval,
          upgradePricingOptions,
          tokenType,
          amount,
          recurring,
          refundPolicyAgreed,
          owner,
          usdPaymentMethodId,
          wallet,
          sourceEntityGuid,
          isSendingGift,
          isSelfGift,
          giftRecipientUsername,
        })
      )
    );

    // Wire payload observable
    this.wirePayload$ = wireData$.pipe(
      map((data: Data): WireStruc => this.buildWirePayload(data))
    );

    // Wire data validation
    this.validation$ = wireData$.pipe(
      map((data: Data): DataValidation => this.validate(data))
    );

    // Build Wire payload snapshot
    this.wirePayloadSnapshotSubscription = this.wirePayload$.subscribe(
      (wirePayload) => (this.wirePayload = wirePayload)
    );

    // Resolves the owner from the cached entity, then re-sync from the server and fetch the rewards sums
    this.ownerResolverSubscription = this.ownerResolver$.subscribe((owner) => {
      // Emit cached owner
      this.owner$.next(owner);

      if (owner && owner.guid) {
        // Re-sync owner and rewards

        this.api
          .get(`api/v1/wire/rewards/${owner.guid}`)
          .toPromise()
          .then(({ merchant, eth_wallet, wire_rewards, sums }) => {
            // TODO: Prone to race conditions and non-cancellable, find a better rxjs-ish way
            const currentOwnerValue = this.owner$.getValue();

            if (!currentOwnerValue || currentOwnerValue.guid !== owner.guid) {
              // Stale response, do nothing
              return;
            }

            // Update owner
            owner.merchant = merchant;
            owner.eth_wallet = eth_wallet;
            owner.wire_rewards = wire_rewards;

            // Update rewards
            const tokenRewards = buildWireRewardEntries(
              'tokens',
              wire_rewards.rewards.tokens
            );

            const usdRewards = buildWireRewardEntries(
              'usd',
              wire_rewards.rewards.money
            );

            this.wireRewards$.next({
              description: wire_rewards.description || '',
              count: tokenRewards.length + usdRewards.length,
              tokens: tokenRewards,
              usd: usdRewards,
            });

            // Emit
            this.owner$.next(owner);
            this.sums$.next(sums);
          });
      }
    });

    this.upgradeCanHaveTrial$ = combineLatest([
      this.upgradeType$,
      this.upgradeInterval$,
      this.type$,
      this.isUpgrade$,
      this.isSendingGift$,
      this.isReceivingGift$,
      this.usdPaymentMethodId$,
    ]).pipe(
      map(
        ([
          upgradeType,
          upgradeInterval,
          paymentType,
          isUpgrade,
          isSendingGift,
          isReceivingGift,
          usdPaymentMethodId,
        ]) => {
          return (
            !isReceivingGift &&
            !isSendingGift &&
            usdPaymentMethodId !== 'gift_card' &&
            isUpgrade &&
            this.upgrades[upgradeType][upgradeInterval].can_have_trial &&
            paymentType === 'usd'
          );
        }
      )
    );

    // Sync balances
    if (this.session.isLoggedIn()) {
      this.wallet.getTokenAccounts();
    }
  }

  /**
   * Destroy lifecycle hook
   */
  ngOnDestroy(): void {
    if (this.wirePayloadSnapshotSubscription) {
      this.wirePayloadSnapshotSubscription.unsubscribe();
    }

    if (this.ownerResolverSubscription) {
      this.ownerResolverSubscription.unsubscribe();
    }

    this.createGiftCardSubscription?.unsubscribe();
  }

  /**
   * Sets the entity and the owner of it
   * @param entity
   */
  setEntity(entity: any): WireV2Service {
    // Set the entity
    let guid: string = '';

    if (entity && entity.guid) {
      guid = entity.guid;
    } else if (entity && entity.entity_guid) {
      guid = entity.entity_guid;
    }

    // Set the owner
    let owner: MindsUser | null = null;

    if (entity && entity.type === 'user') {
      owner = { ...entity };
    } else if (entity && entity.ownerObj) {
      owner = { ...entity.ownerObj };
    }

    // Emit
    this.entityGuid$.next(guid);
    this.ownerResolver$.next(owner);

    return this;
  }

  public setSourceEntity(sourceEntity: any): WireV2Service {
    this.sourceEntityGuid$.next(
      sourceEntity.guid ?? sourceEntity.entityGuid ?? ''
    );
    return this;
  }

  /**
   * Sets the Wire type
   * @param type
   */
  setType(type: WireType): WireV2Service {
    this.type$.next(type);

    if (!this.canRecur(type, this.tokenType$.getValue())) {
      this.recurring$.next(false);
    }

    if (this.isUpgrade$.value) {
      if (type === 'tokens') {
        this.setUpgradeInterval('lifetime');
      } else if (type === 'usd') {
        this.setUpgradeInterval('yearly');
      }
    }
    this.setUpgradePricingOptions(type, this.upgradeType$.getValue());

    return this;
  }

  /**
   * Sets whether the wire is paying for a channel upgrade
   * and assumes the upgrade is recurring only if interval is yearly/monthly
   * @param isUpgrade
   */
  setIsUpgrade(isUpgrade: boolean): WireV2Service {
    this.isUpgrade$.next(isUpgrade);
    if (
      this.upgradeInterval$.value === 'yearly' ||
      this.upgradeInterval$.value === 'monthly'
    ) {
      this.recurring$.next(true);
    } else {
      this.recurring$.next(false);
    }

    return this;
  }

  /**
   * Sets the upgrade type
   * @param upgradeType
   */
  setUpgradeType(upgradeType: WireUpgradeType): WireV2Service {
    this.upgradeType$.next(upgradeType);
    this.setUpgradePricingOptions(this.type$.value, upgradeType);
    return this;
  }

  /**
   * Sets the upgrade time interval
   * @param upgradeInterval
   */
  setUpgradeInterval(upgradeInterval: UpgradeOptionInterval): WireV2Service {
    // Update the amount when the interval changes
    let upgradePrice =
      this.upgrades[this.upgradeType$.value][upgradeInterval][this.type$.value];
    if (upgradeInterval === 'yearly') {
      upgradePrice = upgradePrice;
    }

    this.setAmount(upgradePrice);

    this.upgradeInterval$.next(upgradeInterval);
    return this;
  }

  /**
   * Sets the upgrade pricing options for the selected
   * upgrade type and currency
   */
  setUpgradePricingOptions(
    type: WireType,
    upgradeType: WireUpgradeType
  ): WireV2Service {
    // Tokens can only be used on lifetime subscriptions
    if (
      this.type$.value === 'tokens' &&
      this.upgradeInterval$.value !== 'lifetime'
    ) {
      this.upgradeInterval$.next('lifetime');
    }

    // If it's an upgrade, calculate the pricing options
    // for the selected currency
    let upgradePricingOptions;

    if (this.isUpgrade$.value) {
      upgradePricingOptions = {
        monthly: this.upgrades[upgradeType]['monthly'][type],
        yearly: this.upgrades[upgradeType]['yearly'][type],
        lifetime: this.upgrades[upgradeType]['lifetime'][type],
      };
      this.upgradePricingOptions$.next(upgradePricingOptions);

      // Update the amount when anything changes
      let upgradePrice =
        this.upgrades[this.upgradeType$.value][this.upgradeInterval$.value][
          this.type$.value
        ];
      if (this.upgradeInterval$.value === 'yearly') {
        upgradePrice = upgradePrice;
      }

      this.setAmount(upgradePrice);
    }

    return this;
  }

  /**
   * Sets the Wire token type
   * @param tokenType
   */
  setTokenType(tokenType: WireTokenType): WireV2Service {
    this.tokenType$.next(tokenType);

    if (!this.canRecur(this.type$.getValue(), tokenType)) {
      this.recurring$.next(false);
    }

    return this;
  }

  /**
   * Sets the Wire amount
   * @param amount
   */
  setAmount(amount: number): WireV2Service {
    this.amount$.next(amount);
    return this;
  }

  /**
   * Sets the Wire recurring flag
   * @param recurring
   */
  setRecurring(recurring: boolean): WireV2Service {
    const canRecur =
      this.canRecur(this.type$.getValue(), this.tokenType$.getValue()) ||
      this.isUpgrade$.getValue();

    this.recurring$.next(canRecur && recurring);
    return this;
  }

  /**
   * Sets gifting mode.
   * @param { boolean } isSendingGift - true if this transaction is to be a gift.
   * @returns { WireV2Service }
   */
  setIsSendingGift(isSendingGift: boolean): WireV2Service {
    this.isSendingGift$.next(isSendingGift);
    return this;
  }

  /**
   * Sets whether a gift is a self gift.
   * @param { boolean } isSelfGift whether this is a self gift.
   * @returns { WireV2Service }
   */
  setIsSelfGift(isSelfGift: boolean): WireV2Service {
    if (isSelfGift) {
      this.giftRecipientUsername$.next(null);
    }
    this.isSelfGift$.next(isSelfGift);
    return this;
  }

  /**
   * Sets username of a gift recipient.
   * @param { string } giftRecipientUsername - username of a gift recipient.
   * @returns { WireV2Service }
   */
  setGiftRecipientUsername(giftRecipientUsername: string): WireV2Service {
    if (giftRecipientUsername?.length) {
      this.isSelfGift$.next(false);
    }
    this.giftRecipientUsername$.next(giftRecipientUsername);
    return this;
  }

  /**
   * Sets whether the modal is in gift receipt mode.
   * @param { boolean } isReceivingGift whether the modal is in gift receipt mode.
   * @returns { WireV2Service }
   */
  setIsReceivingGift(isReceivingGift: boolean): WireV2Service {
    this.isReceivingGift$.next(isReceivingGift);
    return this;
  }

  /**
   * Sets the refund policy agreed flag
   * @param refundPolicyAgreed
   */
  setRefundPolicyAgreed(agreed: boolean): WireV2Service {
    this.refundPolicyAgreed$.next(agreed);
    return this;
  }

  /**
   * Sets the "In Progress" flag
   * @param inProgress
   */
  setInProgress(inProgress: boolean): WireV2Service {
    this.inProgress$.next(inProgress);
    return this;
  }

  /**
   * Sets the USD payload data
   * @param paymentMethodId
   */
  setUsdPaymentMethodId(paymentMethodId: string): WireV2Service {
    this.usdPaymentMethodId$.next(paymentMethodId);
    return this;
  }

  /**
   * Reset the behaviors to its original subjects
   */
  reset(): WireV2Service {
    // Data
    this.setType(DEFAULT_TYPE_VALUE);
    this.setTokenType(DEFAULT_TOKEN_TYPE_VALUE);
    this.setAmount(DEFAULT_AMOUNT_VALUE);
    this.setRecurring(DEFAULT_RECURRING_VALUE);
    this.setRefundPolicyAgreed(DEFAULT_REFUND_POLICY_ACCEPTED_VALUE);
    this.setIsReceivingGift(false);
    this.setIsSendingGift(false);
    this.setIsSelfGift(false);
    this.setGiftRecipientUsername(null);

    // State
    this.setInProgress(false);

    //
    return this;
  }

  /**
   * Checks if a Wire type can have a recurring subscription
   * @param type
   * @param tokenType
   */
  canRecur(type: WireType, tokenType: WireTokenType): boolean {
    return (type === 'tokens' && tokenType === 'offchain') || type === 'usd';
  }

  /**
   * Validates the data
   * @param data
   */
  protected validate(data: Data): DataValidation {
    const valid = (): DataValidation => ({ isValid: true });

    const invalid = (error?: string, isErrorVisible?: boolean) => ({
      isValid: false,
      error,
      isErrorVisible,
    });

    if (!data || !data.entityGuid) {
      return invalid();
    }

    if (data.isSendingGift) {
      if (!data.giftRecipientUsername && !data.isSelfGift) {
        return invalid(
          'You must select a gift recipient for non-self gifts',
          false
        );
      }

      if (data.isSelfGift && data.giftRecipientUsername) {
        return invalid('Self gifts cannot have recipient usernames', false);
      }

      if (!data.isUpgrade) {
        return invalid('Only upgrades can be gifted', true);
      }

      if (data.type !== 'usd') {
        return invalid('Gifts can only be paid for with cash', true);
      }

      if (data.recurring) {
        return invalid('Gifts cannot be recurring', true);
      }
    }

    if (
      this.supportTier$.getValue() &&
      this.supportTier$.getValue().subscription_urn
    ) {
      return invalid('You are already a member', true);
    }

    if (data.amount <= 0) {
      return invalid('Amount should be greater than zero', false);
    }

    if (!this.refundPolicyAgreed$.getValue()) {
      return invalid('You must agree to the refund policy');
    }

    const username = data.owner ? `@${data.owner.username}` : 'This channel';

    switch (data.type) {
      case 'tokens':
      case 'eth':
        if (data.type === 'tokens' && data.tokenType === 'offchain') {
          // Off-chain
          const isUpgrade =
            data.entityGuid === this.handlers.pro ||
            data.entityGuid === this.handlers.plus;

          // Purchases of plus/pro are exempt from wire limits
          const amountExceedsLimit =
            !isUpgrade && data.amount > data.wallet.limits.wire;

          if (data.wallet.loaded && amountExceedsLimit) {
            return invalid(
              `Cannot spend more than ${data.wallet.limits.wire} tokens today`,
              true
            );
          } else if (
            data.wallet.loaded &&
            data.amount > data.wallet.offchain.balance
          ) {
            return invalid(
              `Cannot spend more than ${data.wallet.offchain.balance} tokens`,
              true
            );
          }
        } else {
          if (isMobileOrTablet()) {
            return invalid(
              'Onchain payment is not currently possible on mobile devices',
              true
            );
          }

          if (isSafari()) {
            return invalid(
              'Onchain payment is not currently possible with Safari',
              true
            );
          }

          // On-chain & Eth
          if (!data.owner || !data.owner.eth_wallet) {
            return invalid(
              `${username} has not configured their Ethereum wallet yet`,
              true
            );
          }
        }
        break;

      case 'usd':
        if (!data.owner || !data.owner.merchant || !data.owner.merchant.id) {
          return invalid(
            `${username} is not able to receive USD at the moment`,
            true
          );
        }
        break;

      case 'btc':
        if (!data.owner || !data.owner.btc_address) {
          return invalid(
            `${username} has not configured their Bitcoin address yet`,
            true
          );
        }
        break;
    }

    return valid();
  }

  /**
   * Builds the Wire payload, suit for v1 Wire service
   * @param data
   */
  protected buildWirePayload(data: Data): WireStruc {
    const wire: Partial<WireStruc> = {
      guid: data.entityGuid,
      amount: data.amount,
      recurring: Boolean(
        this.canRecur(data.type, data.tokenType) && data.recurring
      ),
      sourceEntityGuid: data.sourceEntityGuid,
    };

    switch (data.type) {
      case 'tokens':
        wire.payloadType = data.tokenType;

        if (data.tokenType === 'offchain') {
          wire.payload = {};
        } else if (data.tokenType === 'onchain') {
          wire.payload = {
            receiver: data.owner && data.owner.eth_wallet,
            address: '',
          };
        }
        break;

      case 'usd':
        wire.payloadType = 'usd';
        wire.payload = {
          paymentMethodId: data.usdPaymentMethodId,
        };
        break;

      case 'eth':
        wire.payloadType = 'eth';
        wire.payload = {
          receiver: data.owner && data.owner.eth_wallet,
          address: '',
        };
        break;

      case 'btc':
        wire.payloadType = 'btc';
        wire.payload = {
          receiver: data.owner && data.owner.btc_address,
        };
        break;
    }

    if (data.isUpgrade && data.upgradeInterval) {
      wire.recurringInterval = data.upgradeInterval;
    }

    return wire as WireStruc;
  }

  /**
   * Submits the Wire
   */
  async submit(): Promise<any> {
    if (!this.wirePayload) {
      throw new Error(`There's nothing to send`);
    }

    if (this.isSendingGift$.getValue()) {
      return firstValueFrom(this.sendGiftCard());
    }

    this.inProgress$.next(true);

    console.log(this.usdPaymentMethodId$.getValue());

    // Gift cards currently cannot be recurring payments.
    if (this.usdPaymentMethodId$.getValue() === 'gift_card') {
      this.wirePayload.recurring = false;
    }

    try {
      const response = await this.v1Wire.submitWire(this.wirePayload);
      this.inProgress$.next(false);

      return response;
    } catch (e) {
      this.inProgress$.next(false);
      // Re-throw
      throw e;
    }
  }

  /**
   * Send a gift card.
   * @returns { Observable<boolean> } true on success.
   */
  private sendGiftCard(): Observable<boolean> {
    this.inProgress$.next(true);

    return combineLatest([this.upgradeType$, this.giftRecipientUsername$]).pipe(
      take(1),
      switchMap(
        ([upgradeType, giftRecipientUsername]: [
          WireUpgradeType,
          string,
        ]): Observable<string> => {
          let productId: GiftCardProductIdEnum;
          switch (upgradeType) {
            case 'plus':
              productId = GiftCardProductIdEnum.Plus;
              break;
            case 'pro':
              productId = GiftCardProductIdEnum.Pro;
              break;
          }

          return this.giftCardService.createGiftCard(
            productId,
            Number(this.wirePayload.amount),
            this.wirePayload.payload.paymentMethodId,
            { targetUsername: giftRecipientUsername }
          );
        }
      ),
      map((result: string): boolean => Boolean(result)),
      tap((result: boolean): void => {
        if (result) {
          const upgradeInterval: UpgradeOptionInterval =
            this.upgradeInterval$.getValue();
          switch (this.upgradeType$.getValue()) {
            case 'pro':
              if (upgradeInterval === 'yearly') {
                this.toasterService.success(
                  'Payment Successful! You have gifted 1 year of Minds Pro'
                );
                break;
              }
              this.toasterService.success(
                'Payment Successful! You have gifted 1 month of Minds Pro'
              );
              break;
            case 'plus':
              if (upgradeInterval === 'yearly') {
                this.toasterService.success(
                  'Payment Successful! You have gifted 1 year of Minds+'
                );
                break;
              }
              this.toasterService.success(
                'Payment Successful! You have gifted 1 month of Minds+'
              );
              break;
          }
        }
      }),
      catchError((e: any): Observable<boolean> => {
        console.error(e);
        this.toasterService.error(e?.message);
        return of(false);
      }),
      finalize(() => {
        this.inProgress$.next(false);
      })
    );
  }

  /**
   * Gets gift card product ID applicable to the current upgrade type.
   * If no matching upgrade type is found, will return null.
   * @returns { GiftCardProductIdEnum } applicable gift card product id.
   */
  public getApplicableGiftCardProductId(): GiftCardProductIdEnum {
    if (!this.isUpgrade$.getValue()) {
      return null;
    }
    switch (this.upgradeType$.getValue()) {
      case 'plus':
        return GiftCardProductIdEnum.Plus;
      case 'pro':
        return GiftCardProductIdEnum.Pro;
      default:
        null;
    }
  }
}
