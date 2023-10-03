import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { GiftCardClaimPanelService } from '../panel.service';
import { GiftCardService } from '../../../gift-card.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BehaviorSubject, of, take, throwError } from 'rxjs';
import {
  GiftCardBalanceByProductId,
  GiftCardProductIdEnum,
} from '../../../../../../graphql/generated.engine';
import { GiftCardClaimSuccessPanelComponent } from './success-panel.component';
import { WirePaymentHandlersService } from '../../../../wire/wire-payment-handlers.service';
import { ModalService } from '../../../../../services/ux/modal.service';
import userMock from '../../../../../mocks/responses/user.mock';
import { WireCreatorComponent } from '../../../../wire/v2/creator/wire-creator.component';
import { GiftRecipientGiftDuration } from '../../../../wire/v2/creator/form/gift-recipient/gift-recipient-modal/gift-recipient-modal.types';

describe('GiftCardClaimSuccessPanelComponent', () => {
  let comp: GiftCardClaimSuccessPanelComponent;
  let fixture: ComponentFixture<GiftCardClaimSuccessPanelComponent>;
  const mockGiftCardBalanceByProductId: GiftCardBalanceByProductId = {
    __typename: 'GiftCardBalanceByProductId',
    balance: 9.99,
    productId: GiftCardProductIdEnum.Boost,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GiftCardClaimSuccessPanelComponent,
        MockComponent({
          selector: 'm-giftCard',
          inputs: ['giftCardNode'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'saving', 'disabled'],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
      ],
      providers: [
        { provide: GiftCardService, useValue: MockService(GiftCardService) },
        {
          provide: GiftCardClaimPanelService,
          useValue: MockService(GiftCardClaimPanelService, {
            has: ['productId$'],
            props: {
              productId$: {
                get: () =>
                  new BehaviorSubject<GiftCardProductIdEnum>(
                    GiftCardProductIdEnum.Boost
                  ),
              },
            },
          }),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: ModalService,
          useValue: MockService(ModalService),
        },
        {
          provide: WirePaymentHandlersService,
          useValue: MockService(WirePaymentHandlersService),
        },
      ],
    });

    fixture = TestBed.createComponent(GiftCardClaimSuccessPanelComponent);
    comp = fixture.componentInstance;
    comp.balance$.next(9.99);
    (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Boost);
  });

  it('should create component', () => {
    expect(comp).toBeTruthy();
  });

  describe('productCreditName$', () => {
    it('should get product credit name for Boost product', (done: DoneFn) => {
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Boost);

      (comp as any).productCreditName$
        .pipe(take(1))
        .subscribe((productCreditName: string) => {
          expect(productCreditName).toBe('Boost Credits');
          done();
        });
    });

    it('should get product credit name for Plus product', (done: DoneFn) => {
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Plus);

      (comp as any).productCreditName$
        .pipe(take(1))
        .subscribe((productCreditName: string) => {
          expect(productCreditName).toBe('Minds+ Credits');
          done();
        });
    });

    it('should get product credit name for Pro product', (done: DoneFn) => {
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Pro);

      (comp as any).productCreditName$
        .pipe(take(1))
        .subscribe((productCreditName: string) => {
          expect(productCreditName).toBe('Minds Pro Credits');
          done();
        });
    });

    it('should get product credit name for not yet implemented product', (done: DoneFn) => {
      (comp as any).giftCardPanel.productId$.next(
        GiftCardProductIdEnum.Supermind
      );

      (comp as any).productCreditName$
        .pipe(take(1))
        .subscribe((productCreditName: string) => {
          expect(productCreditName).toBe('Credits');
          done();
        });
    });

    it('should get product credit name for null productId', (done: DoneFn) => {
      (comp as any).giftCardPanel.productId$.next(null);

      (comp as any).productCreditName$
        .pipe(take(1))
        .subscribe((productCreditName: string) => {
          expect(productCreditName).toBe('Credits');
          done();
        });
    });
  });

  describe('actionButtonText$', () => {
    it('should get actionButtonText for Boost product', (done: DoneFn) => {
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Boost);

      (comp as any).actionButtonText$
        .pipe(take(1))
        .subscribe((actionButtonText: string) => {
          expect(actionButtonText).toBe('Create a Boost');
          done();
        });
    });

    it('should get actionButtonText for Plus product', (done: DoneFn) => {
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Plus);

      (comp as any).actionButtonText$
        .pipe(take(1))
        .subscribe((actionButtonText: string) => {
          expect(actionButtonText).toBe('Redeem credits now');
          done();
        });
    });

    it('should get actionButtonText for Pro product', (done: DoneFn) => {
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Pro);

      (comp as any).actionButtonText$
        .pipe(take(1))
        .subscribe((actionButtonText: string) => {
          expect(actionButtonText).toBe('Redeem credits now');
          done();
        });
    });

    it('should get actionButtonText for not yet implemented product', (done: DoneFn) => {
      (comp as any).giftCardPanel.productId$.next(
        GiftCardProductIdEnum.Supermind
      );

      (comp as any).actionButtonText$
        .pipe(take(1))
        .subscribe((actionButtonText: string) => {
          expect(actionButtonText).toBe('View your balances');
          done();
        });
    });

    it('should get actionButtonText for null productId', (done: DoneFn) => {
      (comp as any).giftCardPanel.productId$.next(null);

      (comp as any).actionButtonText$
        .pipe(take(1))
        .subscribe((actionButtonText: string) => {
          expect(actionButtonText).toBe('View your balances');
          done();
        });
    });
  });

  describe('ngOnInit', () => {
    it('should load balances on init', fakeAsync(() => {
      comp.balance$.next(0);
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Boost);
      (comp as any).service.getGiftCardBalances.and.returnValue(
        of([mockGiftCardBalanceByProductId])
      );

      comp.ngOnInit();
      tick();

      expect(comp.balance$.value).toBe(mockGiftCardBalanceByProductId.balance);
    }));

    it('should show error toast if there is an error loading balances on init', fakeAsync(() => {
      comp.balance$.next(0);
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Boost);
      (comp as any).service.getGiftCardBalances.and.returnValue(
        throwError(
          () => new Error('Expected error thrown intentionally - ignore')
        )
      );

      comp.ngOnInit();
      tick();

      expect((comp as any).toast.warn).toHaveBeenCalledWith(
        'Unable to load gift card balance.'
      );
      expect(comp.balance$.getValue()).toBe(0);
    }));

    it('should show error toast if null balances are returned on init', fakeAsync(() => {
      comp.balance$.next(0);
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Boost);
      (comp as any).service.getGiftCardBalances.and.returnValue(null);

      comp.ngOnInit();
      tick();

      expect((comp as any).toast.warn).toHaveBeenCalledWith(
        'Unable to load gift card balance.'
      );
      expect(comp.balance$.getValue()).toBe(0);
    }));

    it('should show error toast if no balances matching the set product id are returned on init', fakeAsync(() => {
      comp.balance$.next(0);
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Plus);
      (comp as any).service.getGiftCardBalances.and.returnValue(
        of([mockGiftCardBalanceByProductId])
      );

      comp.ngOnInit();
      tick();

      expect((comp as any).toast.warn).toHaveBeenCalledWith(
        'Unable to load gift card balance.'
      );
      expect(comp.balance$.getValue()).toBe(0);
    }));
  });

  describe('onActionButtonClick', () => {
    it('should handle action button click when product is Boost', () => {
      (comp as any).giftCardPanel.productId$.next(GiftCardProductIdEnum.Boost);
      comp.onActionButtonClick();

      expect((comp as any).router.navigate).toHaveBeenCalledWith([
        '/boost/boost-console',
      ]);
    });

    it('should handle action button click when product is Plus and the max duration purchasable is a month', fakeAsync(() => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const largestPurchaseableDuration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.MONTH;

      (comp as any).giftCardPanel.productId$.next(productId);
      (comp as any).wirePaymentHandlers.get
        .withArgs('plus')
        .and.returnValue(userMock);
      (comp as any).service.getLargestPurchasableUpgradeDuration
        .withArgs(productId, comp.balance$.getValue())
        .and.returnValue(largestPurchaseableDuration);

      comp.onActionButtonClick();
      tick();

      expect((comp as any).modalService.present).toHaveBeenCalledWith(
        WireCreatorComponent,
        jasmine.objectContaining({
          size: 'lg',
          data: {
            isReceivingGift: true,
            entity: userMock,
            default: {
              type: 'money',
              upgradeType: 'plus',
              upgradeInterval: 'monthly',
            },
            onComplete: jasmine.any(Function),
          },
        })
      );
    }));

    it('should handle action button click when product is Plus and the max duration purchasable is a year', fakeAsync(() => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const largestPurchaseableDuration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.YEAR;

      (comp as any).giftCardPanel.productId$.next(productId);
      (comp as any).wirePaymentHandlers.get
        .withArgs('plus')
        .and.returnValue(userMock);
      (comp as any).service.getLargestPurchasableUpgradeDuration
        .withArgs(productId, comp.balance$.getValue())
        .and.returnValue(largestPurchaseableDuration);

      comp.onActionButtonClick();
      tick();

      expect((comp as any).modalService.present).toHaveBeenCalledWith(
        WireCreatorComponent,
        jasmine.objectContaining({
          size: 'lg',
          data: {
            isReceivingGift: true,
            entity: userMock,
            default: {
              type: 'money',
              upgradeType: 'plus',
              upgradeInterval: 'yearly',
            },
            onComplete: jasmine.any(Function),
          },
        })
      );
    }));

    it('should handle action button click when product is Pro and the max duration purchasable is a month', fakeAsync(() => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const largestPurchaseableDuration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.MONTH;

      (comp as any).giftCardPanel.productId$.next(productId);
      (comp as any).wirePaymentHandlers.get
        .withArgs('pro')
        .and.returnValue(userMock);
      (comp as any).service.getLargestPurchasableUpgradeDuration
        .withArgs(productId, comp.balance$.getValue())
        .and.returnValue(largestPurchaseableDuration);

      comp.onActionButtonClick();
      tick();

      expect((comp as any).modalService.present).toHaveBeenCalledWith(
        WireCreatorComponent,
        jasmine.objectContaining({
          size: 'lg',
          data: {
            isReceivingGift: true,
            entity: userMock,
            default: {
              type: 'money',
              upgradeType: 'pro',
              upgradeInterval: 'monthly',
            },
            onComplete: jasmine.any(Function),
          },
        })
      );
    }));

    it('should handle action button click when product is Pro and the max duration purchasable is a year', fakeAsync(() => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const largestPurchaseableDuration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.YEAR;

      (comp as any).giftCardPanel.productId$.next(productId);
      (comp as any).wirePaymentHandlers.get
        .withArgs('pro')
        .and.returnValue(userMock);
      (comp as any).service.getLargestPurchasableUpgradeDuration
        .withArgs(productId, comp.balance$.getValue())
        .and.returnValue(largestPurchaseableDuration);

      comp.onActionButtonClick();
      tick();

      expect((comp as any).modalService.present).toHaveBeenCalledWith(
        WireCreatorComponent,
        jasmine.objectContaining({
          size: 'lg',
          data: {
            isReceivingGift: true,
            entity: userMock,
            default: {
              type: 'money',
              upgradeType: 'pro',
              upgradeInterval: 'yearly',
            },
            onComplete: jasmine.any(Function),
          },
        })
      );
    }));

    it('should handle action button click when product is not yet supported', () => {
      (comp as any).giftCardPanel.productId$.next(
        GiftCardProductIdEnum.Supermind
      );
      comp.onActionButtonClick();

      expect((comp as any).router.navigate).toHaveBeenCalledWith(['/wallet']);
    });

    it('should handle action button click when product is null', () => {
      (comp as any).giftCardPanel.productId$.next(null);
      comp.onActionButtonClick();

      expect((comp as any).router.navigate).toHaveBeenCalledWith(['/wallet']);
    });
  });

  describe('getViewBalanceUrl', () => {
    it('should get view balance URL', () => {
      expect(comp.getViewBalanceUrl()).toBe('/wallet');
    });
  });
});
