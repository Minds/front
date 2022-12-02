import { BoostAudience, BoostPaymentCategory } from './boost-modal-v2.types';

// default daily token budget.
export const DEFAULT_DAILY_TOKEN_BUDGET: number = 100;

// default daily token duration.
export const DEFAULT_TOKEN_DURATION: number = 3;

// default daily cash budget.
export const DEFAULT_DAILY_CASH_BUDGET: number = 10;

// default daily cash duration.
export const DEFAULT_CASH_DURATION: number = 3;

// default audience.
export const DEFAULT_AUDIENCE: BoostAudience = BoostAudience.SAFE;

// default payment category.
export const DEFAULT_PAYMENT_CATEGORY: BoostPaymentCategory =
  BoostPaymentCategory.CASH;
