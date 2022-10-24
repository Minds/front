import { MindsUser } from '../../../../interfaces/entities';

// Get payments request.
export type GetPaymentsRequest = {
  status: string;
  data: Payment[];
  has_more: boolean;
};

// Payment object.
export type Payment = {
  status: string;
  payment_id: string;
  currency: PaymentCurrency;
  minor_unit_amount: number;
  statement_descriptor: PaymentStatementDescriptor;
  created_timestamp: number;
  receipt_url?: string;
  recipient?: MindsUser;
};

//Valid statement descriptors.
export type PaymentStatementDescriptor =
  | 'Minds: Pro sub'
  | 'Minds: Plus sub'
  | 'Minds: Payment'
  | 'Minds: Supermind';

// Payment currencies.
export type PaymentCurrency = 'usd';
