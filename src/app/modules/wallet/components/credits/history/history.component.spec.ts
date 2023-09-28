import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GiftCardService } from '../../../../gift-card/gift-card.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { MockGiftCardNode } from '../../../../../mocks/responses/gift-card.mock';
import {
  GetGiftCardsGQL,
  GiftCardNode,
  GiftCardOrderingEnum,
  GiftCardProductIdEnum,
  GiftCardStatusFilterEnum,
} from '../../../../../../graphql/generated.engine';
import { ThemeService } from '../../../../../common/services/theme.service';
import { MockGiftCardNodeArray } from '../../../../../mocks/responses/gift-card.mock';
import { WalletV2CreditsHistoryComponent } from './history.component';
import * as moment from 'moment';
import { DropdownSelectorSelection } from '../../../../../common/components/dropdown-selector/dropdown-selector.component';

describe('WalletV2CreditsHistoryComponent', () => {
  let fixture: ComponentFixture<WalletV2CreditsHistoryComponent>;
  let comp: WalletV2CreditsHistoryComponent;
  const mockGiftCardStatusFilterParam: string = GiftCardStatusFilterEnum.Active;
  const mockPageInfo: any = {
    hasNextPage: true,
    endCursor: '2',
    startCursor: '',
  };
  const mockPage: any = {
    data: {
      giftCards: {
        edges: MockGiftCardNodeArray.map(card => {
          return {
            node: card,
          };
        }),
        pageInfo: mockPageInfo,
      },
    },
  };
  const giftCardsResponse$ = new BehaviorSubject<any>(mockPage);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletV2CreditsHistoryComponent,
        MockComponent({
          selector: 'm-dropdownSelector',
          inputs: ['filter', 'inlineLabel'],
          outputs: ['selectionMade'],
        }),
      ],
      providers: [
        { provide: GiftCardService, useValue: MockService(GiftCardService) },
        {
          provide: GetGiftCardsGQL,
          useValue: jasmine.createSpyObj<GetGiftCardsGQL>(['watch']),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                get: () => {
                  return { statusFilter: mockGiftCardStatusFilterParam };
                },
              },
            },
            queryParamMap: new BehaviorSubject(convertToParamMap({})),
          },
        },
        { provide: Router, useValue: MockService(Router) },
      ],
    });

    fixture = TestBed.createComponent(WalletV2CreditsHistoryComponent);
    comp = fixture.componentInstance;

    (comp as any).getGiftCardsGQL.watch.and.returnValue({
      refetch: jasmine.createSpy('refetch'),
      fetchMore: jasmine.createSpy('fetchMore'),
      valueChanges: giftCardsResponse$,
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
    (comp as any).getGiftCardsGQL.watch.calls.reset();
  });

  describe('init', () => {
    it('should init transaction query and subscription to updates on init', fakeAsync(() => {
      expect((comp as any).giftCardsQuery).toBeDefined();
      expect((comp as any).giftCardsSubscription).toBeDefined();
    }));

    it('should update data on transaction subscription value change', fakeAsync(() => {
      (comp as any).giftCards$.next(null);
      (comp as any).pageInfo$.next(null);
      (comp as any).loading$.next(true);
      (comp as any).cursor = '';

      (comp as any).giftCardsQuery.valueChanges.next(mockPage);

      expect((comp as any).loading$.getValue()).toBeFalse();
      expect((comp as any).pageInfo$.getValue()).toEqual(mockPageInfo);
      expect((comp as any).giftCards$.getValue()).toEqual(
        MockGiftCardNodeArray
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
      expect((comp as any).giftCardsQuery.fetchMore).toHaveBeenCalledWith({
        variables: {
          after: (comp as any).cursor,
        },
      });
      expect((comp as any).fetchMoreInProgress$.getValue()).toBeFalse();
    }));
  });

  describe('trackByFn', () => {
    it('should return payment id for track by function', () => {
      const giftCard: GiftCardNode = MockGiftCardNode;
      expect(comp.trackByFn(0, giftCard)).toBe(giftCard.guid);
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

  describe('onStatusFilterChanged', () => {
    it('should navigate on status filter change', () => {
      const dropdownSelectorSelection: DropdownSelectorSelection = {
        filterId: GiftCardStatusFilterEnum.Active,
        option: {
          id: GiftCardStatusFilterEnum.Active,
          label: 'Active',
        },
      };
      comp.onStatusFilterChanged(dropdownSelectorSelection);
      expect((comp as any).router.navigate).toHaveBeenCalledWith([], {
        queryParams: { statusFilter: GiftCardStatusFilterEnum.Active },
        queryParamsHandling: 'merge',
      });
    });
  });

  describe('setupParamChangeSubscription', () => {
    it('should refetch on query param change to expired', () => {
      (comp as any).route.queryParamMap.next(
        convertToParamMap({ statusFilter: GiftCardStatusFilterEnum.Expired })
      );
      expect((comp as any).giftCardsQuery.refetch).toHaveBeenCalledWith({
        statusFilter: GiftCardStatusFilterEnum.Expired,
        ordering: GiftCardOrderingEnum.ExpiringDesc,
      });
    });

    it('should refetch on query param change to active', () => {
      (comp as any).route.queryParamMap.next(
        convertToParamMap({ statusFilter: GiftCardStatusFilterEnum.Active })
      );
      expect((comp as any).giftCardsQuery.refetch).toHaveBeenCalledWith({
        statusFilter: GiftCardStatusFilterEnum.Active,
        ordering: GiftCardOrderingEnum.ExpiringAsc,
      });
    });
  });

  describe('getProductNameByProductId', () => {
    it('should get product name by product id', () => {
      comp.getProductNameByProductId(GiftCardProductIdEnum.Boost);
      expect(
        (comp as any).giftCardService.getProductNameByProductId
      ).toHaveBeenCalledWith(GiftCardProductIdEnum.Boost);
    });
  });
});
