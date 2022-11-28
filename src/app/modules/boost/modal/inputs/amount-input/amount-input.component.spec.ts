import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MockService } from '../../../../../utils/mock';
import { BoostModalService } from '../../boost-modal.service';
import { BoostImpressionRates, BoostTab } from '../../boost-modal.types';
import { BoostModalAmountInputComponent } from './amount-input.component';

describe('BoostModalAmountInputComponent', () => {
  let comp: BoostModalAmountInputComponent;
  let fixture: ComponentFixture<BoostModalAmountInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [BoostModalAmountInputComponent],
        providers: [
          {
            provide: BoostModalService,
            useValue: MockService(BoostModalService, {
              has: [
                'impressions$',
                'currencyAmount$',
                'impressionRates$',
                'activeTab$',
              ],
              props: {
                impressions$: { get: () => new BehaviorSubject<number>(1000) },
                currencyAmount$: { get: () => new BehaviorSubject<number>(10) },
                impressionRates$: {
                  get: () =>
                    new BehaviorSubject<BoostImpressionRates>({
                      tokens: 2000,
                      cash: 1000,
                    }),
                },
                activeTab$: {
                  get: () => new BehaviorSubject<BoostTab>('cash'),
                },
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostModalAmountInputComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).service.impressions$.next(1000);
    (comp as any).service.currencyAmount$.next(10);
    (comp as any).service.impressionRates$.next({
      tokens: 2000,
      cash: 1000,
    });
    (comp as any).service.activeTab$.next('cash');

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

  it('should setup form controls on impression rate change', fakeAsync(() => {
    (comp as any).service.impressionRates$.next({
      tokens: 100,
      cash: 100,
    });
    tick();
    expect(comp.form.controls.currencyAmount.value).toBe(25);
  }));

  it('should setup form controls on impression rate change', fakeAsync(() => {
    (comp as any).service.currencyAmount$.next(250);
    tick();
    expect(comp.form.controls.impressions.value).toBe(2500);
  }));

  it('should setup subscriptions on active tab change', fakeAsync(() => {
    for (let subscription of (comp as any).amountInputSubscriptions) {
      subscription.unsubscribe();
    }
    (comp as any).amountInputSubscriptions = [];

    comp.activeTab$.next('tokens');
    tick();

    expect((comp as any).amountInputSubscriptions.length).toBe(8);
  }));
});
