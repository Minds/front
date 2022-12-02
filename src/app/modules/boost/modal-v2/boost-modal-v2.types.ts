// Data used to init modal.
export type BoostModalData = {
  onDismissIntent: () => any;
  onSaveIntent: () => any;
  entity: BoostableEntity;
};

// Subject of the boost, a channel or post.
export type BoostSubject = 'channel' | 'post' | '';

// Payment category. Maps to which pool the user wants to be in.
export type BoostPaymentCategory = 'cash' | 'tokens';

// Payment method for boost.
export type BoostPaymentMethod = 'offchain-tokens' | 'onchain-tokens' | string;

// Modal panel.
export type BoostModalPanel = 'audience' | 'budget' | 'review';

// Audience for boost.
export type BoostAudience = 'safe' | 'controversial';

// Entity that is boostable.
export type BoostableEntity = {
  guid: string;
  type: string;
  subtype: string;
  owner_guid: string;
  time_created: number | string;
};

// Boost config from server.
export type BoostConfig = {
  min: {
    cash: number;
    offchain_tokens: number;
    onchain_tokens: number;
  };
  max: {
    cash: number;
    offchain_tokens: number;
    onchain_tokens: number;
  };
  duration: {
    min: number;
    max: number;
  };
  bid_increments: {
    cash: number[];
    offchain_tokens: number[];
    onchain_tokens: number[];
  };
};

// Object holding estimated reach for a boost.
export type EstimatedReach = {
  lower_bound: number;
  upper_bound: number;
};
