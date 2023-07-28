import { TestBed } from '@angular/core/testing';
import { GiftCardService } from './gift-card.service';
import {
  ClaimGiftCardGQL,
  GetGiftCardBalancesGQL,
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
});
