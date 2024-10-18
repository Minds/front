import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApiService } from '../../../common/api/api.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Session } from '../../../services/session';
import { MockService } from '../../../utils/mock';
import { PlusService } from '../../plus/plus.service';
import { ProService } from '../../pro/pro.service';
import { WalletV2Service } from '../../wallet/components/wallet-v2.service';
import { WireUpgradeType, WireV2Service } from './wire-v2.service';
import { WireService as WireV1Service } from '../wire.service';
import { lastValueFrom, of } from 'rxjs';
import { GiftCardService } from '../../gift-card/gift-card.service';
import { GiftCardProductIdEnum } from '../../../../graphql/generated.engine';
import { UpgradeOptionInterval } from '../../../common/types/upgrade-options.types';

describe('WireV2Service', () => {
  let service: WireV2Service;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [
        WireV2Service,
        { provide: WalletV2Service, useValue: MockService(WalletV2Service) },
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: WireV1Service, useValue: MockService(WireV1Service) },
        { provide: PlusService, useValue: MockService(PlusService) },
        { provide: ProService, useValue: MockService(ProService) },
        { provide: Session, useValue: MockService(Session) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: GiftCardService, useValue: MockService(GiftCardService) },
      ],
    });

    service = TestBed.inject(WireV2Service);

    service.upgrades = {
      plus: {
        lifetime: {
          usd: 100,
          can_have_trail: true,
        },
      },
    };
    service.upgradeType$.next(null);
    service.upgradeInterval$.next(null);
    service.type$.next('usd');
    service.isUpgrade$.next(false);
    service.isSendingGift$.next(false);
    service.isReceivingGift$.next(false);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setIsSendingGift', () => {
    it('should set isSendingGift', () => {
      service.isSendingGift$.next(false);
      service.setIsSendingGift(true);
      expect(service.isSendingGift$.getValue()).toBe(true);

      service.setIsSendingGift(false);
      expect(service.isSendingGift$.getValue()).toBe(false);
    });
  });

  describe('setIsSelfGift', () => {
    it('should set isSelfGift and unset existing gift recipient username', () => {
      service.isSelfGift$.next(false);
      service.giftRecipientUsername$.next('testUser');

      service.setIsSelfGift(true);

      expect(service.giftRecipientUsername$.getValue()).toBe(null);
      expect(service.isSelfGift$.getValue()).toBe(true);
    });
  });

  describe('setGiftRecipientUsername', () => {
    it('should set giftRecipientUsername and set any true selfGift$ to false ', () => {
      service.isSelfGift$.next(true);
      service.giftRecipientUsername$.next(null);

      service.setGiftRecipientUsername('testUser');

      expect(service.giftRecipientUsername$.getValue()).toBe('testUser');
      expect(service.isSelfGift$.getValue()).toBe(false);
    });
  });

  describe('setIsReceivingGift', () => {
    it('should set isReceivingGift', () => {
      service.isReceivingGift$.next(false);
      service.setIsReceivingGift(true);
      expect(service.isReceivingGift$.getValue()).toBe(true);

      service.setIsReceivingGift(false);
      expect(service.isReceivingGift$.getValue()).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset gift variables on reset', () => {
      service.setIsReceivingGift(true);
      service.setIsSendingGift(true);
      service.setIsSelfGift(true);
      service.setGiftRecipientUsername('testUser');

      service.reset();

      expect(service.isReceivingGift$.getValue()).toBe(false);
      expect(service.isSendingGift$.getValue()).toBe(false);
      expect(service.isSelfGift$.getValue()).toBe(false);
      expect(service.giftRecipientUsername$.getValue()).toBe(null);
    });
  });

  describe('validate', () => {
    it('should return invalid error if sending gift but no recipient is set', () => {
      service.isUpgrade$.next(true);
      service.upgradeType$.next('pro');
      service.userIsPro = true;

      const data = {
        entityGuid: '123456789',
        isSendingGift: true,
        giftRecipientUsername: '',
        isSelfGift: false,
      };

      expect((service as any).validate(data).error).toBe(
        'You must select a gift recipient for non-self gifts'
      );
    });

    it('should return invalid error if sending gift but both username is set and its a self gift', () => {
      service.isUpgrade$.next(true);
      service.upgradeType$.next('pro');
      service.userIsPro = true;

      const data = {
        entityGuid: '123456789',
        isSendingGift: true,
        giftRecipientUsername: 'testUser',
        isSelfGift: true,
      };

      expect((service as any).validate(data).error).toBe(
        'Self gifts cannot have recipient usernames'
      );
    });

    it("should return invalid error if sending gift but it's not an upgrade", () => {
      service.isUpgrade$.next(true);
      service.upgradeType$.next('pro');
      service.userIsPro = true;

      const data = {
        entityGuid: '123456789',
        isSendingGift: true,
        giftRecipientUsername: '',
        isSelfGift: true,
        isUpgrade: false,
      };

      expect((service as any).validate(data).error).toBe(
        'Only upgrades can be gifted'
      );
    });

    it("should return invalid error if it's a gift but not paid for in usd", () => {
      service.isUpgrade$.next(true);
      service.upgradeType$.next('pro');
      service.userIsPro = true;

      const data = {
        entityGuid: '123456789',
        isSendingGift: true,
        giftRecipientUsername: '',
        isSelfGift: true,
        isUpgrade: true,
        type: 'tokens',
      };

      expect((service as any).validate(data).error).toBe(
        'Gifts can only be paid for with cash'
      );
    });

    it("should return invalid error if it's a gift, requested to be recurring", () => {
      service.isUpgrade$.next(true);
      service.upgradeType$.next('pro');
      service.userIsPro = true;

      const data = {
        entityGuid: '123456789',
        isSendingGift: true,
        giftRecipientUsername: '',
        isSelfGift: true,
        isUpgrade: true,
        type: 'usd',
        recurring: true,
      };

      expect((service as any).validate(data).error).toBe(
        'Gifts cannot be recurring'
      );
    });
  });

  describe('submit', () => {
    it('should submit a payment for a gift card when a user is set', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'plus';
      const upgradeTypeMappedProductId: GiftCardProductIdEnum =
        GiftCardProductIdEnum.Plus;
      const amount: number = 60;
      const paymentMethodId: string = 'sk_123';
      const targetUsername: string = '';
      const giftCardGuid: string = '1234567890123456';

      (service as any).giftCardService.createGiftCard.and.returnValue(
        of(giftCardGuid)
      );

      (service as any).wirePayload = {
        entityGuid: '123',
        amount: amount,
        payload: {
          paymentMethodId: paymentMethodId,
        },
      };
      service.isSendingGift$.next(true);
      service.upgradeType$.next(upgradeType);
      service.giftRecipientUsername$.next(targetUsername);

      expectAsync(service.submit()).toBeResolvedTo(true);
      tick();

      expect(
        (service as any).giftCardService.createGiftCard
      ).toHaveBeenCalledWith(
        upgradeTypeMappedProductId,
        amount,
        paymentMethodId,
        { targetUsername: targetUsername }
      );
      expect((service as any).toasterService.success).toHaveBeenCalled();
    }));

    it('should submit a payment for a gift card when a user is NOT set', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'plus';
      const upgradeTypeMappedProductId: GiftCardProductIdEnum =
        GiftCardProductIdEnum.Plus;
      const amount: number = 60;
      const paymentMethodId: string = 'sk_123';
      const targetUsername: string = '';
      const giftCardGuid: string = '1234567890123456';

      (service as any).giftCardService.createGiftCard.and.returnValue(
        of(giftCardGuid)
      );

      (service as any).wirePayload = {
        entityGuid: '123',
        amount: amount,
        payload: {
          paymentMethodId: paymentMethodId,
        },
      };
      service.isSendingGift$.next(true);
      service.upgradeType$.next(upgradeType);
      service.giftRecipientUsername$.next(targetUsername);

      expectAsync(service.submit()).toBeResolvedTo(true);
      tick();

      expect(
        (service as any).giftCardService.createGiftCard
      ).toHaveBeenCalledWith(
        upgradeTypeMappedProductId,
        amount,
        paymentMethodId,
        { targetUsername: targetUsername }
      );
      expect((service as any).toasterService.success).toHaveBeenCalled();
    }));

    it('should submit a payment for a gift card with a month of plus', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'plus';
      const upgradeTypeMappedProductId: GiftCardProductIdEnum =
        GiftCardProductIdEnum.Plus;
      const amount: number = 60;
      const paymentMethodId: string = 'sk_123';
      const targetUsername: string = '';
      const giftCardGuid: string = '1234567890123456';
      const upgradeInterval: UpgradeOptionInterval = 'monthly';

      (service as any).giftCardService.createGiftCard.and.returnValue(
        of(giftCardGuid)
      );

      (service as any).wirePayload = {
        entityGuid: '123',
        amount: amount,
        payload: {
          paymentMethodId: paymentMethodId,
        },
      };
      service.isSendingGift$.next(true);
      service.upgradeType$.next(upgradeType);
      service.giftRecipientUsername$.next(targetUsername);
      service.upgradeInterval$.next(upgradeInterval);

      expectAsync(service.submit()).toBeResolvedTo(true);
      tick();

      expect(
        (service as any).giftCardService.createGiftCard
      ).toHaveBeenCalledWith(
        upgradeTypeMappedProductId,
        amount,
        paymentMethodId,
        { targetUsername: targetUsername }
      );
      expect((service as any).toasterService.success).toHaveBeenCalledWith(
        'Payment Successful! You have gifted 1 month of Minds+'
      );
    }));

    it('should submit a payment for a gift card with a year of plus', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'plus';
      const upgradeTypeMappedProductId: GiftCardProductIdEnum =
        GiftCardProductIdEnum.Plus;
      const amount: number = 60;
      const paymentMethodId: string = 'sk_123';
      const targetUsername: string = '';
      const giftCardGuid: string = '1234567890123456';
      const upgradeInterval: UpgradeOptionInterval = 'yearly';

      (service as any).giftCardService.createGiftCard.and.returnValue(
        of(giftCardGuid)
      );

      (service as any).wirePayload = {
        entityGuid: '123',
        amount: amount,
        payload: {
          paymentMethodId: paymentMethodId,
        },
      };
      service.isSendingGift$.next(true);
      service.upgradeType$.next(upgradeType);
      service.giftRecipientUsername$.next(targetUsername);
      service.upgradeInterval$.next(upgradeInterval);

      expectAsync(service.submit()).toBeResolvedTo(true);
      tick();

      expect(
        (service as any).giftCardService.createGiftCard
      ).toHaveBeenCalledWith(
        upgradeTypeMappedProductId,
        amount,
        paymentMethodId,
        { targetUsername: targetUsername }
      );
      expect((service as any).toasterService.success).toHaveBeenCalledWith(
        'Payment Successful! You have gifted 1 year of Minds+'
      );
    }));

    it('should submit a payment for a gift card with a month of Pro', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'pro';
      const upgradeTypeMappedProductId: GiftCardProductIdEnum =
        GiftCardProductIdEnum.Pro;
      const amount: number = 60;
      const paymentMethodId: string = 'sk_123';
      const targetUsername: string = '';
      const giftCardGuid: string = '1234567890123456';
      const upgradeInterval: UpgradeOptionInterval = 'monthly';

      (service as any).giftCardService.createGiftCard.and.returnValue(
        of(giftCardGuid)
      );

      (service as any).wirePayload = {
        entityGuid: '123',
        amount: amount,
        payload: {
          paymentMethodId: paymentMethodId,
        },
      };
      service.isSendingGift$.next(true);
      service.upgradeType$.next(upgradeType);
      service.giftRecipientUsername$.next(targetUsername);
      service.upgradeInterval$.next(upgradeInterval);

      expectAsync(service.submit()).toBeResolvedTo(true);
      tick();

      expect(
        (service as any).giftCardService.createGiftCard
      ).toHaveBeenCalledWith(
        upgradeTypeMappedProductId,
        amount,
        paymentMethodId,
        { targetUsername: targetUsername }
      );
      expect((service as any).toasterService.success).toHaveBeenCalledWith(
        'Payment Successful! You have gifted 1 month of Minds Pro'
      );
    }));

    it('should submit a payment for a gift card with a year of plus', fakeAsync(() => {
      const upgradeType: WireUpgradeType = 'pro';
      const upgradeTypeMappedProductId: GiftCardProductIdEnum =
        GiftCardProductIdEnum.Pro;
      const amount: number = 60;
      const paymentMethodId: string = 'sk_123';
      const targetUsername: string = '';
      const giftCardGuid: string = '1234567890123456';
      const upgradeInterval: UpgradeOptionInterval = 'yearly';

      (service as any).giftCardService.createGiftCard.and.returnValue(
        of(giftCardGuid)
      );

      (service as any).wirePayload = {
        entityGuid: '123',
        amount: amount,
        payload: {
          paymentMethodId: paymentMethodId,
        },
      };
      service.isSendingGift$.next(true);
      service.upgradeType$.next(upgradeType);
      service.giftRecipientUsername$.next(targetUsername);
      service.upgradeInterval$.next(upgradeInterval);

      expectAsync(service.submit()).toBeResolvedTo(true);
      tick();

      expect(
        (service as any).giftCardService.createGiftCard
      ).toHaveBeenCalledWith(
        upgradeTypeMappedProductId,
        amount,
        paymentMethodId,
        { targetUsername: targetUsername }
      );
      expect((service as any).toasterService.success).toHaveBeenCalledWith(
        'Payment Successful! You have gifted 1 year of Minds Pro'
      );
    }));
  });
});
