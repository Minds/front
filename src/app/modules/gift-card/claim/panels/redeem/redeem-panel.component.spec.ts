import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { GiftCardClaimRedeemPanelComponent } from './redeem-panel.component';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { GiftCardClaimPanelService } from '../panel.service';
import { GiftCardService } from '../../../gift-card.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BehaviorSubject, of, take, throwError } from 'rxjs';
import {
  GiftCardNode,
  GiftCardProductIdEnum,
} from '../../../../../../graphql/generated.engine';
import { GiftCardClaimPanelEnum } from '../claim-panel.enum';
import { GiftRecipientGiftDuration } from '../../../../wire/v2/creator/form/gift-recipient/gift-recipient-modal/gift-recipient-modal.types';

describe('GiftCardClaimRedeemPanelComponent', () => {
  let comp: GiftCardClaimRedeemPanelComponent;
  let fixture: ComponentFixture<GiftCardClaimRedeemPanelComponent>;
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
  const claimCodeMock: string = 'claimCode123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GiftCardClaimRedeemPanelComponent,
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
            has: ['productId$', 'activePanel$'],
            props: {
              productId$: {
                get: () =>
                  new BehaviorSubject<GiftCardProductIdEnum>(
                    GiftCardProductIdEnum.Boost
                  ),
              },
              activePanel$: {
                get: () =>
                  new BehaviorSubject<GiftCardClaimPanelEnum>(
                    GiftCardClaimPanelEnum.Redeem
                  ),
              },
            },
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                claimCode: claimCodeMock,
              }),
            },
          },
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    });

    fixture = TestBed.createComponent(GiftCardClaimRedeemPanelComponent);
    comp = fixture.componentInstance;

    (comp as any).panelService.activePanel$.next(GiftCardClaimPanelEnum.Redeem);
    (comp as any).panelService.productId$.next(GiftCardProductIdEnum.Boost);
    (comp as any).giftCardClaimInProgress$.next(false);
    (comp as any).claimCode = claimCodeMock;
    comp.giftCardNode$.next(mockGiftCardNode);
  });

  it('should create component', () => {
    expect(comp).toBeTruthy();
  });

  describe('description$', () => {
    it('should get description when productId is Boost', (done: DoneFn) => {
      (comp as any).panelService.productId$.next(GiftCardProductIdEnum.Boost);
      comp.description$.pipe(take(1)).subscribe((description: string) => {
        expect(description).toBe(
          'Boost credits can be used to Boost a post or your channel, which can help increase your reach, grow your subscriber base, and enhance your engagement.'
        );
        done();
      });
    });

    it('should get null description when productId is null', (done: DoneFn) => {
      (comp as any).panelService.productId$.next(null);
      comp.description$.pipe(take(1)).subscribe((description: string) => {
        expect(description).toBeNull();
        done();
      });
    });

    it('should get null description when productId is not yet implemented', (done: DoneFn) => {
      (comp as any).panelService.productId$.next(GiftCardProductIdEnum.Plus);
      comp.description$.pipe(take(1)).subscribe((description: string) => {
        expect(description).toBeNull();
        done();
      });
    });
  });

  describe('isAlreadyClaimed$', () => {
    it('should see if gift card is already claimed because there is a claimed at timestamp', (done: DoneFn) => {
      let giftCardNode: GiftCardNode = mockGiftCardNode;
      giftCardNode.claimedByGuid = null;
      giftCardNode.claimedAt = 1234567890;

      comp.giftCardNode$.next(mockGiftCardNode);

      comp.isAlreadyClaimed$
        .pipe(take(1))
        .subscribe((isAlreadyClaimed: boolean) => {
          expect(isAlreadyClaimed).toBeTrue();
          done();
        });
    });

    it('should see if gift card is already claimed because there is a claimed by guid', (done: DoneFn) => {
      let giftCardNode: GiftCardNode = mockGiftCardNode;
      giftCardNode.claimedByGuid = '4567890123';
      giftCardNode.claimedAt = null;

      comp.giftCardNode$.next(mockGiftCardNode);

      comp.isAlreadyClaimed$
        .pipe(take(1))
        .subscribe((isAlreadyClaimed: boolean) => {
          expect(isAlreadyClaimed).toBeTrue();
          done();
        });
    });

    it('should see if gift card is already claimed because there is a claimed by guid AND claimed at timestamp', (done: DoneFn) => {
      let giftCardNode: GiftCardNode = mockGiftCardNode;
      giftCardNode.claimedByGuid = '4567890123';
      giftCardNode.claimedAt = 1234567890;

      comp.giftCardNode$.next(mockGiftCardNode);

      comp.isAlreadyClaimed$
        .pipe(take(1))
        .subscribe((isAlreadyClaimed: boolean) => {
          expect(isAlreadyClaimed).toBeTrue();
          done();
        });
    });

    it('should see if gift card is NOT already claimed', (done: DoneFn) => {
      let giftCardNode: GiftCardNode = mockGiftCardNode;
      giftCardNode.claimedByGuid = null;
      giftCardNode.claimedAt = null;

      comp.giftCardNode$.next(mockGiftCardNode);

      comp.isAlreadyClaimed$
        .pipe(take(1))
        .subscribe((isAlreadyClaimed: boolean) => {
          expect(isAlreadyClaimed).toBeFalse();
          done();
        });
    });
  });

  describe('ngOnInit', () => {
    it('should call to load gift card by code on init and update local state on success', fakeAsync(() => {
      comp.giftCardNode$.next(null);
      comp.giftCardLoaded$.next(false);

      (comp as any).service.getGiftCardByCode.and.returnValue(
        of(mockGiftCardNode)
      );

      comp.ngOnInit();
      tick();

      expect((comp as any).service.getGiftCardByCode).toHaveBeenCalledWith(
        claimCodeMock
      );
      expect(comp.giftCardNode$.getValue()).toEqual(mockGiftCardNode);
      expect(comp.giftCardLoaded$.getValue()).toBeTrue();
      expect((comp as any).panelService.productId$.getValue()).toBe(
        GiftCardProductIdEnum.Boost
      );
    }));

    it('should call to load gift card by code on init and navigate away with error toast on error', fakeAsync(() => {
      comp.giftCardNode$.next(null);
      comp.giftCardLoaded$.next(false);

      (comp as any).service.getGiftCardByCode.and.returnValue(
        throwError(
          () => new Error('Expected error thrown intentionally - ignore')
        )
      );

      comp.ngOnInit();
      tick();

      expect((comp as any).service.getGiftCardByCode).toHaveBeenCalledWith(
        claimCodeMock
      );
      expect((comp as any).toast.error).toHaveBeenCalledWith(
        'Sorry, we were unable to load your gift card.'
      );
      expect((comp as any).router.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should call to load gift card by code on init and navigate away if no gift card is found', fakeAsync(() => {
      comp.giftCardNode$.next(null);
      comp.giftCardLoaded$.next(false);

      (comp as any).service.getGiftCardByCode.and.returnValue(of(null));

      comp.ngOnInit();
      tick();

      expect((comp as any).service.getGiftCardByCode).toHaveBeenCalledWith(
        claimCodeMock
      );
      expect((comp as any).toast.error).toHaveBeenCalledWith(
        'Sorry, we were unable to load your gift card.'
      );
      expect((comp as any).router.navigate).toHaveBeenCalledWith(['/']);
    }));
  });

  describe('onRedeemClick', () => {
    it('should call to redeem gift card and navigate to success page on success', fakeAsync(() => {
      (comp as any).panelService.activePanel$.next(
        GiftCardClaimPanelEnum.Redeem
      );
      (comp as any).service.claimGiftCard.and.returnValue(of(mockGiftCardNode));

      comp.onRedeemClick();
      tick();

      expect((comp as any).service.claimGiftCard).toHaveBeenCalledWith(
        claimCodeMock
      );
      expect((comp as any).panelService.activePanel$.getValue()).toBe(
        GiftCardClaimPanelEnum.Success
      );
    }));

    it('should call to redeem gift card and show error toast on error', fakeAsync(() => {
      (comp as any).giftCardClaimInProgress$.next(false);
      (comp as any).panelService.activePanel$.next(
        GiftCardClaimPanelEnum.Redeem
      );
      (comp as any).service.claimGiftCard.and.returnValue(
        throwError(
          () => new Error('Expected error thrown intentionally - ignore')
        )
      );

      comp.onRedeemClick();
      tick();

      expect((comp as any).toast.error).toHaveBeenCalledWith(
        'Sorry, something went wrong while claiming your gift card.'
      );
      expect((comp as any).giftCardClaimInProgress$.getValue()).toBeFalse();
      expect((comp as any).service.claimGiftCard).toHaveBeenCalledWith(
        claimCodeMock
      );
      expect((comp as any).panelService.activePanel$.getValue()).toBe(
        GiftCardClaimPanelEnum.Redeem
      );
    }));

    it('should call to redeem gift card and show error toast when no gift card node is returned', fakeAsync(() => {
      (comp as any).giftCardClaimInProgress$.next(false);
      (comp as any).panelService.activePanel$.next(
        GiftCardClaimPanelEnum.Redeem
      );
      (comp as any).service.claimGiftCard.and.returnValue(of(null));

      comp.onRedeemClick();
      tick();

      expect((comp as any).toast.error).toHaveBeenCalledWith(
        'Sorry, something went wrong while claiming your gift card.'
      );
      expect((comp as any).giftCardClaimInProgress$.getValue()).toBeFalse();
      expect((comp as any).service.claimGiftCard).toHaveBeenCalledWith(
        claimCodeMock
      );
      expect((comp as any).panelService.activePanel$.getValue()).toBe(
        GiftCardClaimPanelEnum.Redeem
      );
    }));
  });

  describe('getTitle', () => {
    it('should get the default title for Supermind', () => {
      const largestPurchasableDuration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.MONTH;
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Supermind;
      const amount: number = 10;

      (
        comp as any
      ).service.getLargestPurchasableUpgradeDuration.and.returnValue(
        largestPurchasableDuration
      );

      let giftCardNode: GiftCardNode = {
        ...mockGiftCardNode,
        productId: productId,
        amount: amount,
      };

      comp.giftCardNode$.next(giftCardNode);

      expect(comp.getTitle()).toBe('Claim your gift');
    });

    it('should get the default title for Boost', () => {
      const largestPurchasableDuration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.MONTH;
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Boost;
      const amount: number = 10;

      (
        comp as any
      ).service.getLargestPurchasableUpgradeDuration.and.returnValue(
        largestPurchasableDuration
      );

      let giftCardNode: GiftCardNode = {
        ...mockGiftCardNode,
        productId: productId,
        amount: amount,
      };

      comp.giftCardNode$.next(giftCardNode);

      expect(comp.getTitle()).toBe('Claim your gift');
    });

    it('should get year of Plus when the largest duration is a year', () => {
      const largestPurchasableDuration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.YEAR;
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const amount: number = 10;

      (
        comp as any
      ).service.getLargestPurchasableUpgradeDuration.and.returnValue(
        largestPurchasableDuration
      );

      let giftCardNode: GiftCardNode = {
        ...mockGiftCardNode,
        productId: productId,
        amount: amount,
      };

      comp.giftCardNode$.next(giftCardNode);

      expect(comp.getTitle()).toBe('Claim your 1 year of Minds+ credits');
    });

    it('should get month of Plus when the largest duration is a month', () => {
      const largestPurchasableDuration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.MONTH;
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const amount: number = 10;

      (
        comp as any
      ).service.getLargestPurchasableUpgradeDuration.and.returnValue(
        largestPurchasableDuration
      );

      let giftCardNode: GiftCardNode = {
        ...mockGiftCardNode,
        productId: productId,
        amount: amount,
      };

      comp.giftCardNode$.next(giftCardNode);

      expect(comp.getTitle()).toBe('Claim your 1 month of Minds+ credits');
    });

    it('should get year of Pro when the largest duration is a year', () => {
      const largestPurchasableDuration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.YEAR;
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const amount: number = 10;

      (
        comp as any
      ).service.getLargestPurchasableUpgradeDuration.and.returnValue(
        largestPurchasableDuration
      );

      let giftCardNode: GiftCardNode = {
        ...mockGiftCardNode,
        productId: productId,
        amount: amount,
      };

      comp.giftCardNode$.next(giftCardNode);

      expect(comp.getTitle()).toBe('Claim your 1 year of Minds Pro credits');
    });

    it('should get month of Pro when the largest duration is a month', () => {
      const largestPurchasableDuration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.MONTH;
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const amount: number = 10;

      (
        comp as any
      ).service.getLargestPurchasableUpgradeDuration.and.returnValue(
        largestPurchasableDuration
      );

      let giftCardNode: GiftCardNode = {
        ...mockGiftCardNode,
        productId: productId,
        amount: amount,
      };

      comp.giftCardNode$.next(giftCardNode);

      expect(comp.getTitle()).toBe('Claim your 1 month of Minds Pro credits');
    });
  });
});
