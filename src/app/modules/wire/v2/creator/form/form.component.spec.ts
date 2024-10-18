import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { WireCreatorFormComponent } from './form.component';
import {
  WireCurrencyOptions,
  WireTokenType,
  WireType,
  WireUpgradePricingOptions,
  WireUpgradeType,
  WireV2Service,
} from '../../wire-v2.service';
import { MockService } from '../../../../../utils/mock';
import { UpgradeOptionInterval } from '../../../../../common/types/upgrade-options.types';
import { Wallet } from '../../../../wallet/components/wallet-v2.service';
import { GiftCardProductIdEnum } from '../../../../../../graphql/generated.engine';

describe('WireCreatorFormComponent', () => {
  let comp: WireCreatorFormComponent;
  let fixture: ComponentFixture<WireCreatorFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WireCreatorFormComponent],
      providers: [
        {
          provide: WireV2Service,
          useValue: MockService(WireV2Service, {
            has: [
              'isUpgrade$',
              'currencyOptions$',
              'type$',
              'isSendingGift$',
              'isReceivingGift$',
              'upgradePricingOptions$',
              'amount$',
              'upgradeType$',
              'upgradeInterval$',
              'isSelfGift$',
              'giftRecipientUsername$',
              'tokenType$',
              'wallet',
              'recurring$',
            ],
            props: {
              isUpgrade$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              currencyOptions$: {
                get: () =>
                  new BehaviorSubject<WireCurrencyOptions>({
                    tokens: false,
                    usd: true,
                    eth: false,
                    btc: false,
                  }),
              },
              type$: {
                get: () => new BehaviorSubject<WireType>('usd'),
              },
              isSendingGift$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              isReceivingGift$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              upgradePricingOptions$: {
                get: () =>
                  new BehaviorSubject<WireUpgradePricingOptions>({
                    monthly: 7,
                    yearly: 60,
                    lifetime: 500,
                  }),
              },
              amount$: {
                get: () => new BehaviorSubject<number>(60),
              },
              tokenType$: {
                get: () => new BehaviorSubject<WireTokenType>(null),
              },
              wallet: {
                get: () => new BehaviorSubject<Wallet>(null),
              },
              recurring$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
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
      ],
    });
    fixture = TestBed.createComponent(WireCreatorFormComponent);
    comp = fixture.componentInstance;
    comp.service.isUpgrade$.next(false);
    (comp as any).service.currencyOptions$.next({
      tokens: false,
      usd: true,
      eth: false,
      btc: false,
    });
    comp.service.type$.next('usd');
    comp.service.isSendingGift$.next(false);
    comp.service.isReceivingGift$.next(false);
    comp.service.upgradePricingOptions$.next({
      monthly: 7,
      yearly: 60,
      lifetime: 500,
    });
    comp.service.amount$.next(60);
    comp.service.tokenType$.next(null);
    comp.service.wallet = null;
    comp.service.recurring$.next(false);
    comp.service.upgradeType$.next('plus');
    comp.service.upgradeInterval$.next('monthly');
    comp.service.isSelfGift$.next(false);
    comp.service.giftRecipientUsername$.next('');
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('getApplicableGiftCardProductId', () => {
    it('should get applicable gift card product id when not sending gift', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      (comp as any).service.getApplicableGiftCardProductId.and.returnValue(
        productId
      );
      comp.service.isSendingGift$.next(false);

      expect(comp.getApplicableGiftCardProductId()).toBe(productId);
    });

    it('should get applicable gift card product id when not sending gift', () => {
      const productId: GiftCardProductIdEnum = GiftCardProductIdEnum.Plus;
      (comp as any).service.getApplicableGiftCardProductId.and.returnValue(
        productId
      );
      comp.service.isSendingGift$.next(true);

      expect(comp.getApplicableGiftCardProductId()).toBe(null);
    });
  });
});
