import {
  Error,
  V2ProductPageProductPageDynamicZone,
} from '../../../../graphql/generated.strapi';

/** Component in pages dynamic zone. */
export type ProductPageDynamicComponent = Exclude<
  V2ProductPageProductPageDynamicZone,
  Error
>;

/** Upgrade time periods. */
export enum ProductPageUpgradeTimePeriod {
  Monthly,
  Annually,
}

/** Upgrades config. */
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
  networks_team?: {
    monthly: {
      usd: number;
    };
    yearly: {
      usd: number;
    };
  };
  networks_community?: {
    monthly: {
      usd: number;
    };
    yearly: {
      usd: number;
    };
  };
  networks_enterprise?: {
    monthly: {
      usd: number;
    };
    yearly: {
      usd: number;
    };
  };
  networks_on_prem?: {
    monthly: {
      usd: number;
    };
    yearly: {
      usd: number;
    };
  };
};

/** Mobile tab data. */
export type ProductPageFeatTableMobileTab = {
  title: string;
  index: number;
};
