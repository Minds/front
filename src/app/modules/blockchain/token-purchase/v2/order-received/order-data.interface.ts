export interface OrderData {
  paymentMethod: 'Card' | 'Bank';
  tokenAmount: number;
  paymentAmount: number;
  currency: string;
}
