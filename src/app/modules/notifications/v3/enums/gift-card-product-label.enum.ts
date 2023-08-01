import { Exception } from 'sass';

export const enum GiftCardProductLabelEnum {
  BOOST = 'Boost',
  PLUS = 'Minds Plus',
  PRO = 'Minds Pro',
  SUPERMIND = 'Supermind',
}

export const getGiftCardProductLabelEnum = (
  product: number
): GiftCardProductLabelEnum => {
  switch (product) {
    case 0:
      return GiftCardProductLabelEnum.BOOST;
    case 1:
      return GiftCardProductLabelEnum.PLUS;
    case 2:
      return GiftCardProductLabelEnum.PRO;
    case 3:
      return GiftCardProductLabelEnum.SUPERMIND;
    default:
      throw new Error(`Invalid product: ${product}`);
  }
};
