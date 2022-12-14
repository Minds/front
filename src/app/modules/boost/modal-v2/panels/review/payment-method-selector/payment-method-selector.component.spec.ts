import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import {
  BoostPaymentCategory,
  BoostPaymentMethod,
  BoostPaymentMethodId,
} from '../../../boost-modal-v2.types';
import { TokenBalanceService } from '../../../../../wallet/tokens/onboarding/balance.service';
import { ThemeService } from '../../../../../../common/services/theme.service';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { BoostModalV2PaymentMethodSelectorComponent } from './payment-method-selector.component';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { BoostModalV2Service } from '../../../services/boost-modal-v2.service';

describe('BoostModalV2PaymentMethodSelectorComponent', () => {
  let comp: BoostModalV2PaymentMethodSelectorComponent;
  let fixture: ComponentFixture<BoostModalV2PaymentMethodSelectorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          BoostModalV2PaymentMethodSelectorComponent,
          MockComponent({
            selector: 'm-payments__selectCard',
            inputs: ['selected'],
            outputs: ['selected'],
          }),
        ],
        providers: [
          {
            provide: BoostModalV2Service,
            useValue: MockService(BoostModalV2Service, {
              has: ['paymentCategory$', 'paymentMethod$', 'paymentMethodId$'],
              props: {
                paymentCategory$: {
                  get: () =>
                    new BehaviorSubject<BoostPaymentCategory>(
                      BoostPaymentCategory.CASH
                    ),
                },
                paymentMethod$: {
                  get: () =>
                    new BehaviorSubject<BoostPaymentMethod>(
                      BoostPaymentMethod.CASH
                    ),
                },
                paymentMethodId$: {
                  get: () =>
                    new BehaviorSubject<BoostPaymentMethodId>('pm_123'),
                },
              },
            }),
          },
          {
            provide: TokenBalanceService,
            useValue: MockService(TokenBalanceService, {
              has: ['onchain$', 'offchain$'],
              props: {
                onchain$: { get: () => new BehaviorSubject<number>(10) },
                offchain$: { get: () => new BehaviorSubject<number>(100) },
              },
            }),
          },
          {
            provide: ThemeService,
            useValue: MockService(ThemeService, {
              has: ['isDark$'],
              props: {
                isDark$: { get: () => new BehaviorSubject<boolean>(true) },
              },
            }),
          },
          {
            provide: ConfigsService,
            useValue: MockService(ConfigsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(
      BoostModalV2PaymentMethodSelectorComponent
    );
    comp = fixture.componentInstance;

    (comp as any).service.paymentCategory$.next(BoostPaymentCategory.CASH);
    (comp as any).tokenBalance.onchain$.next(10);
    (comp as any).tokenBalance.offchain$.next(100);
    (comp as any).service.paymentMethod$.next(BoostPaymentMethod.CASH);
    (comp as any).service.paymentMethodId$.next('pay_123');
    (comp as any).theme.isDark$.next(true);

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should fetch token balances when payment category is tokens', fakeAsync(() => {
    (comp as any).tokenBalance.fetch.and.returnValue(of({}));
    comp.paymentCategory$.next(BoostPaymentCategory.TOKENS);
    tick();
    expect((comp as any).tokenBalance.fetch).toHaveBeenCalled();
  }));

  it('should not fetch token balances on init when payment category is cash', fakeAsync(() => {
    comp.paymentCategory$.next(BoostPaymentCategory.CASH);
    tick();
    expect((comp as any).tokenBalance.fetch).not.toHaveBeenCalled();
  }));

  it('should select icon background for light mode', (done: DoneFn) => {
    (comp as any).theme.isDark$.next(false);

    comp.selectBackground$.subscribe(bg => {
      expect(bg).toEqual({
        background:
          "url('nullassets/icons/arrow-drop-down-black.svg') 98% center no-repeat",
      });
      done();
    });
  });

  it('should select icon background for dark mode', (done: DoneFn) => {
    (comp as any).theme.isDark$.next(true);

    comp.selectBackground$.subscribe(bg => {
      expect(bg).toEqual({
        background:
          "url('nullassets/icons/arrow-drop-down-white.svg') 98% center no-repeat",
      });
      done();
    });
  });

  it('should update service on card select', (done: DoneFn) => {
    comp.paymentMethod$.next(BoostPaymentMethod.OFFCHAIN_TOKENS);
    comp.paymentMethodId$.next('pm_321');

    const cardId = 'pm_944';
    comp.onSelectCard(cardId);

    combineLatest([comp.paymentMethod$, comp.paymentMethodId$]).subscribe(
      ([paymentMethod, paymentMethodId]) => {
        expect(paymentMethod).toBe(BoostPaymentMethod.CASH);
        expect(paymentMethodId).toBe(cardId);
        done();
      }
    );
  });
});
