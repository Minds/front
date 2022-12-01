import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { ThemeService } from '../../../../../common/services/theme.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BoostModalService } from '../../boost-modal.service';
import { BoostTab, BoostTokenPaymentMethod } from '../../boost-modal.types';
import { BoostModalPaymentMethodSelectorComponent } from './payment-method-selector.component';

describe('BoostModalPaymentMethodSelectorComponent', () => {
  let comp: BoostModalPaymentMethodSelectorComponent;
  let fixture: ComponentFixture<BoostModalPaymentMethodSelectorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [
          BoostModalPaymentMethodSelectorComponent,
          MockComponent({
            selector: 'm-payments__selectCard',
            inputs: ['selected'],
            outputs: ['selected'],
          }),
        ],
        providers: [
          {
            provide: BoostModalService,
            useValue: MockService(BoostModalService, {
              has: [
                'activeTab$',
                'onchainBalance$',
                'offchainBalance$',
                'tokenPaymentMethod$',
                'cashPaymentMethod$',
              ],
              props: {
                activeTab$: {
                  get: () => new BehaviorSubject<BoostTab>('cash'),
                },
                onchainBalance$: {
                  get: () => new BehaviorSubject<number>(1000),
                },
                offchainBalance$: {
                  get: () => new BehaviorSubject<number>(1000),
                },
                tokenPaymentMethod$: {
                  get: () =>
                    new BehaviorSubject<BoostTokenPaymentMethod>('offchain'),
                },
                cashPaymentMethod$: {
                  get: () => new BehaviorSubject<string>('pay_123'),
                },
              },
            }),
          },
          {
            provide: ThemeService,
            useValue: MockService(BoostModalService, {
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
    fixture = TestBed.createComponent(BoostModalPaymentMethodSelectorComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).service.activeTab$.next('cash');
    (comp as any).service.onchainBalance$.next(1000);
    (comp as any).service.offchainBalance$.next(1000);
    (comp as any).service.tokenPaymentMethod$.next('offchain');
    (comp as any).service.cashPaymentMethod$.next('pay_123');
    (comp as any).theme.isDark$.next(true);

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should be instantiated', () => {
    expect(comp).toBeTruthy();
  });

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
});
