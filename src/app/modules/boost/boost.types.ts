// Boost GUID type.
export type BoostGuid = string;

// ojm todo - replace from below
// Boost object from API.
export type Boost = {
  guid: string;
  activity_guid: string;
  sender_guid: string;
  receiver_guid: string;
  status: number;
  payment_amount: number;
  payment_method: number;
  payment_txid?: string;
  created_timestamp: number;
  updated_timestamp: number;
  expiry_threshold: number;
  twitter_required: boolean;
  reply_type: number;
  reply_activity_guid?: string;
  entity?: any;
  receiver_entity?: any;
};

// {
// "guid": "1454633718378401812",
// "urn": "urn:boost:1454633718378401812",
// "owner_guid": "1215744293826727938",
// "entity_guid": "1454618190507151375",
// "entity": {},
// "target_location": 1,
// "target_suitability": 1,
// "payment_method": 2,
// "payment_amount": 5,
// "daily_bid": 5,
// "duration_days": 1,
// "boost_status": 1,
// "created_timestamp": 1672187704,
// "updated_timestamp": null,
// "approved_timestamp": null
// },
///////////////////////////////////////////////////////
// STATE

// Boost state enum.
export enum BoostState {
  PENDING,
  APPROVED,
  REJECTED,
  REFUND_IN_PROGRESS,
  REFUND_PROCESSED,
  FAILED,
  REPORTED,
}

// Boost state mapping.
export const BOOST_STATE_MAP: { [key: number]: BoostState } = {
  1: BoostState.PENDING,
  2: BoostState.APPROVED,
  3: BoostState.REJECTED,
  4: BoostState.REFUND_IN_PROGRESS,
  5: BoostState.REFUND_PROCESSED,
  6: BoostState.FAILED,
  7: BoostState.REPORTED,
};

// State filter values for Boost console.
export type BoostConsoleStateFilterType =
  | 'all'
  | 'pending'
  | 'approved'
  | 'completed'
  | 'rejected';
///////////////////////////////////////////////////////
// PAYMENT METHOD

// Boost payment method enum.
export enum BoostPaymentMethod {
  CASH,
  OFFCHAIN_TOKENS,
  ONCHAIN_TOKENS,
}

// Boost payment method mapping.
export const BOOST_PAYMENT_METHOD_MAP: {
  [key: number]: BoostPaymentMethod;
} = {
  1: BoostPaymentMethod.CASH,
  2: BoostPaymentMethod.OFFCHAIN_TOKENS,
  3: BoostPaymentMethod.ONCHAIN_TOKENS,
};

///////////////////////////////////////////////////////
// AUDIENCE

// Boost audience enum.
export enum BoostAudience {
  SAFE,
  CONTROVERSIAL,
}

// Boost audience mapping.
export const BOOST_AUDIENCE_MAP: {
  [key: number]: BoostAudience;
} = {
  1: BoostAudience.SAFE,
  2: BoostAudience.CONTROVERSIAL,
};

// Audience filter values for Boost console.
export type BoostConsoleAudienceFilterType = 'safe' | 'controversial';
///////////////////////////////////////////////////////
// LOCATION

// Boost location enum.
export enum BoostLocation {
  NEWSFEED,
  SIDEBAR,
}

// Boost location mapping.
export const BOOST_LOCATION_MAP: {
  [key: number]: BoostLocation;
} = {
  1: BoostLocation.NEWSFEED,
  2: BoostLocation.SIDEBAR,
};

///////////////////////////////////////////////////////

// // Get count params for inbox and outbox endpoints.
// export type BoostConsoleCountParams = {
//   status?: BoostState;
// };
///////////////////////////////////////////////////////

// Get params for user console endpoints.
export type BoostConsoleGetParams = {
  limit?: number;
  offset?: number;
  status?: BoostState;
};
