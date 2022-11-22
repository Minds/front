// Subject of the boost, a channel or post.
export type BoostSubject = 'channel' | 'post' | 'blog' | '';

// Selected tab, cash or tokens.
export type BoostTab = 'cash' | 'tokens';

// Selected payment method, onchain or offchain, OR cash will have a payment card as the method.
export type BoostTokenPaymentMethod = 'onchain' | 'offchain';

// Boost wallet.
export type BoostWallet = {
  balance: string;
  address: string;
  label: string;
  ether_balance?: string;
  available?: string;
};

// Entity that is boostable.
export type BoostableEntity = {
  guid?: string;
  type?: string;
  subtype?: string;
  owner_guid?: string;
  time_created?: number | string;
};

// Balance endpoint response.
export type BalanceResponse = {
  status?: string;
  addresses?: BoostWallet[];
  balance?: string;
  wireCap?: string;
  boostCap?: string;
  testnetBalance?: string;
};

// Boost prepare endpoint response.
export type PrepareResponse = {
  status?: string;
  guid?: string;
  checksum?: string;
};

// Boost activity post response.
export type BoostActivityPostResponse = {
  status?: string;
};

// POST Boost payload.
export type BoostPayload = {
  bidType?: string;
  checksum?: string;
  guid?: string;
  impressions?: number;
  paymentMethod?: PayloadPaymentMethod;
};

// Payment method for boost payload.
export type PayloadPaymentMethod = {
  method?: string;
  address?: string | false;
  txHash?: string | false;
  payment_method_id?: string;
};

// Holds impression rates per major unit of currency (e.g. 1000 for tokens, means 1000 per MINDS).
export type BoostImpressionRates = {
  cash: number;
  tokens: number;
};
