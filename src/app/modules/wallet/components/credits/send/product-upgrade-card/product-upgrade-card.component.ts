import { Component, HostBinding, Inject, Input } from '@angular/core';
import { GiftCardProductIdEnum } from '../../../../../../../graphql/generated.engine';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import {
  ProductUpgradeCardPricingTier,
  ProductUpgradeCardPricingTiers,
  ProductUpgradeCardProductBenefit,
  ProductUpgradeCardProductBenefits,
  GiftCardUpgradesConfig,
} from './product-upgrade-card.types';
import { WireCreatorComponent } from '../../../../../wire/v2/creator/wire-creator.component';
import { ModalService } from '../../../../../../services/ux/modal.service';
import { WirePaymentHandlersService } from '../../../../../wire/wire-payment-handlers.service';
import { CDN_ASSETS_URL } from '../../../../../../common/injection-tokens/url-injection-tokens';
import { MindsUser } from '../../../../../../interfaces/entities';

/**
 * Product upgrade card for gifts - presents various benefits for given gift types
 * and provides a button to allow the user to access the gifting upgrade flow.
 */
@Component({
  selector: 'm-walletV2__creditsProductUpgradeCard',
  templateUrl: './product-upgrade-card.component.html',
  styleUrls: ['./product-upgrade-card.component.ng.scss'],
})
export class WalletV2CreditsProductUpgradeCardComponent {
  /** Product id enum for access in template */
  public readonly GiftCardProductIdEnum: typeof GiftCardProductIdEnum =
    GiftCardProductIdEnum;

  /** Gift type */
  @Input() public readonly giftType: GiftCardProductIdEnum;

  @HostBinding('class.m-productUpgradeCard--plus')
  private get isPlus(): boolean {
    return this.giftType === GiftCardProductIdEnum.Plus;
  }

  @HostBinding('class.m-productUpgradeCard--pro')
  private get isPro(): boolean {
    return this.giftType === GiftCardProductIdEnum.Pro;
  }

  /** Benefits of a specific upgrade type, for consumption in template. */
  private readonly benefits: ProductUpgradeCardProductBenefits = {
    [GiftCardProductIdEnum.Plus]: [
      {
        iconName: 'trending_up',
        text: $localize`:@@PRODUCT_UPGRADE_CARD__GET_REACH:Get more reach and engagement`,
      },
      {
        iconName: 'tips_and_updates',
        text: $localize`:@@PRODUCT_UPGRADE_CARD__PARTICIPATE_IN_SUPERMIND_CHALLENGES:Participate in exclusive Supermind challenges`,
      },
      {
        iconName: 'visibility_off',
        text: $localize`:@@PRODUCT_UPGRADE_CARD__HIDE_BOOSTS_AND_PERKS:Hide Boosted content, and other experience perks`,
      },
    ],
    [GiftCardProductIdEnum.Pro]: [
      {
        iconPath: 'assets/icons/binoculars.svg',
        text: $localize`:@@PRODUCT_UPGRADE_CARD__ALL_MINDS_PLUS_BENEFITS:All the benefits of Minds+`,
      },

      {
        iconName: 'trending_up',
        text: $localize`:@@PRODUCT_UPGRADE_CARD__GET_MORE_FREE_REACH:Get $50 /month (or $480 /year) in free Boost credits`,
      },
    ],
  };

  /** DIfferent pricing tiers for upgrades. */
  public readonly pricingTiers: ProductUpgradeCardPricingTiers;

  constructor(
    private readonly modalService: ModalService,
    private readonly wirePaymentHandlers: WirePaymentHandlersService,
    readonly config: ConfigsService,
    @Inject(CDN_ASSETS_URL) public readonly cdnAssetsUrl
  ) {
    const upgradesConfig: GiftCardUpgradesConfig =
      config.get<GiftCardUpgradesConfig>('upgrades');

    this.pricingTiers = {
      [GiftCardProductIdEnum.Plus]: [
        {
          amountText: '$' + upgradesConfig.plus.monthly.usd,
          period: 'month',
        },
        {
          amountText: '$' + upgradesConfig.plus.yearly.usd,
          period: 'year',
        },
      ],
      [GiftCardProductIdEnum.Pro]: [
        {
          amountText: '$' + upgradesConfig.pro.monthly.usd,
          period: 'month',
        },
        {
          amountText: '$' + upgradesConfig.pro.yearly.usd,
          period: 'year',
        },
      ],
    };
  }

  /**
   * Gets title of card for this gift type.
   * @returns { string } title of card.
   */
  public getTitle(): string {
    switch (this.giftType) {
      case GiftCardProductIdEnum.Plus:
        return 'Minds+';
      case GiftCardProductIdEnum.Pro:
        return 'Minds Pro';
      default:
        throw new Error('Unsupported gift type: ' + this.giftType);
    }
  }

  /**
   * Gets pricing tiers for this gift type.
   * @returns { ProductUpgradeCardPricingTier[] } pricing tiers for this gift type.
   */
  public getPricingTiers(): ProductUpgradeCardPricingTier[] {
    switch (this.giftType) {
      case GiftCardProductIdEnum.Plus:
        return this.pricingTiers.PLUS;
      case GiftCardProductIdEnum.Pro:
        return this.pricingTiers.PRO;
      default:
        throw new Error('Unsupported gift type: ' + this.giftType);
    }
  }

  /**
   * Gets benefits for this gift type.
   * @returns { ProductUpgradeCardProductBenefit[] } benefits for this gift type.
   */
  public getBenefits(): ProductUpgradeCardProductBenefit[] {
    switch (this.giftType) {
      case GiftCardProductIdEnum.Plus:
        return this.benefits.PLUS;
      case GiftCardProductIdEnum.Pro:
        return this.benefits.PRO;
      default:
        throw new Error('Unsupported gift type: ' + this.giftType);
    }
  }

  /**
   * Gets button text for this gift type.
   * @returns { string } button text for this gift type.
   */
  public getButtonText(): string {
    switch (this.giftType) {
      case GiftCardProductIdEnum.Plus:
        return 'Gift Minds+';
      case GiftCardProductIdEnum.Pro:
        return 'Gift Pro';
      default:
        throw new Error('Unsupported gift type: ' + this.giftType);
    }
  }

  /**
   * On action button click, open upgrade modal.
   * @returns { Promise<void> }
   */
  public async onActionButtonClick(): Promise<void> {
    let entity: MindsUser;
    let upgradeType: 'plus' | 'pro';

    switch (this.giftType) {
      case GiftCardProductIdEnum.Plus:
        entity = await this.wirePaymentHandlers.get('plus');
        upgradeType = 'plus';
        break;
      case GiftCardProductIdEnum.Pro:
        entity = await this.wirePaymentHandlers.get('pro');
        upgradeType = 'pro';
        break;
      default:
        throw new Error('Unsupported gift type: ' + this.giftType);
    }

    const modal = this.modalService.present(WireCreatorComponent, {
      size: 'lg',
      data: {
        isSendingGift: true,
        entity: entity,
        default: {
          type: 'money',
          upgradeType: upgradeType,
          upgradeInterval: 'yearly',
        },
        onComplete: (result: boolean) => {
          if (result) {
            modal.close();
          }
        },
      },
    });
  }
}
