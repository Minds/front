import {
  Supermind,
  SupermindPaymentMethod,
  SupermindReplyType,
  SupermindState,
} from '../../modules/supermind/supermind.types';

export const supermindMock: Supermind = {
  guid: '1234567890123456',
  activity_guid: '2234567890123456',
  sender_guid: '3234567890123456',
  receiver_guid: '4234567890123456',
  status: SupermindState.CREATED,
  payment_amount: 10,
  payment_method: SupermindPaymentMethod.OFFCHAIN_TOKENS,
  payment_txid: null,
  created_timestamp: 1690912276,
  updated_timestamp: 16909122767,
  expiry_threshold: 315360000,
  twitter_required: false,
  reply_type: SupermindReplyType.IMAGE,
  reply_activity_guid: '5234567890123456',
  entity: { guid: '5234567890123456' },
  receiver_entity: '4234567890123456',
};
