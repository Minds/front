import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  ControlValueAccessor,
  UntypedFormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Component, Input } from '@angular/core';
import { BoostModalV2Service } from '../../../../services/boost-modal-v2.service';
import {
  BoostPaymentCategory,
  EstimatedReach,
} from '../../../../boost-modal-v2.types';
import { MockService } from '../../../../../../../utils/mock';
import { BoostModalV2BudgetTabComponent } from './tab.component';

@Component({
  selector: 'm-formInput__sliderV2',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useValue: {
        writeValue: () => {},
        registerOnChange: () => {},
        registerOnTouched: () => {},
      },
      multi: true,
    },
  ],
})
class FormInputSliderV2MockComponent implements ControlValueAccessor {
  // max value selectable with slider.
  @Input() public max: number = 100;

  // min value selectable with slider.
  @Input() public min: number = 0;

  // gap between steps on slider.
  @Input() public step: number = 1;

  writeValue(obj: any) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
  setDisabledState(isDisabled: boolean) {}
}

describe('BoostModalV2BudgetTabComponent', () => {
  let comp: BoostModalV2BudgetTabComponent;
  let fixture: ComponentFixture<BoostModalV2BudgetTabComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [
          BoostModalV2BudgetTabComponent,
          FormInputSliderV2MockComponent,
        ],
        providers: [
          {
            provide: BoostModalV2Service,
            useValue: MockService(BoostModalV2Service, {
              getConfig() {
                return {
                  bid_increments: {
                    cash: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 200, 300],
                    tokens: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 200, 300],
                  },
                };
              },

              has: ['dailyBudget$', 'duration$', 'estimatedReach$'],
              props: {
                dailyBudget$: { get: () => new BehaviorSubject<number>(10) },
                duration$: { get: () => new BehaviorSubject<number>(3) },
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
              },
            }),
          },
          UntypedFormBuilder,
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostModalV2BudgetTabComponent);
    comp = fixture.componentInstance;

    (comp as any).paymentCategory = BoostPaymentCategory.CASH;
    (comp as any).minDailyBudget = 2;
    (comp as any).maxDailyBudget = 100;

    (comp as any).service.dailyBudget$.next(10);
    (comp as any).service.duration$.next(3);
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

  it('should init with initial daily budget and duration', (done: DoneFn) => {
    comp.initialDailyBudget = 10000;
    comp.initialDuration = 30;

    comp.ngOnInit();

    combineLatest([
      (comp as any).service.dailyBudget$,
      (comp as any).service.duration$,
    ]).subscribe(([dailyBudget, duration]: any[]) => {
      expect(dailyBudget).toBe(10000);
      expect(duration).toBe(30);
      done();
    });
  });

  it('should update service on budget value change', (done: DoneFn) => {
    comp.form.controls.dailyBudget.setValue(123);
    (comp as any).service.dailyBudget$.subscribe(val => {
      expect(val).toBe(123);
      done();
    });
  });

  it('should update service on duration value change', (done: DoneFn) => {
    comp.form.controls.duration.setValue(15);
    (comp as any).service.duration$.subscribe(val => {
      expect(val).toBe(15);
      done();
    });
  });

  it('should get duration text as plural days', () => {
    comp.form.controls.duration.setValue(10);
    expect(comp.durationText).toBe('10 days');
  });

  it('should get duration text as singular day', () => {
    comp.form.controls.duration.setValue(1);
    expect(comp.durationText).toBe('1 day');
  });

  it('should calulate payment amount for cash and display it as text', () => {
    comp.form.controls.duration.setValue(2);
    comp.form.controls.dailyBudget.setValue(10);
    (comp as any).paymentCategory = BoostPaymentCategory.CASH;
    expect(comp.amountText).toBe('$20');
  });

  it('should calulate payment amount for tokens and display it as text', () => {
    comp.form.controls.duration.setValue(2);
    comp.form.controls.dailyBudget.setValue(10);
    (comp as any).paymentCategory = BoostPaymentCategory.TOKENS;
    expect(comp.amountText).toBe('20 tokens');
  });

  it('should get min daily budget label for cash', () => {
    (comp as any).paymentCategory = BoostPaymentCategory.CASH;
    (comp as any).minDailyBudget = 1;
    expect(comp.minDailyBudgetLabel).toBe('$1');
  });

  it('should get min daily budget label for tokens', () => {
    (comp as any).paymentCategory = BoostPaymentCategory.TOKENS;
    (comp as any).minDailyBudget = 1;
    expect(comp.minDailyBudgetLabel).toBe('1');
  });

  it('should get max daily budget label for cash', () => {
    (comp as any).paymentCategory = BoostPaymentCategory.CASH;
    (comp as any).maxDailyBudget = 1000;
    expect(comp.maxDailyBudgetLabel).toBe('$1000');
  });

  it('should get max daily budget label for tokens', () => {
    (comp as any).paymentCategory = BoostPaymentCategory.TOKENS;
    (comp as any).maxDailyBudget = 1000;
    expect(comp.maxDailyBudgetLabel).toBe('1000');
  });
});
