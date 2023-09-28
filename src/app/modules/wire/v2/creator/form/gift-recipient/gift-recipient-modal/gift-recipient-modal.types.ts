import { GiftCardProductIdEnum } from '../../../../../../../../graphql/generated.engine';

/** Duration of a gift */
export enum GiftRecipientGiftDuration {
  MONTH,
  YEAR,
}

/** Modal input data */
export type GiftRecipientModalInputParams = {
  onDismissIntent: () => void;
  onSaveIntent: (username: string, isSelfGift: boolean) => void;
  product: GiftCardProductIdEnum;
  duration: GiftRecipientGiftDuration;
  recipientUsername?: string;
  isSelfGift?: boolean;
};
