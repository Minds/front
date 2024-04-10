import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { GiftCardService } from '../../../../gift-card/gift-card.service';
import { MockService } from '../../../../../utils/mock';
import {
  MockGiftCardBalanceByProductId,
  MockGiftCardBalanceByProductIdArray,
} from '../../../../../mocks/responses/gift-card.mock';
import {
  PRODUCT_DISPLAY_ORDER,
  WalletV2CreditsSummaryComponent,
} from './summary.component';
import {
  GiftCardBalanceByProductId,
  GiftCardProductIdEnum,
} from '../../../../../../graphql/generated.engine';

describe('WalletV2CreditsSummaryComponent', () => {
  let fixture: ComponentFixture<WalletV2CreditsSummaryComponent>;
  let comp: WalletV2CreditsSummaryComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletV2CreditsSummaryComponent],
      providers: [
        { provide: GiftCardService, useValue: MockService(GiftCardService) },
      ],
    });

    fixture = TestBed.createComponent(WalletV2CreditsSummaryComponent);
    comp = fixture.componentInstance;

    (
      comp as any
    ).giftCardService.getGiftCardBalancesWithExpiryData.and.returnValue(
      of(MockGiftCardBalanceByProductIdArray)
    );
  });

  afterEach(() => {
    comp.ngOnDestroy();
  });

  describe('init', () => {
    it('should init', () => {
      expect(comp).toBeTruthy();
    });

    it('should init and get gift card balances', fakeAsync(() => {
      comp.ngOnInit();
      tick();

      expect(comp.giftCardBalances$.getValue()).toEqual(
        PRODUCT_DISPLAY_ORDER.map(
          (productId: GiftCardProductIdEnum): GiftCardBalanceByProductId =>
            MockGiftCardBalanceByProductIdArray.find(
              (res: GiftCardBalanceByProductId): boolean =>
                res?.productId === productId
            )
        ).filter(Boolean)
      );
      expect((comp as any).getBalancesSubscription).toBeDefined();
    }));
  });

  describe('getProductName', () => {
    it('should get product name by product id', () => {
      comp.getProductName(MockGiftCardBalanceByProductId);
      expect(
        (comp as any).giftCardService.getProductNameByProductId
      ).toHaveBeenCalledWith(MockGiftCardBalanceByProductId.productId);
    });
  });

  describe('trackByFn', () => {
    it('should return payment id for track by function', () => {
      expect(comp.trackByFn(0, MockGiftCardBalanceByProductId)).toBe(
        MockGiftCardBalanceByProductId.productId
      );
    });
  });
});
