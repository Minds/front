import { TestBed } from '@angular/core/testing';
import { GiftCardService } from './gift-card.service';
import {
  ClaimGiftCardGQL,
  CreateGiftCardGQL,
  GetGiftCardBalancesGQL,
  GetGiftCardBalancesWithExpiryDataGQL,
  GetGiftCardByCodeGQL,
  GiftCardBalanceByProductId,
  GiftCardNode,
  GiftCardProductIdEnum,
  GiftCardTargetInput,
} from '../../../graphql/generated.engine';
import { of, take } from 'rxjs';
import { ConfigsService } from '../../common/services/configs.service';
import { MockService } from '../../utils/mock';
import { GiftCardUpgradesConfig } from '../wallet/components/credits/send/product-upgrade-card/product-upgrade-card.types';
import { GiftRecipientGiftDuration } from '../wire/v2/creator/form/gift-recipient/gift-recipient-modal/gift-recipient-modal.types';

export const mockUpgradesConfig: GiftCardUpgradesConfig = {
  plus: {
    yearly: {
      usd: 60,
    },
    monthly: {
      usd: 7,
    },
  },
  pro: {
    yearly: {
      usd: 480,
    },
    monthly: {
      usd: 60,
    },
  },
};

describe('GiftCardService', () => {
  let service: GiftCardService;
  const mockGiftCardNode: GiftCardNode = {
    __typename: 'GiftCardNode',
    amount: 9.99,
    balance: 9.99,
    claimedAt: null,
    claimedByGuid: null,
    expiresAt: 32519535585,
    guid: '1234567890',
    id: '2345678901',
    issuedAt: 1688386785,
    issuedByGuid: '3456789012',
    productId: GiftCardProductIdEnum.Boost,
    transactions: null,
  };

  const mockGiftCardBalances: GiftCardBalanceByProductId[] = [
    {
      __typename: 'GiftCardBalanceByProductId',
      balance: 12.34,
      productId: GiftCardProductIdEnum.Boost,
    },
    {
      __typename: 'GiftCardBalanceByProductId',
      balance: 23.45,
      productId: GiftCardProductIdEnum.Plus,
    },
    {
      __typename: 'GiftCardBalanceByProductId',
      balance: 34.56,
      productId: GiftCardProductIdEnum.Pro,
    },
    {
      __typename: 'GiftCardBalanceByProductId',
      balance: 45.67,
      productId: GiftCardProductIdEnum.Supermind,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GiftCardService,
        {
          provide: GetGiftCardByCodeGQL,
          useValue: jasmine.createSpyObj<GetGiftCardByCodeGQL>(['fetch']),
        },
        {
          provide: GetGiftCardBalancesGQL,
          useValue: jasmine.createSpyObj<GetGiftCardBalancesGQL>(['fetch']),
        },
        {
          provide: GetGiftCardBalancesWithExpiryDataGQL,
          useValue: jasmine.createSpyObj<GetGiftCardBalancesWithExpiryDataGQL>([
            'fetch',
          ]),
        },
        {
          provide: ClaimGiftCardGQL,
          useValue: jasmine.createSpyObj<ClaimGiftCardGQL>(['mutate']),
        },
        {
          provide: CreateGiftCardGQL,
          useValue: jasmine.createSpyObj<CreateGiftCardGQL>(['mutate']),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    });

    service = TestBed.inject(GiftCardService);

    (service as any).getGiftCardByCodeGQL.fetch.calls.reset();
    (service as any).getGiftCardBalancesGQL.fetch.calls.reset();
    (service as any).claimGiftCardGQL.mutate.calls.reset();
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('getGiftCardByCode', () => {
    it('should get a gift card by code', (done: DoneFn) => {
      (service as any).getGiftCardByCodeGQL.fetch.and.returnValue(
        of({
          data: {
            giftCardByClaimCode: mockGiftCardNode,
          },
        })
      );

      const claimCode: string = '1234567890';
      service
        .getGiftCardByCode(claimCode)
        .pipe(take(1))
        .subscribe((giftCardNode: GiftCardNode) => {
          expect(giftCardNode).toEqual(mockGiftCardNode);
          done();
        });
    });

    it('should return null when no gift card is found by code', (done: DoneFn) => {
      (service as any).getGiftCardByCodeGQL.fetch.and.returnValue(
        of({
          data: {
            giftCardByClaimCode: null,
          },
        })
      );

      const claimCode: string = '1234567890';
      service
        .getGiftCardByCode(claimCode)
        .pipe(take(1))
        .subscribe((giftCardNode: GiftCardNode) => {
          expect(giftCardNode).toBeNull();
          done();
        });
    });
  });

  describe('getGiftCardBalances', () => {
    it('should get gift card balances', (done: DoneFn) => {
      (service as any).getGiftCardBalancesGQL.fetch.and.returnValue(
        of({
          data: {
            giftCardsBalances: mockGiftCardBalances,
          },
        })
      );

      service
        .getGiftCardBalances()
        .pipe(take(1))
        .subscribe((giftCardBalances: GiftCardBalanceByProductId[]) => {
          expect(giftCardBalances).toEqual(mockGiftCardBalances);
          done();
        });
    });

    it('should return null when no gift card balances are found', (done: DoneFn) => {
      (service as any).getGiftCardBalancesGQL.fetch.and.returnValue(
        of({
          data: {
            giftCardsBalances: null,
          },
        })
      );

      service
        .getGiftCardBalances()
        .pipe(take(1))
        .subscribe((giftCardBalances: GiftCardBalanceByProductId[]) => {
          expect(giftCardBalances).toBeNull();
          done();
        });
    });
  });

  describe('getGiftCardBalancesWithExpiryData', () => {
    it('should get gift card balances with additional expiry data', (done: DoneFn) => {
      (service as any).getGiftCardBalancesWithExpiryDataGQL.fetch.and.returnValue(
        of({
          data: {
            giftCardsBalances: mockGiftCardBalances,
          },
        })
      );

      service
        .getGiftCardBalancesWithExpiryData()
        .pipe(take(1))
        .subscribe((giftCardBalances: GiftCardBalanceByProductId[]) => {
          expect(giftCardBalances).toEqual(mockGiftCardBalances);
          done();
        });
    });

    it('should return null when no gift card balances with additional expiry data are found', (done: DoneFn) => {
      (service as any).getGiftCardBalancesWithExpiryDataGQL.fetch.and.returnValue(
        of({
          data: {
            giftCardsBalances: null,
          },
        })
      );

      service
        .getGiftCardBalancesWithExpiryData()
        .pipe(take(1))
        .subscribe((giftCardBalances: GiftCardBalanceByProductId[]) => {
          expect(giftCardBalances).toBeNull();
          done();
        });
    });
  });

  describe('claimGiftCard', () => {
    it('should claim gift card', (done: DoneFn) => {
      (service as any).claimGiftCardGQL.mutate.and.returnValue(
        of({
          data: {
            claimGiftCard: mockGiftCardNode,
          },
        })
      );
      const claimCode: string = '1234567890';

      service
        .claimGiftCard(claimCode)
        .pipe(take(1))
        .subscribe((giftCardNode: GiftCardNode) => {
          expect(giftCardNode).toBe(mockGiftCardNode);
          done();
        });
    });

    it('should return null when claiming gift card returns no gift card', (done: DoneFn) => {
      (service as any).claimGiftCardGQL.mutate.and.returnValue(
        of({
          data: {
            claimGiftCard: null,
          },
        })
      );
      const claimCode: string = '1234567890';

      service
        .claimGiftCard(claimCode)
        .pipe(take(1))
        .subscribe((giftCardNode: GiftCardNode) => {
          expect(giftCardNode).toBeNull();
          done();
        });
    });
  });

  describe('createGiftCard', () => {
    it('should create a Boost gift card', (done: DoneFn) => {
      const productIdEnum: GiftCardProductIdEnum = GiftCardProductIdEnum.Boost;
      const amount: number = 10;
      const stripePaymentMethodId: string = 'sk_123';
      const targetInput: GiftCardTargetInput = {
        targetUsername: 'testAccount',
      };

      (service as any).createGiftCardGQL.mutate.and.returnValue(
        of({
          data: {
            createGiftCard: mockGiftCardNode,
          },
        })
      );

      service
        .createGiftCard(
          productIdEnum,
          amount,
          stripePaymentMethodId,
          targetInput
        )
        .pipe(take(1))
        .subscribe((guid: string) => {
          expect(guid).toBe(mockGiftCardNode.guid);
          done();
        });
    });

    it('should create a Plus gift card', (done: DoneFn) => {
      const productIdEnum: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const amount: number = 10;
      const stripePaymentMethodId: string = 'sk_123';
      const targetInput: GiftCardTargetInput = {
        targetUsername: 'testAccount',
      };

      (service as any).createGiftCardGQL.mutate.and.returnValue(
        of({
          data: {
            createGiftCard: mockGiftCardNode,
          },
        })
      );

      service
        .createGiftCard(
          productIdEnum,
          amount,
          stripePaymentMethodId,
          targetInput
        )
        .pipe(take(1))
        .subscribe((guid: string) => {
          expect(guid).toBe(mockGiftCardNode.guid);
          done();
        });
    });

    it('should create a Pro gift card', (done: DoneFn) => {
      const productIdEnum: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const amount: number = 10;
      const stripePaymentMethodId: string = 'sk_123';
      const targetInput: GiftCardTargetInput = {
        targetUsername: 'testAccount',
      };

      (service as any).createGiftCardGQL.mutate.and.returnValue(
        of({
          data: {
            createGiftCard: mockGiftCardNode,
          },
        })
      );

      service
        .createGiftCard(
          productIdEnum,
          amount,
          stripePaymentMethodId,
          targetInput
        )
        .pipe(take(1))
        .subscribe((guid: string) => {
          expect(guid).toBe(mockGiftCardNode.guid);
          done();
        });
    });

    it('should create a Supermind gift card', (done: DoneFn) => {
      const productIdEnum: GiftCardProductIdEnum =
        GiftCardProductIdEnum.Supermind;
      const amount: number = 10;
      const stripePaymentMethodId: string = 'sk_123';
      const targetInput: GiftCardTargetInput = {
        targetUsername: 'testAccount',
      };

      (service as any).createGiftCardGQL.mutate.and.returnValue(
        of({
          data: {
            createGiftCard: mockGiftCardNode,
          },
        })
      );

      service
        .createGiftCard(
          productIdEnum,
          amount,
          stripePaymentMethodId,
          targetInput
        )
        .pipe(take(1))
        .subscribe((guid: string) => {
          expect(guid).toBe(mockGiftCardNode.guid);
          done();
        });
    });
  });

  describe('getProductNameByProductId', () => {
    it('should get product name as plural for Boost', () => {
      expect(
        service.getProductNameByProductId(GiftCardProductIdEnum.Boost)
      ).toBe('Boost Credits');
    });

    it('should get product name as non-plural for Boost', () => {
      expect(
        service.getProductNameByProductId(GiftCardProductIdEnum.Boost, false)
      ).toBe('Boost Credit');
    });

    it('should get product name as plural for Plus', () => {
      expect(
        service.getProductNameByProductId(GiftCardProductIdEnum.Plus)
      ).toBe('Minds+ Credits');
    });

    it('should get product name as non-plural for Plus', () => {
      expect(
        service.getProductNameByProductId(GiftCardProductIdEnum.Plus, false)
      ).toBe('Minds+ Credit');
    });

    it('should get product name as plural for Pro', () => {
      expect(service.getProductNameByProductId(GiftCardProductIdEnum.Pro)).toBe(
        'Pro Credits'
      );
    });

    it('should get product name as non-plural for Pro', () => {
      expect(
        service.getProductNameByProductId(GiftCardProductIdEnum.Pro, false)
      ).toBe('Pro Credit');
    });

    it('should get product name as plural for Supermind', () => {
      expect(
        service.getProductNameByProductId(GiftCardProductIdEnum.Supermind)
      ).toBe('Supermind Credits');
    });

    it('should get product name as non-plural for Supermind', () => {
      expect(
        service.getProductNameByProductId(
          GiftCardProductIdEnum.Supermind,
          false
        )
      ).toBe('Supermind Credit');
    });

    it('should get product name as plural for unknown credits', () => {
      expect(
        service.getProductNameByProductId('unknown' as GiftCardProductIdEnum)
      ).toBe('Other Credits');
    });

    it('should get product name as non-plural for unknown credits', () => {
      expect(
        service.getProductNameByProductId(
          'unknown' as GiftCardProductIdEnum,
          false
        )
      ).toBe('Other Credit');
    });
  });

  describe('getLargestPurchasableUpgradeDuration', () => {
    beforeEach(() => {
      (service as any).config.get
        .withArgs('upgrades')
        .and.returnValue(mockUpgradesConfig);
    });

    it('should return a yearly duration when user can purchase exactly a year of Plus', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const amount: number = mockUpgradesConfig.plus.yearly.usd;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(GiftRecipientGiftDuration.YEAR);
    });

    it('should return a yearly duration when user can purchase more than a year of Plus', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const amount: number = mockUpgradesConfig.plus.yearly.usd * 2;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(GiftRecipientGiftDuration.YEAR);
    });

    it('should return a monthly duration when user can purchase just less than a year of Plus', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const amount: number = mockUpgradesConfig.plus.yearly.usd - 1;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(GiftRecipientGiftDuration.MONTH);
    });

    it('should return a monthly duration when a user can purchase exactly a month of Plus', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const amount: number = mockUpgradesConfig.plus.monthly.usd;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(GiftRecipientGiftDuration.MONTH);
    });

    it('should return null when user cannot purchase a minimum of a month of Plus', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const amount: number = mockUpgradesConfig.plus.monthly.usd - 1;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(null);
    });

    it('should return a yearly duration when user can purchase exactly a year of Pro', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const amount: number = mockUpgradesConfig.pro.yearly.usd;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(GiftRecipientGiftDuration.YEAR);
    });

    it('should return a yearly duration when user can purchase more than a year  of Pro', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const amount: number = mockUpgradesConfig.pro.yearly.usd * 2;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(GiftRecipientGiftDuration.YEAR);
    });

    it('should return a monthly duration when user can purchase just less than a year of Pro', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const amount: number = mockUpgradesConfig.pro.yearly.usd - 1;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(GiftRecipientGiftDuration.MONTH);
    });

    it('should return a monthly duration when a user can purchase exactly a month of Pro', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const amount: number = mockUpgradesConfig.pro.monthly.usd;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(GiftRecipientGiftDuration.MONTH);
    });

    it('should return null when user cannot purchase a minimum of a month of Pro    ', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const amount: number = mockUpgradesConfig.pro.monthly.usd - 1;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(null);
    });

    it('should return null when product id is Boost', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Boost;
      const amount: number = 999;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(null);
    });

    it('should return null when product id is Supermind', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Supermind;
      const amount: number = 999;

      expect(
        service.getLargestPurchasableUpgradeDuration(productId, amount)
      ).toBe(null);
    });
  });
});
