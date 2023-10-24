export type UpgradePageCard = UpgradePageRow[];

export type UpgradePageRow = {
  cardId: string;
  rowType: string;
  displayText: string;
  priceTextArray?: string[];
  iconId?: string | null;
  iconSource?: string | null;
  bulletOrderWithinCard?: number | null;
};

export type UpgradePageCardId = 'hero' | 'plus' | 'pro' | 'networks';

export type UpgadePageRowType = 'title' | 'price' | 'linkText' | 'bullet';

export type UpgradePageToggleValue = 'upgrade' | 'gift';
