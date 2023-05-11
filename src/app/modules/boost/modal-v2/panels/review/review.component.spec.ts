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
import { BoostGoalsExperimentService } from '../../../../experiments/sub-services/boost-goals-experiment.service';
import { BoostGoal } from '../../../boost.types';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('BoostModalV2ReviewComponent', () => {
  let comp: BoostModalV2ReviewComponent;
  let fixture: ComponentFixture<BoostModalV2ReviewComponent>;

  const getGoalSection = (): DebugElement =>
    fixture.debugElement.query(By.css('.m-boostModalReview__section--goal'));

  beforeEach(
    waitForAsync(() => {
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
                'disabledGoalPanel$',
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
                    new BehaviorSubject<BoostModalPanel>(
                      BoostModalPanel.REVIEW
                    ),
                },
                goal$: {
                  get: () => new BehaviorSubject<BoostGoal>(BoostGoal.VIEWS),
                },
                disabledGoalPanel$: {
                  get: () => new BehaviorSubject<boolean>(false),
                },
              },
            }),
          },
          {
            provide: BoostGoalsExperimentService,
            useValue: MockService(BoostGoalsExperimentService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
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
    (comp as any).service.disabledGoalPanel$.next(false);
    (comp as any).boostGoalsExperiment.isActive.and.returnValue(true);

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

    comp.budgetAndDurationText$.subscribe(val => {
      expect(val).toBe('$10 per day for 1 day');
      done();
    });
  });

  it('should get budget and duration text for cash for a multiple days', (done: DoneFn) => {
    (comp as any).service.duration$.next(2);
    (comp as any).service.dailyBudget$.next(10);
    (comp as any).service.paymentCategory$.next(BoostPaymentCategory.CASH);

    comp.budgetAndDurationText$.subscribe(val => {
      expect(val).toBe('$10 per day for 2 days');
      done();
    });
  });

  it('should get budget and duration text for tokens for a singular day', (done: DoneFn) => {
    (comp as any).service.duration$.next(1);
    (comp as any).service.dailyBudget$.next(20);
    (comp as any).service.paymentCategory$.next(BoostPaymentCategory.TOKENS);

    comp.budgetAndDurationText$.subscribe(val => {
      expect(val).toBe('20 tokens per day for 1 day');
      done();
    });
  });

  it('should get budget and duration text for tokens for a multiple days', (done: DoneFn) => {
    (comp as any).service.duration$.next(2);
    (comp as any).service.dailyBudget$.next(20);
    (comp as any).service.paymentCategory$.next(BoostPaymentCategory.TOKENS);

    comp.budgetAndDurationText$.subscribe(val => {
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

    comp.estimatedReachText$.subscribe(val => {
      expect(val).toBe('100 - 1000 views');
      done();
    });
  });

  it('should show unknown for estimated reach text if data is not available from service', (done: DoneFn) => {
    (comp as any).service.estimatedReach$.next(null);

    comp.estimatedReachText$.subscribe(val => {
      expect(val).toBe('unknown');
      done();
    });
  });

  it('should call service to change panel on change panel call', (done: DoneFn) => {
    (comp as any).service.activePanel$.next(BoostModalPanel.REVIEW);
    comp.changePanel(BoostModalPanel.BUDGET);

    (comp as any).service.activePanel$.subscribe(val => {
      expect(val).toBe(BoostModalPanel.BUDGET);
      done();
    });
  });

  it('should show goal section when goal experiment is ON and a goal is set', () => {
    (comp as any).boostGoalsExperiment.isActive.and.returnValue(true);
    (comp as any).service.goal$.next(BoostGoal.VIEWS);
    fixture.detectChanges();
    expect(getGoalSection()).toBeTruthy();
  });

  it('should NOT show goal section when goal experiment is ON and a goal is NOT set', () => {
    (comp as any).boostGoalsExperiment.isActive.and.returnValue(true);
    (comp as any).service.goal$.next(null);
    fixture.detectChanges();
    expect(getGoalSection()).toBeNull();
  });

  it('should NOT show goal section when goal experiment is OFF', () => {
    (comp as any).boostGoalsExperiment.isActive.and.returnValue(false);
    (comp as any).service.goal$.next(null);
    fixture.detectChanges();
    expect(getGoalSection()).toBeNull();
  });

  it('should determine whether the goal section should be shown', (done: DoneFn) => {
    (comp as any).boostGoalsExperiment.isActive.and.returnValue(true);
    (comp as any).service.goal$.next(BoostGoal.VIEWS);
    (comp as any).service.disabledGoalPanel$.next(false);

    comp.showGoalSection$.pipe(take(1)).subscribe((shouldShow: boolean) => {
      expect(shouldShow).toBeTrue();
      done();
    });
  });

  it('should determine whether the goal section should NOT be shown because experiment is off', (done: DoneFn) => {
    (comp as any).boostGoalsExperiment.isActive.and.returnValue(false);
    (comp as any).service.goal$.next(BoostGoal.VIEWS);
    (comp as any).service.disabledGoalPanel$.next(false);

    comp.showGoalSection$.pipe(take(1)).subscribe((shouldShow: boolean) => {
      expect(shouldShow).toBeFalse();
      done();
    });
  });

  it('should determine whether the goal section should NOT be shown because goal is null', (done: DoneFn) => {
    (comp as any).boostGoalsExperiment.isActive.and.returnValue(true);
    (comp as any).service.goal$.next(null);
    (comp as any).service.disabledGoalPanel$.next(false);

    comp.showGoalSection$.pipe(take(1)).subscribe((shouldShow: boolean) => {
      expect(shouldShow).toBeFalse();
      done();
    });
  });

  it('should determine whether the goal section should NOT be shown because panel is disabled', (done: DoneFn) => {
    (comp as any).boostGoalsExperiment.isActive.and.returnValue(true);
    (comp as any).service.goal$.next(BoostGoal.VIEWS);
    (comp as any).service.disabledGoalPanel$.next(true);

    comp.showGoalSection$.pipe(take(1)).subscribe((shouldShow: boolean) => {
      expect(shouldShow).toBeFalse();
      done();
    });
  });
});
