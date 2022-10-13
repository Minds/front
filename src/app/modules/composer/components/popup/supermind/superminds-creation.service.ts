import { Injectable } from '@angular/core';
import { MindsUser } from '../../../../../interfaces/entities';

/**
 * Payment methods supported
 */
export enum SUPERMIND_PAYMENT_METHODS {
  CASH,
  TOKENS,
}

/**
 * The default payment method
 */
export const SUPERMIND_DEFAULT_PAYMENT_METHOD = SUPERMIND_PAYMENT_METHODS.CASH;

/**
 * The minumum (default) amount a cash request can be
 */
export const SUPERMIND_DEFAULT_CASH_MIN: number = 10;

/**
 * The minumum (default) amount a token request can be
 */
export const SUPERMIND_DEFAULT_TOKENS_MIN: number = 1;

/**
 * Response types
 */
export enum SUPERMIND_RESPONSE_TYPES {
  TEXT,
  IMAGE,
  VIDEO,
  REMIND,
}

/**
 * The default response type to use
 */
export const SUPERMIND_DEFAULT_RESPONSE_TYPE = SUPERMIND_RESPONSE_TYPES.TEXT;

export type SupermindComposerPaymentOptionsType = {
  amount: number;
  payment_type: SUPERMIND_PAYMENT_METHODS;
  payment_method_id?: string;
};

/**
 * The data model type that will be sent with the composer api request
 */
export type SupermindComposerPayloadType = {
  receiver_user?: MindsUser;
  receiver_guid: string;
  reply_type: SUPERMIND_RESPONSE_TYPES;
  twitter_required: boolean;
  payment_options: SupermindComposerPaymentOptionsType;
  terms_agreed: boolean;
  refund_policy_agreed: boolean;
};

@Injectable()
export class SupermindCreationService {}
