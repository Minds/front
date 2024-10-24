import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject, take } from 'rxjs';
import { BoostPaymentCategory } from '../../boost-modal-v2.types';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { BoostModalV2ReviewComponent } from './review.component';
import {
  BoostAudience,
  BoostModalPanel,
  EstimatedReach,
} from '../../boost-modal-v2.types';
import { BoostGoal } from '../../../boost.types';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IS_TENANT_NETWORK } from '../../../../../common/injection-tokens/tenant-injection-tokens';

describe('BoostModalV2ReviewComponent', () => {
  let comp: BoostModalV2ReviewComponent;
  let fixture: ComponentFixture<BoostModalV2ReviewComponent>;

  const getGoalSection = (): DebugElement =>
    fixture.debugElement.query(By.css('.m-boostModalReview__section--goal'));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        BoostModalV2ReviewComponent,
        MockComponent({
          selector: 'm-boostModalV2__paymentMethodSelector',
        }),
        MockComponent({
          selector: 'm-icon',
          inputs: ['iconId'],
        }),
      ],
      providers: [
        {
          provide: BoostModalV2Service,
          useValue: MockService(BoostModalV2Service, {
            has: [
              'paymentCategory$',
              'audience$',
              'duration$',
              'dailyBudget$',
              'totalPaymentAmountText$',
              'estimatedReach$',
              'activePanel$',
              'goal$',
              'canSetBoostGoal$',
            ],
            props: {
              paymentCategory$: {
                get: () =>
                  new BehaviorSubject<BoostPaymentCategory>(
                    BoostPaymentCategory.CASH
                  ),
              },
              audience$: {
                get: () =>
                  new BehaviorSubject<BoostAudience>(BoostAudience.SAFE),
              },
              duration$: { get: () => new BehaviorSubject<number>(10) },
              dailyBudget$: { get: () => new BehaviorSubject<number>(3) },
              totalPaymentAmountText$: {
                get: () => new BehaviorSubject<string>('$3'),
              },
              estimatedReach$: {
                get: () =>
                  new BehaviorSubject<EstimatedReach>({
                    views: {
                      low: 100,
                      high: 1000,
                    },
                    cpm: {
                      low: 3,
                      high: 15,
                    },
                  }),
              },
              activePanel$: {
                get: () =>
                  new BehaviorSubject<BoostModalPanel>(BoostModalPanel.REVIEW),
              },
              goal$: {
                get: () => new BehaviorSubject<BoostGoal>(BoostGoal.VIEWS),
              },
              canSetBoostGoal$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
            },
          }),
        },
        {
          provide: IS_TENANT_NETWORK,
          useValue: false,
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(BoostModalV2ReviewComponent);
    comp = fixture.componentInstance;

    (comp as any).service.paymentCategory$.next(BoostPaymentCategory.CASH);
    (comp as any).service.audience$.next(BoostAudience.SAFE);
    (comp as any).service.duration$.next(10);
    (comp as any).service.dailyBudget$.next(3);
    (comp as any).service.totalPaymentAmountText$.next('$3');
    (comp as any).service.estimatedReach$.next({
      views: {
        low: 100,
        high: 1000,
      },
      cpm: {
        low: 3,
        high: 15,
      },
    });
    (comp as any).service.activePanel$.next(BoostModalPanel.REVIEW);
    (comp as any).service.goal$.next(BoostGoal.VIEWS);
    (comp as any).service.canSetBoostGoal$.next(true);

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

  it('should get budget and duration text for cash for a singular day', (done: DoneFn) => {
    (comp as any).service.duration$.next(1);
    (comp as any).service.dailyBudget$.next(10);
    (comp as any).service.paymentCategory$.next(BoostPaymentCategory.CASH);

    comp.budgetAndDurationText$.subscribe((val) => {
      expect(val).toBe('$10 per day for 1 day');
      done();
    });
  });

  it('should get budget and duration text for cash for a multiple days', (done: DoneFn) => {
    (comp as any).service.duration$.next(2);
    (comp as any).service.dailyBudget$.next(10);
    (comp as any).service.paymentCategory$.next(BoostPaymentCategory.CASH);

    comp.budgetAndDurationText$.subscribe((val) => {
      expect(val).toBe('$10 per day for 2 days');
      done();
    });
  });

  it('should get budget and duration text for tokens for a singular day', (done: DoneFn) => {
    (comp as any).service.duration$.next(1);
    (comp as any).service.dailyBudget$.next(20);
    (comp as any).service.paymentCategory$.next(BoostPaymentCategory.TOKENS);

    comp.budgetAndDurationText$.subscribe((val) => {
      expect(val).toBe('20 tokens per day for 1 day');
      done();
    });
  });

  it('should get budget and duration text for tokens for a multiple days', (done: DoneFn) => {
    (comp as any).service.duration$.next(2);
    (comp as any).service.dailyBudget$.next(20);
    (comp as any).service.paymentCategory$.next(BoostPaymentCategory.TOKENS);

    comp.budgetAndDurationText$.subscribe((val) => {
      expect(val).toBe('20 tokens per day for 2 days');
      done();
    });
  });

  it('should get estimated reach text from service', (done: DoneFn) => {
    (comp as any).service.estimatedReach$.next({
      views: {
        low: 100,
        high: 1000,
      },
      cpm: {
        low: 3,
        high: 15,
      },
    });

    comp.estimatedReachText$.subscribe((val) => {
      expect(val).toBe('100 - 1000 views');
      done();
    });
  });

  it('should show unknown for estimated reach text if data is not available from service', (done: DoneFn) => {
    (comp as any).service.estimatedReach$.next(null);

    comp.estimatedReachText$.subscribe((val) => {
      expect(val).toBe('unknown');
      done();
    });
  });

  it('should call service to change panel on change panel call', (done: DoneFn) => {
    (comp as any).service.activePanel$.next(BoostModalPanel.REVIEW);
    comp.changePanel(BoostModalPanel.BUDGET);

    (comp as any).service.activePanel$.subscribe((val) => {
      expect(val).toBe(BoostModalPanel.BUDGET);
      done();
    });
  });

  it('should show goal section when goal service says it can be set and there is a goal', () => {
    (comp as any).service.canSetBoostGoal$.next(true);
    (comp as any).service.goal$.next(BoostGoal.VIEWS);
    fixture.detectChanges();
    expect(getGoalSection()).toBeTruthy();
  });

  it('should NOT show goal section when service says a goal cannot be set', () => {
    (comp as any).service.canSetBoostGoal$.next(false);
    (comp as any).service.goal$.next(null);
    fixture.detectChanges();
    expect(getGoalSection()).toBeNull();
  });

  describe('render review section', () => {
    it('should render review section', () => {
      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: false,
      });

      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '[data-ref=boost-modal-v2-audience-section]'
        )
      ).toBeTruthy();
    });

    it('should NOT render review section on tenant networks', () => {
      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: true,
      });

      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '[data-ref=boost-modal-v2-audience-section]'
        )
      ).toBeFalsy();
    });
  });
});
