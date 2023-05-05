import { BoostGoal, BoostGoalButtonText } from '../boost.types';
import { BoostAudience, BoostPaymentCategory } from './boost-modal-v2.types';

// default daily token budget.
export const DEFAULT_DAILY_TOKEN_BUDGET: number = 5;

// default daily token duration.
export const DEFAULT_TOKEN_DURATION: number = 1;

// default daily cash budget.
export const DEFAULT_DAILY_CASH_BUDGET: number = 10;

// default daily cash duration.
export const DEFAULT_CASH_DURATION: number = 1;

// default audience.
export const DEFAULT_AUDIENCE: BoostAudience = BoostAudience.SAFE;

// default goal.
export const DEFAULT_GOAL: BoostGoal = BoostGoal.VIEWS;

// default goal button text when goal is subscribers.
export const DEFAULT_BUTTON_TEXT_FOR_SUBSCRIBER_GOAL: BoostGoalButtonText =
  BoostGoalButtonText.SUBSCRIBE_TO_MY_CHANNEL;

// default goal button text when goal is clicks.
export const DEFAULT_BUTTON_TEXT_FOR_CLICKS_GOAL: BoostGoalButtonText =
  BoostGoalButtonText.LEARN_MORE;

// default payment category.
export const DEFAULT_PAYMENT_CATEGORY: BoostPaymentCategory =
  BoostPaymentCategory.CASH;
