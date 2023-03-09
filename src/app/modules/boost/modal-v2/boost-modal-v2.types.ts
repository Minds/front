// Data used to init modal.
import { RejectionReason } from '../boost.types';

export type BoostModalExtraOpts = {
  disabledSafeAudience?: boolean;
};

export type BoostModalData = {
  onDismissIntent: () => any;
  onSaveIntent: () => any;
  entity: BoostableEntity;
} & BoostModalExtraOpts;

// Subject of the boost, a channel or post.
export enum BoostSubject {
  CHANNEL = 1,
  POST = 2,
}

// Payment category. Maps to which pool the user wants to be in.
export enum BoostPaymentCategory {
  CASH = 1,
  TOKENS = 2,
}

// Modal panel.
export enum BoostModalPanel {
  AUDIENCE = 1,
  BUDGET = 2,
  REVIEW = 3,
}

// Payment method for boost.
export enum BoostPaymentMethod {
  CASH = 1,
  OFFCHAIN_TOKENS = 2,
  ONCHAIN_TOKENS = 3,
}

// Payment method for boost.
export type BoostPaymentMethodId = string;

// Audience for boost.
export enum BoostAudience {
  SAFE = 1,
  CONTROVERSIAL = 2,
}

export enum BoostLocation {
  NEWSFEED = 1,
  SIDEBAR = 2,
}

// Entity that is boostable.
export type BoostableEntity = {
  guid: string;
  type: string;
  subtype: string;
  owner_guid: string;
  nsfw?: number[];
  nsfw_lock?: number[];
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
  rejection_reasons: RejectionReason[];
};

// Object holding estimated reach for a boost.
export type EstimatedReach = {
  views: {
    low: number;
    high: number;
  };
  cpm: {
    low: number;
    high: number;
  };
};

// Boost submission request object.
export type BoostSubmissionPayload = {
  guid?: string;
  entity_guid: string;
  target_suitability: BoostAudience;
  target_location: BoostLocation;
  payment_method: BoostPaymentMethod;
  payment_method_id?: string;
  daily_bid: number;
  duration_days: number;
};

// Response on boost submission.
export type BoostSubmitResponse = {};

// Boost prepare endpoint response.
export type PrepareResponse = {
  status?: string;
  guid: string;
  checksum: string;
};
