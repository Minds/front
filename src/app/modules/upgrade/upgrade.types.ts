import { UpgradePage } from '../../../graphql/generated.strapi';

export type UpgradePageCard = UpgradePageRow[];

export type UpgradePageRow = UpgradePage & {
  priceTextArray: string[] | null;
};

export type UpgradePageRowEntity = {
  attributes?: UpgradePageRow;
};

export type UpgradePageToggleValue = 'upgrade' | 'gift';

export type UpgradePageConfigPrices =
  | {
      hero: number;
      plus: number;
      pro: number;
      networks?: number;
    }
  | {};
