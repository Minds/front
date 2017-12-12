export type WireRewardsType =
  'points' |
  'money' |
  'tokens';

export type WireRewardsTier = {
  amount: number | '',
  description: string
};

export type WireRewardsTiers = Array<WireRewardsTier>;

export type WireRewardsStruc = {
  description: string,
  rewards: {
    [key in WireRewardsType]: WireRewardsTiers
  }
};

export type WireThresholdStruc = {
  type: WireRewardsType,
  min: number | ''
};
