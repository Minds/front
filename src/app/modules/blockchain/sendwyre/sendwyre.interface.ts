/**
 * Interface for SendWyre config object
 */
export interface SendWyreConfig {
  paymentMethod: string;
  accountId: string;
  dest: string;
  destCurrency: string;
  sourceAmount: string;
  redirectUrl: string;
  failureRedirectUrl: string;
}
