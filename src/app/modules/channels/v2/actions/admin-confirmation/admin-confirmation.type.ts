export type SubscriptionTimespan = 'month' | 'year' | 'life' | '';

export type ConfirmationAction = 'make' | 'remove';

export type SubscriptionType = 'plus' | 'pro';

export type CompletedPayload = {
  type: SubscriptionType;
  action: ConfirmationAction;
};
