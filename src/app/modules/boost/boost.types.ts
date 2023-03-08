// BOOST OBJECT FROM API
export type Boost = {
  guid: string;
  urn: string;
  owner_guid: string;
  entity_guid: string;
  entity: any;
  target_location: number;
  target_suitability: number;
  payment_method_id?: number;
  payment_method: number;
  payment_amount: number;
  daily_bid: number;
  duration_days: number;
  boost_status: number;
  rejection_reason?: number;
  created_timestamp: number;
  updated_timestamp: number;
  approved_timestamp: number;
  payment_tx_id?: string;
  summary?: {
    views_delivered?: number;
  };
};

/**
 * Rejection reason
 */
export type RejectionReason = {
  code: number; // numerical code for the reason
  label: string; // text label for the reason
};

// BOOST GUID
export type BoostGuid = string;

///////////////////////////////////////////////////////

// BOOST STATE
export enum BoostState {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  REFUND_IN_PROGRESS = 4,
  REFUND_PROCESSED = 5,
  FAILED = 6,
  REPORTED = 7,
  PENDING_ONCHAIN_CONFIRMATION = 8,
  COMPLETED = 9,
  CANCELLED = 10,
}

// BOOST CONSOLE STATE FILTER
export type BoostConsoleStateFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'completed'
  | 'rejected';
///////////////////////////////////////////////////////

// BOOST PAYMENT METHOD
export enum BoostPaymentMethod {
  CASH = 1,
  OFFCHAIN_TOKENS = 2,
  ONCHAIN_TOKENS = 3,
}

// BOOST CONSOLE PAYMENT METHOD FILTER
export type BoostConsolePaymentMethodFilter =
  | 'all'
  | 'cash'
  | 'offchain_tokens'
  | 'onchain_tokens';

///////////////////////////////////////////////////////
// BOOST SUITABILITY
export enum BoostSuitability {
  SAFE = 1,
  CONTROVERSIAL = 2,
}

// BOOST CONSOLE SUITABILITY FILTER
export type BoostConsoleSuitabilityFilter = 'safe' | 'controversial';

///////////////////////////////////////////////////////

// BOOST LOCATION
export enum BoostLocation {
  NEWSFEED = 1,
  SIDEBAR = 2,
}

// BOOST CONSOLE LOCATION FILTER
// note: 'all' is only used in admin context
export type BoostConsoleLocationFilter = 'all' | 'feed' | 'sidebar';
///////////////////////////////////////////////////////

// BOOST CONSOLE GET PARAMS
export type BoostConsoleGetParams = {
  limit?: number;
  offset?: number;
  location?: BoostLocation;
  status?: BoostState;
  audience?: BoostSuitability;
  payment_method?: BoostPaymentMethod;
};

// STATS FOR ADMIN BOOST CONSOLE
export type BoostConsoleAdminStatsResponse = {
  global_pending: {
    safe_count: number;
    controversial_count: number;
  };
};

// SINGLE BOOST GET RESPONSE
export type BoostConsoleSingleGetResponse = {
  boost: Boost;
};
