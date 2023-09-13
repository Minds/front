import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { WireCreatorGiftRecipientInputComponent } from './gift-recipient-input.component';
import { WireUpgradeType, WireV2Service } from '../../../wire-v2.service';
import { MockService } from '../../../../../../utils/mock';
import { BehaviorSubject, Subject } from 'rxjs';
import { UpgradeOptionInterval } from '../../../../../upgrades/upgrade-options.component';
import { GiftRecipientModalLazyService } from './gift-recipient-modal/gift-recipient-modal-lazy.service';
import { GiftCardProductIdEnum } from '../../../../../../../graphql/generated.engine';
import { GiftRecipientGiftDuration } from './gift-recipient-modal/gift-recipient-modal.types';

describe('WireCreatorGiftRecipientInputComponent', () => {
  let comp: WireCreatorGiftRecipientInputComponent;
  let fixture: ComponentFixture<WireCreatorGiftRecipientInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WireCreatorGiftRecipientInputComponent],
      providers: [
        {
          provide: WireV2Service,
          useValue: MockService(WireV2Service, {
            has: [
              'upgradeType$',
              'upgradeInterval$',
              'isSelfGift$',
              'giftRecipientUsername$',
            ],
            props: {
              upgradeType$: {
                get: () => new BehaviorSubject<WireUpgradeType>('plus'),
              },
              upgradeInterval$: {
                get: () =>
                  new BehaviorSubject<UpgradeOptionInterval>('monthly'),
              },
              isSelfGift$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              giftRecipientUsername$: {
                get: () => new BehaviorSubject<string>(''),
              },
            },
          }),
        },
        {
          provide: GiftRecipientModalLazyService,
          useValue: MockService(GiftRecipientModalLazyService, {
            has: ['username$', 'isSelfGift$'],
            props: {
              username$: {
                get: () => new Subject<string>(),
              },
              isSelfGift$: {
                get: () => new Subject<UpgradeOptionInterval>(),
              },
            },
          }),
        },
      ],
    });
    fixture = TestBed.createComponent(WireCreatorGiftRecipientInputComponent);
    comp = fixture.componentInstance;

    comp.service.upgradeType$.next('plus');
    comp.service.upgradeInterval$.next('monthly');
    comp.service.isSelfGift$.next(false);
    comp.service.giftRecipientUsername$.next('');
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      comp.ngOnInit();
    });

    afterEach(() => {
      comp.ngOnDestroy();
    });

    it('should call to set gift recipient username when modal emits username', fakeAsync(() => {
      const username: string = 'testUsername';

      comp.giftRecipientModal.username$.next(username);
      tick();

      expect(comp.service.setGiftRecipientUsername).toHaveBeenCalledWith(
        username
      );
    }));

    it('should call to set isSelfGift when modal emits that it is a self gift', fakeAsync(() => {
      const isSelfGift: boolean = true;

      comp.giftRecipientModal.isSelfGift$.next(isSelfGift);
      tick();

      expect(comp.service.setIsSelfGift).toHaveBeenCalledWith(isSelfGift);
    }));
  });

  describe('onRecipientInputClick', () => {
    it('should call to open the gift recipient modal for a year of plus', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'plus';
      const upgradeInterval: UpgradeOptionInterval = 'yearly';
      const product: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const duration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.YEAR;
      const recipientUsername: string = null;
      const isSelfGift: boolean = null;

      comp.service.upgradeType$.next(upgradeType);
      comp.service.upgradeInterval$.next(upgradeInterval);
      comp.recipientUsername$.next(recipientUsername);
      comp.isSelfGift$.next(isSelfGift);

      comp.onRecipientInputClick();
      tick();

      expect((comp as any).giftRecipientModal.open).toHaveBeenCalledWith(
        product,
        duration,
        recipientUsername,
        isSelfGift
      );
    }));

    it('should call to open the gift recipient modal for a month of plus', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'plus';
      const upgradeInterval: UpgradeOptionInterval = 'monthly';
      const product: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const duration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.MONTH;
      const recipientUsername: string = null;
      const isSelfGift: boolean = null;

      comp.service.upgradeType$.next(upgradeType);
      comp.service.upgradeInterval$.next(upgradeInterval);
      comp.recipientUsername$.next(recipientUsername);
      comp.isSelfGift$.next(isSelfGift);

      comp.onRecipientInputClick();
      tick();

      expect((comp as any).giftRecipientModal.open).toHaveBeenCalledWith(
        product,
        duration,
        recipientUsername,
        isSelfGift
      );
    }));

    it('should call to open the gift recipient modal for a year of Pro', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'pro';
      const upgradeInterval: UpgradeOptionInterval = 'yearly';
      const product: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const duration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.YEAR;
      const recipientUsername: string = null;
      const isSelfGift: boolean = null;

      comp.service.upgradeType$.next(upgradeType);
      comp.service.upgradeInterval$.next(upgradeInterval);
      comp.recipientUsername$.next(recipientUsername);
      comp.isSelfGift$.next(isSelfGift);

      comp.onRecipientInputClick();
      tick();

      expect((comp as any).giftRecipientModal.open).toHaveBeenCalledWith(
        product,
        duration,
        recipientUsername,
        isSelfGift
      );
    }));

    it('should call to open the gift recipient modal for a month of Pro', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'pro';
      const upgradeInterval: UpgradeOptionInterval = 'monthly';
      const product: GiftCardProductIdEnum = GiftCardProductIdEnum.Pro;
      const duration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.MONTH;
      const recipientUsername: string = null;
      const isSelfGift: boolean = null;

      comp.service.upgradeType$.next(upgradeType);
      comp.service.upgradeInterval$.next(upgradeInterval);
      comp.recipientUsername$.next(recipientUsername);
      comp.isSelfGift$.next(isSelfGift);

      comp.onRecipientInputClick();
      tick();

      expect((comp as any).giftRecipientModal.open).toHaveBeenCalledWith(
        product,
        duration,
        recipientUsername,
        isSelfGift
      );
    }));

    it('should call to open the gift recipient modal with already set username', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'plus';
      const upgradeInterval: UpgradeOptionInterval = 'yearly';
      const product: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const duration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.YEAR;
      const recipientUsername: string = 'testacc';
      const isSelfGift: boolean = null;

      comp.service.upgradeType$.next(upgradeType);
      comp.service.upgradeInterval$.next(upgradeInterval);
      comp.recipientUsername$.next(recipientUsername);
      comp.isSelfGift$.next(isSelfGift);

      comp.onRecipientInputClick();
      tick();

      expect((comp as any).giftRecipientModal.open).toHaveBeenCalledWith(
        product,
        duration,
        recipientUsername,
        isSelfGift
      );
    }));

    it('should call to open the gift recipient modal with already set self gift mode', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'plus';
      const upgradeInterval: UpgradeOptionInterval = 'yearly';
      const product: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      const duration: GiftRecipientGiftDuration =
        GiftRecipientGiftDuration.YEAR;
      const recipientUsername: string = '';
      const isSelfGift: boolean = true;

      comp.service.upgradeType$.next(upgradeType);
      comp.service.upgradeInterval$.next(upgradeInterval);
      comp.recipientUsername$.next(recipientUsername);
      comp.isSelfGift$.next(isSelfGift);

      comp.onRecipientInputClick();
      tick();

      expect((comp as any).giftRecipientModal.open).toHaveBeenCalledWith(
        product,
        duration,
        recipientUsername,
        isSelfGift
      );
    }));
  });
});
