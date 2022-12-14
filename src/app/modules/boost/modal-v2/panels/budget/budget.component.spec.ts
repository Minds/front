import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { BoostPaymentCategory } from '../../boost-modal-v2.types';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BoostModalV2BudgetSelectorComponent } from './budget.component';

describe('BoostModalV2BudgetSelectorComponent', () => {
  let comp: BoostModalV2BudgetSelectorComponent;
  let fixture: ComponentFixture<BoostModalV2BudgetSelectorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          BoostModalV2BudgetSelectorComponent,
          MockComponent({
            selector: 'm-boostModalV2__budgetTabBar',
          }),
          MockComponent({
            selector: 'm-boostModalV2__budgetTab',
            inputs: [
              'paymentCategory',
              'minDuration',
              'maxDuration',
              'initialDuration',
              'minDailyBudget',
              'maxDailyBudget',
              'initialDailyBudget',
            ],
          }),
        ],
        providers: [
          {
            provide: BoostModalV2Service,
            useValue: MockService(BoostModalV2Service, {
              has: ['paymentCategory$', 'dailyBudget$', 'duration$'],
              props: {
                paymentCategory$: {
                  get: () =>
                    new BehaviorSubject<BoostPaymentCategory>(
                      BoostPaymentCategory.CASH
                    ),
                },
                dailyBudget$: { get: () => new BehaviorSubject<number>(10) },
                duration$: { get: () => new BehaviorSubject<number>(3) },
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostModalV2BudgetSelectorComponent);
    comp = fixture.componentInstance;

    (comp as any).paymentCategory$.next(BoostPaymentCategory.CASH);

    (comp as any).service.getConfig.and.returnValue({
      min: {
        cash: 100,
        offchain_tokens: 200,
        onchain_tokens: 300,
      },
      max: {
        cash: 100,
        offchain_tokens: 200,
        onchain_tokens: 300,
      },
      duration: {
        min: 1,
        max: 30,
      },
      bid_increments: {
        cash: [1, 2, 3],
        offchain_tokens: [2, 3, 4],
        onchain_tokens: [3, 4, 5],
      },
    });

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
});
