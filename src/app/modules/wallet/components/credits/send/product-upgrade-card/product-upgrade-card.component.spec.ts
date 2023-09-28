import {
  TestBed,
  ComponentFixture,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { WalletV2CreditsProductUpgradeCardComponent } from './product-upgrade-card.component';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { WirePaymentHandlersService } from '../../../../../wire/wire-payment-handlers.service';
import { ModalService } from '../../../../../../services/ux/modal.service';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { CDN_ASSETS_URL } from '../../../../../../common/injection-tokens/url-injection-tokens';
import { mockUpgradesConfig } from '../../../../../gift-card/gift-card.service.spec';
import { GiftCardProductIdEnum } from '../../../../../../../graphql/generated.engine';
import { WireCreatorComponent } from '../../../../../wire/v2/creator/wire-creator.component';
import userMock from '../../../../../../mocks/responses/user.mock';

describe('WalletV2CreditsProductUpgradeCardComponent', () => {
  let fixture: ComponentFixture<WalletV2CreditsProductUpgradeCardComponent>;
  let comp: WalletV2CreditsProductUpgradeCardComponent;

  beforeEach(() => {
    const configMock: jasmine.SpyObj<any> = MockService(ConfigsService);
    configMock.get.and.returnValue(mockUpgradesConfig);

    TestBed.configureTestingModule({
      declarations: [
        WalletV2CreditsProductUpgradeCardComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'solid', 'size'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        { provide: ModalService, useValue: MockService(ModalService) },
        {
          provide: WirePaymentHandlersService,
          useValue: MockService(WirePaymentHandlersService),
        },
        { provide: ConfigsService, useValue: configMock },
        { provide: CDN_ASSETS_URL, useValue: 'localhost:4200/static/en/' },
      ],
    });

    fixture = TestBed.createComponent(
      WalletV2CreditsProductUpgradeCardComponent
    );
    comp = fixture.componentInstance;

    (comp as any).giftType = GiftCardProductIdEnum.Plus;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('isPlus', () => {
    it('should determine when gift type is Plus', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Plus;
      expect((comp as any).isPlus).toBeTrue();
    });

    it('should determine when gift type is NOT Plus', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Pro;
      expect((comp as any).isPlus).toBeFalse();
    });
  });

  describe('isPro', () => {
    it('should determine when gift type is Pro', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Pro;
      expect((comp as any).isPro).toBeTrue();
    });

    it('should determine when gift type is NOT Pro', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Plus;
      expect((comp as any).isPro).toBeFalse();
    });
  });

  describe('getTitle', () => {
    it('should get title for Plus', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Plus;
      expect(comp.getTitle()).toBe('Minds+');
    });

    it('should get title for Pro', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Pro;
      expect(comp.getTitle()).toBe('Minds Pro');
    });
  });

  describe('getPricingTiers', () => {
    it('should get pricing tiers for Plus', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Plus;
      expect(comp.getPricingTiers()).toBe((comp as any).pricingTiers.PLUS);
    });

    it('should get pricing tiers for Pro', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Pro;
      expect(comp.getPricingTiers()).toBe((comp as any).pricingTiers.PRO);
    });
  });

  describe('getBenefits', () => {
    it('should get benefits for Plus', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Plus;
      expect(comp.getBenefits()).toBe((comp as any).benefits.PLUS);
    });

    it('should get benefits for Pro', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Pro;
      expect(comp.getBenefits()).toBe((comp as any).benefits.PRO);
    });
  });

  describe('getButtonText', () => {
    it('should get button text for Plus', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Plus;
      expect(comp.getButtonText()).toBe('Gift Minds+');
    });

    it('should get button text for Pro', () => {
      (comp as any).giftType = GiftCardProductIdEnum.Pro;
      expect(comp.getButtonText()).toBe('Gift Pro');
    });
  });

  describe('onActionButtonClick', () => {
    it('should present wire modal for Plus gifting', fakeAsync(() => {
      (comp as any).giftType = GiftCardProductIdEnum.Plus;
      (comp as any).wirePaymentHandlers.get
        .withArgs('plus')
        .and.returnValue(userMock);

      comp.onActionButtonClick();
      tick();

      expect((comp as any).modalService.present).toHaveBeenCalledWith(
        WireCreatorComponent,
        jasmine.objectContaining({
          size: 'lg',
          data: {
            isSendingGift: true,
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

    it('should present wire modal for Pro gifting', fakeAsync(() => {
      (comp as any).giftType = GiftCardProductIdEnum.Pro;
      (comp as any).wirePaymentHandlers.get
        .withArgs('pro')
        .and.returnValue(userMock);

      comp.onActionButtonClick();
      tick();

      expect((comp as any).modalService.present).toHaveBeenCalledWith(
        WireCreatorComponent,
        jasmine.objectContaining({
          size: 'lg',
          data: {
            isSendingGift: true,
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
  });
});
