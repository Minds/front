import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { BoostPaymentCategory } from '../../boost-modal-v2.types';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { BoostModalV2ReviewComponent } from './review.component';
import {
  BoostAudience,
  BoostModalPanel,
  EstimatedReach,
} from '../../boost-modal-v2.types';

describe('BoostModalV2ReviewComponent', () => {
  let comp: BoostModalV2ReviewComponent;
  let fixture: ComponentFixture<BoostModalV2ReviewComponent>;

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
                      lower_bound: 10,
                      upper_bound: 1000,
                    }),
                },
                activePanel$: {
                  get: () =>
                    new BehaviorSubject<BoostModalPanel>(
                      BoostModalPanel.REVIEW
                    ),
                },
              },
            }),
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
      lower_bound: 10,
      upper_bound: 1000,
    });
    (comp as any).service.activePanel$.next(BoostModalPanel.REVIEW);

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
      lower_bound: 10,
      upper_bound: 1000,
    });

    comp.estimatedReachText$.subscribe(val => {
      expect(val).toBe('10 - 1000 people');
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
});
