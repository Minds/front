import {
  Error,
  V2ProductPageProductPageDynamicZone,
} from '../../../../graphql/generated.strapi';

export type ProductPageDynamicComponent = Exclude<
  V2ProductPageProductPageDynamicZone,
  Error
>;

export enum ProductPageUpgradeTimePeriod {
  Monthly,
  Annually,
}

export type ProductPageUpgradesConfig = {
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
