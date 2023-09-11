import { GiftCardProductIdEnum } from '../../../../../../../graphql/generated.engine';

/** Product benefits collection for different products. */
export type ProductUpgradeCardProductBenefits = Pick<
  {
    [key in GiftCardProductIdEnum]: ProductUpgradeCardProductBenefit[];
  },
  GiftCardProductIdEnum.Plus | GiftCardProductIdEnum.Pro
>;

/** Individual product benefit. */
export type ProductUpgradeCardProductBenefit =
  | {
      iconName: string;
      text: string;
    }
  | {
      iconPath: string;
      text: string;
    };

/** Pricing tier collection for different products. */
export type ProductUpgradeCardPricingTiers = Pick<
  {
    [key in GiftCardProductIdEnum]: ProductUpgradeCardPricingTier[];
  },
  GiftCardProductIdEnum.Plus | GiftCardProductIdEnum.Pro
>;

/** Individual pricing tier. */
export type ProductUpgradeCardPricingTier = {
  amountText: string;
  period: string;
};

/** Config from engine for upgrade card consumption. */
export type GiftCardUpgradesConfig = {
  plus: {
    monthly: {
      usd: number;
    };
    yearly: {
      usd: number;
    };
  };
  pro: {
    monthly: {
      usd: number;
    };
    yearly: {
      usd: number;
    };
  };
};
