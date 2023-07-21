import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { WalletV2CreditsTransactionHistoryComponent } from './transaction-history.component';
import {
  GetGiftCardGQL,
  GetGiftCardTransactionsLedgerGQL,
  GiftCardNode,
  GiftCardProductIdEnum,
  GiftCardTransaction,
} from '../../../../../../../graphql/generated.engine';
import { GiftCardService } from '../../../../../gift-card/gift-card.service';
import { MockService } from '../../../../../../utils/mock';
import {
  MockGiftCardNode,
  MockGiftCardTransaction,
  MockGiftCardTransactionArray,
} from '../../../../../../mocks/responses/gift-card.mock';
import * as moment from 'moment';

describe('WalletV2CreditsTransactionHistoryComponent', () => {
  let fixture: ComponentFixture<WalletV2CreditsTransactionHistoryComponent>;
  let comp: WalletV2CreditsTransactionHistoryComponent;
  const mockGiftCardGuidParam: string = '4234567890123456';
  const mockPageInfo: any = {
    hasNextPage: true,
    endCursor: '2',
    startCursor: '',
  };
  const mockPage: any = {
    data: {
      giftCardTransactionLedger: {
        edges: MockGiftCardTransactionArray.map(tx => {
          return {
            node: tx,
          };
        }),
        pageInfo: mockPageInfo,
      },
    },
  };
  const giftCardTransactionsLedgerResponse$ = new BehaviorSubject<any>(
    mockPage
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletV2CreditsTransactionHistoryComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => mockGiftCardGuidParam,
              },
            },
          },
        },

        {
          provide: GetGiftCardGQL,
          useValue: jasmine.createSpyObj<GetGiftCardGQL>(['fetch']),
        },
        {
          provide: GetGiftCardTransactionsLedgerGQL,
          useValue: jasmine.createSpyObj<GetGiftCardTransactionsLedgerGQL>([
            'watch',
          ]),
        },
        { provide: GiftCardService, useValue: MockService(GiftCardService) },
      ],
    });

    fixture = TestBed.createComponent(
      WalletV2CreditsTransactionHistoryComponent
    );
    comp = fixture.componentInstance;

    (comp as any).getGiftCardGQL.fetch
      .withArgs({ guid: mockGiftCardGuidParam })
      .and.returnValue(
        of({
          result: {
            data: {
              giftCard: MockGiftCardNode,
            },
          },
        })
      );

    (comp as any).getGiftCardTransactionsLedgerGQL.watch.and.returnValue({
      fetchMore: jasmine.createSpy('fetchMore'),
      valueChanges: giftCardTransactionsLedgerResponse$,
    });
  });

  beforeEach(fakeAsync(() => {
    comp.ngOnInit();
    tick();
  }));

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  afterEach(() => {
    comp.ngOnDestroy();
    (comp as any).getGiftCardTransactionsLedgerGQL.watch.calls.reset();
    (comp as any).getGiftCardGQL.fetch.calls.reset();
  });

  describe('init', () => {
    it('should init transaction query and subscription to updates on init', fakeAsync(() => {
      expect((comp as any).giftCardTransactionsQuery).toBeDefined();
      expect((comp as any).giftCardSubscription).toBeDefined();
    }));

    it('should update data on transaction subscription value change', fakeAsync(() => {
      (comp as any).giftCardTransactions$.next(null);
      (comp as any).pageInfo$.next(null);
      (comp as any).loading$.next(true);
      (comp as any).cursor = '';

      (comp as any).giftCardTransactionsQuery.valueChanges.next(mockPage);

      expect((comp as any).loading$.getValue()).toBeFalse();
      expect((comp as any).pageInfo$.getValue()).toEqual(mockPageInfo);
      expect((comp as any).giftCardTransactions$.getValue()).toEqual(
        MockGiftCardTransactionArray
      );
      expect((comp as any).cursor).toBe('2');
    }));
  });

  describe('fetchMore', () => {
    it('should fetch more', fakeAsync(() => {
      (comp as any).cursor = '3';
      comp.fetchMore();
      expect((comp as any).fetchMoreInProgress$.getValue()).toBeTrue();
      tick();
      expect(
        (comp as any).giftCardTransactionsQuery.fetchMore
      ).toHaveBeenCalledWith({
        variables: {
          after: (comp as any).cursor,
        },
      });
      expect((comp as any).fetchMoreInProgress$.getValue()).toBeFalse();
    }));
  });

  describe('trackByFn', () => {
    it('should return payment id for track by function', () => {
      const transaction: GiftCardTransaction = MockGiftCardTransaction;
      expect(comp.trackByFn(0, transaction)).toBe(transaction.paymentGuid);
    });
  });

  describe('isExpired', () => {
    it('should check whether a payment IS expired', () => {
      let giftCard: GiftCardNode = MockGiftCardNode;
      giftCard.expiresAt =
        moment()
          .subtract(1, 'day')
          .unix() - 1000;
      expect(comp.isExpired(giftCard)).toBeTrue();
    });

    it('should check whether a payment is NOT expired', () => {
      let giftCard: GiftCardNode = MockGiftCardNode;
      giftCard.expiresAt =
        moment()
          .add(1, 'day')
          .unix() - 1000;
      expect(comp.isExpired(giftCard)).toBeFalse();
    });
  });

  describe('getProductNameByProductId', () => {
    it('should get product name by product id', () => {
      comp.getProductNameByProductId(GiftCardProductIdEnum.Boost);
      expect(
        (comp as any).giftCardService.getProductNameByProductId
      ).toHaveBeenCalledWith(GiftCardProductIdEnum.Boost, false);
    });
  });

  describe('formatTransactions', () => {
    it('should format transactions', () => {
      expect(
        (comp as any).formatTransactions(MockGiftCardTransactionArray, true)
      ).toEqual([
        {
          paymentGuid: '1234567890123451',
          giftCardGuid: '1234567890123452',
          amount: 9.99,
          createdAt: 1689935825,
          refundedAt: null,
          boostGuid: '1234567890123453',
          id: '1',
          giftCardIssuerGuid: '1234567890123454',
          giftCardIssuerName: 'testUser1',
          delta: 'negative',
          superType: 'boost',
          type: 'credit:boost',
          runningTotal: 0,
          displayDate: null,
          displayTime: '11:37 am',
        },
        {
          paymentGuid: '2234567890123451',
          giftCardGuid: '2234567890123452',
          amount: 19.99,
          createdAt: 1689935827,
          refundedAt: null,
          boostGuid: '2234567890123453',
          id: '2',
          giftCardIssuerGuid: '2234567890123454',
          giftCardIssuerName: 'testUser2',
          delta: 'negative',
          superType: 'boost',
          type: 'credit:boost',
          runningTotal: -9.99,
          displayDate: null,
          displayTime: '11:37 am',
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
          delta: 'positive',
          type: 'unknown',
          superType: 'credit:deposit',
          otherUser: {
            avatar: '/icon/3234567890123454/medium',
            username: 'testUser3',
          },
          runningTotal: -29.979999999999997,
          displayDate: null,
          displayTime: '11:37 am',
        },
      ]);
    });
  });
});
