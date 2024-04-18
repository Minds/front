import {
  GiftCardBalanceByProductId,
  GiftCardNode,
  GiftCardProductIdEnum,
  GiftCardTransaction,
} from '../../../graphql/generated.engine';

export const MockGiftCardTransaction: GiftCardTransaction = {
  paymentGuid: '1234567890123451',
  giftCardGuid: '1234567890123452',
  amount: -9.99,
  createdAt: 1689935825,
  refundedAt: 1689935826,
  boostGuid: '1234567890123453',
  id: '1',
  giftCardIssuerGuid: '1234567890123454',
  giftCardIssuerName: 'testUser1',
};

export const MockGiftCardTransactionArray: GiftCardTransaction[] = [
  {
    paymentGuid: '1234567890123451',
    giftCardGuid: '1234567890123452',
    amount: -9.99,
    createdAt: 1689935825,
    refundedAt: null,
    boostGuid: '1234567890123453',
    id: '1',
    giftCardIssuerGuid: '1234567890123454',
    giftCardIssuerName: 'testUser1',
  },
  {
    paymentGuid: '2234567890123451',
    giftCardGuid: '2234567890123452',
    amount: -19.99,
    createdAt: 1689935827,
    refundedAt: null,
    boostGuid: '2234567890123453',
    id: '2',
    giftCardIssuerGuid: '2234567890123454',
    giftCardIssuerName: 'testUser2',
  },
  {
    paymentGuid: '3234567890123451',
    giftCardGuid: '3234567890123452',
    amount: 29.99,
    createdAt: 1689935829,
    refundedAt: null,
    boostGuid: null,
    id: '3',
    giftCardIssuerGuid: '3234567890123454',
    giftCardIssuerName: 'testUser3',
  },
];

export const MockGiftCardNode: GiftCardNode = {
  amount: 9.99,
  balance: 8.99,
  claimedAt: 1689936760,
  claimedByGuid: '1234567890123451',
  expiresAt: 1689946760,
  guid: '1234567890123452',
  id: '1',
  issuedAt: 1689946750,
  issuedByGuid: '1234567890123453',
  productId: GiftCardProductIdEnum.Boost,
  transactions: {
    edges: [],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
    },
  },
};

export const MockGiftCardNodeArray: GiftCardNode[] = [
  {
    amount: 9.99,
    balance: 8.99,
    claimedAt: 1689936760,
    claimedByGuid: '1234567890123451',
    expiresAt: 1689946760,
    guid: '1234567890123452',
    id: '1',
    issuedAt: 1689946750,
    issuedByGuid: '1234567890123453',
    productId: GiftCardProductIdEnum.Boost,
    transactions: {
      edges: [],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    },
  },
  {
    amount: 19.99,
    balance: 18.99,
    claimedAt: 1689936761,
    claimedByGuid: '1234567890123452',
    expiresAt: 1689946761,
    guid: '1234567890123453',
    id: '1',
    issuedAt: 1689946753,
    issuedByGuid: '1234567890123454',
    productId: GiftCardProductIdEnum.Boost,
    transactions: {
      edges: [],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    },
  },
  {
    amount: 29.99,
    balance: 28.99,
    claimedAt: 1689936762,
    claimedByGuid: '1234567890123457',
    expiresAt: 1689946762,
    guid: '1234567890123454',
    id: '1',
    issuedAt: 1689946753,
    issuedByGuid: '1234567890123455',
    productId: GiftCardProductIdEnum.Boost,
    transactions: {
      edges: [],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    },
  },
];

export const MockGiftCardBalanceByProductId: GiftCardBalanceByProductId = {
  balance: 1.23,
  earliestExpiringGiftCard: MockGiftCardNode,
  productId: GiftCardProductIdEnum.Boost,
};

export const MockGiftCardBalanceByProductIdArray: GiftCardBalanceByProductId[] =
  [
    {
      balance: 1.23,
      earliestExpiringGiftCard: MockGiftCardNodeArray[2],
      productId: GiftCardProductIdEnum.Boost,
    },
    {
      balance: 2.34,
      earliestExpiringGiftCard: MockGiftCardNodeArray[1],
      productId: GiftCardProductIdEnum.Plus,
    },
    {
      balance: 3.45,
      earliestExpiringGiftCard: MockGiftCardNodeArray[2],
      productId: GiftCardProductIdEnum.Pro,
    },
  ];
