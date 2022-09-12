// list types for console
export type SupermindConsoleListType = 'inbox' | 'outbox';

// Supermind object from API.
export type Supermind = {
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
  entity?: any;
  receiver_entity?: any;
};

// Supermind reply type enum.
export enum SupermindReplyType {
  TEXT,
  IMAGE,
  VIDEO,
}

// Supermind reply type mapping.
export const SUPERMIND_REPLY_TYPE_MAP: { [key: number]: SupermindReplyType } = {
  0: SupermindReplyType.TEXT,
  1: SupermindReplyType.IMAGE,
  2: SupermindReplyType.VIDEO,
};

// Supermind state enum.
export enum SupermindState {
  PENDING,
  CREATED,
  ACCEPTED,
  REVOKED,
  REJECTED,
  FAILED_PAYMENT,
  FAILED,
  EXPIRED,
}

// Supermind state mapping.
export const SUPERMIND_STATE_MAP: { [key: number]: SupermindState } = {
  0: SupermindState.PENDING,
  1: SupermindState.CREATED,
  2: SupermindState.ACCEPTED,
  3: SupermindState.REVOKED,
  4: SupermindState.REJECTED,
  5: SupermindState.FAILED_PAYMENT,
  6: SupermindState.FAILED,
  7: SupermindState.EXPIRED,
};

// Supermind payment method enum.
export enum SupermindPaymentMethod {
  CASH,
  OFFCHAIN_TOKENS,
}

// Supermind payment method mapping.
export const SUPERMIND_PAYMENT_METHOD_MAP: {
  [key: number]: SupermindPaymentMethod;
} = {
  0: SupermindPaymentMethod.CASH,
  1: SupermindPaymentMethod.OFFCHAIN_TOKENS,
};
