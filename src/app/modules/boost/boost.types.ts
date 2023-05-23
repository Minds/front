// BOOST OBJECT FROM API
export type Boost = {
  guid: string;
  urn: string;
  owner_guid: string;
  entity_guid: string;
  entity: any;
  target_location: number;
  target_suitability: number;
  target_platform_web?: boolean;
  target_platform_android?: boolean;
  target_platform_ios?: boolean;
  goal?: BoostGoal;
  goal_button_text?: BoostGoalButtonText;
  goal_button_url?: string;
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
    total_clicks?: number;
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

///////////////////////////////////////////////////////
// BOOST GOALS
export enum BoostGoal {
  VIEWS = 1, // "expand reach"
  ENGAGEMENT = 2, // "increase engagement"
  SUBSCRIBERS = 3, // "grow your following"
  CLICKS = 4, // "get more clicks"
}

export enum BoostGoalButtonText {
  SUBSCRIBE_TO_MY_CHANNEL = 1,
  GET_CONNECTED = 2,
  STAY_IN_THE_LOOP = 3,
  LEARN_MORE = 4,
  GET_STARTED = 5,
  SIGN_UP = 6,
  TRY_FOR_FREE = 7,
}
