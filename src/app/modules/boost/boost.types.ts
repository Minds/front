// Boost GUID type.
export type BoostGuid = string;

// ojm todo - add optional flag, add any remaining fields (e.g. payment submethod)
// Boost object from API.
export type Boost = {
  guid: string;
  urn: string;
  owner_guid: string;
  entity_guid: string;
  entity: any;
  target_location: number;
  target_suitability: number;
  payment_method_id: number;
  payment_method?: number;
  payment_amount: number;
  daily_bid: number;
  duration_days: number;
  boost_status: number;
  created_timestamp: number;
  updated_timestamp: number;
  approved_timestamp: number;
};
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
// SUITABILITY

// Boost suitability enum.
export enum BoostSuitability {
  SAFE,
  CONTROVERSIAL,
}

// Boost suitability mapping.
export const BOOST_SUITABILITY_MAP: {
  [key: number]: BoostSuitability;
} = {
  1: BoostSuitability.SAFE,
  2: BoostSuitability.CONTROVERSIAL,
};

// Suitability filter values for Boost console.
export type BoostConsoleSuitabilityFilterType = 'safe' | 'controversial';
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

// Location filter values for Boost console.
export type BoostConsoleLocationFilterType = 'newsfeed' | 'sidebar';
///////////////////////////////////////////////////////
// LOCATION

// Boost location enum.
export enum BoostEntityType {
  ACTIVITY,
  CHANNEL,
}

// Boost entity type mapping.
export const BOOST_ENTITY_TYPE_MAP: {
  [key: number]: BoostEntityType;
} = {
  1: BoostEntityType.ACTIVITY,
  2: BoostEntityType.CHANNEL,
};

// Entity type filter values for Boost console.
export type BoostConsoleEntityTypeFilterType = 'activity' | 'channel';
///////////////////////////////////////////////////////
// ojm
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
