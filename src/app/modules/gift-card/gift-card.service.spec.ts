import { TestBed } from '@angular/core/testing';
import { GiftCardService } from './gift-card.service';
import {
  ClaimGiftCardGQL,
  GetGiftCardBalancesGQL,
  GetGiftCardBalancesWithExpiryDataGQL,
  GetGiftCardByCodeGQL,
  GiftCardBalanceByProductId,
  GiftCardNode,
  GiftCardProductIdEnum,
} from '../../../graphql/generated.engine';
import { of, take } from 'rxjs';

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
});
