import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject, take } from 'rxjs';
import { AffiliatesShareModalService } from '../../services/share-modal.service';
import {
  AffiliatesMetrics,
  AffiliatesMetricsService,
} from '../../services/affiliates-metrics.service';
import { AffiliatesEarningsComponent } from './earnings.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('AffiliatesEarningsComponent', () => {
  let comp: AffiliatesEarningsComponent;
  let fixture: ComponentFixture<AffiliatesEarningsComponent>;

  const defaultMetrics: AffiliatesMetrics = {
    user_guid: '123',
    amount_cents: 1.23,
    amount_usd: 123,
    amount_tokens: 2,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          AffiliatesEarningsComponent,
          MockComponent({
            selector: 'm-button',
          }),
        ],
        providers: [
          {
            provide: AffiliatesShareModalService,
            useValue: MockService(AffiliatesShareModalService),
          },
          {
            provide: AffiliatesMetricsService,
            useValue: MockService(AffiliatesMetricsService, {
              has: ['metrics$', 'loading$', 'error$'],
              props: {
                metrics$: {
                  get: () =>
                    new BehaviorSubject<AffiliatesMetrics>(defaultMetrics),
                },
                loading$: { get: () => new BehaviorSubject<boolean>(false) },
                error$: { get: () => new BehaviorSubject<boolean>(false) },
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(AffiliatesEarningsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).metrics.metrics$.next(defaultMetrics);
    (comp as any).metrics.loading$.next(false);
    (comp as any).metrics.error$.next(false);
    comp.referrerUsername = 'testUser';

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

  it('should get total earnings from service when whole number greater than 0', (done: DoneFn) => {
    const amount: number = 210;
    let metrics: AffiliatesMetrics = defaultMetrics;
    metrics.amount_usd = amount;

    (comp as any).totalEarnings$
      .pipe(take(1))
      .subscribe((totalEarnings: number): void => {
        expect(totalEarnings).toBe(amount);
        done();
      });
  });

  it('should get total earnings from service when fractional number', (done: DoneFn) => {
    const amount: number = 210.11;
    let metrics: AffiliatesMetrics = defaultMetrics;
    metrics.amount_usd = amount;

    (comp as any).totalEarnings$
      .pipe(take(1))
      .subscribe((totalEarnings: number): void => {
        expect(totalEarnings).toBe(amount);
        done();
      });
  });

  it('should get total earnings from service when value is 0', (done: DoneFn) => {
    const amount: number = 0;
    let metrics: AffiliatesMetrics = defaultMetrics;
    metrics.amount_usd = amount;

    (comp as any).totalEarnings$
      .pipe(take(1))
      .subscribe((totalEarnings: number): void => {
        expect(totalEarnings).toBe(amount);
        done();
      });
  });

  it('should get loading state from service', (done: DoneFn) => {
    (comp as any).metrics.loading$.next(true);
    (comp as any).metricsLoading$
      .pipe(take(1))
      .subscribe((loading: boolean): void => {
        expect(loading).toBe(true);
        done();
      });
  });

  it('should get error state from service', (done: DoneFn) => {
    (comp as any).metrics.error$.next(true);
    (comp as any).metricsError$
      .pipe(take(1))
      .subscribe((error: boolean): void => {
        expect(error).toBe(true);
        done();
      });
  });

  it('should open the share modal', fakeAsync(() => {
    const username: string = 'testUser';
    comp.referrerUsername = username;

    comp.openShareModal();
    tick();

    expect((comp as any).affiliatesShareModalService.open).toHaveBeenCalledWith(
      {
        referrerUsername: username,
        earnMethod: 'affiliate',
      }
    );
  }));

  it('should show loading ellipsis in earnings title when loading', () => {
    (comp as any).metrics.loading$.next(true);
    fixture.detectChanges();

    const titleAmountEl = fixture.nativeElement.querySelector(
      '.m-affiliatesEarnings__titleAmount'
    );
    expect(titleAmountEl).toBeTruthy();
    expect(titleAmountEl.textContent.trim()).toBe('...');
  });

  it('should show $0.00 in earnings when amount is 0', () => {
    const amount: number = 0;
    let metrics: AffiliatesMetrics = defaultMetrics;
    metrics.amount_usd = amount;

    (comp as any).metrics.loading$.next(false);
    (comp as any).metrics.error$.next(false);
    (comp as any).metrics.metrics$.next(metrics);
    fixture.detectChanges();

    const titleAmountEl = fixture.nativeElement.querySelector(
      '.m-affiliatesEarnings__titleAmount'
    );
    expect(titleAmountEl).toBeTruthy();
    expect(titleAmountEl.textContent.trim()).toBe('$0.00');
  });

  it('should show $1.23 in earnings title when amount is 1.23', () => {
    const amount: number = 1.23;
    let metrics: AffiliatesMetrics = defaultMetrics;
    metrics.amount_usd = amount;

    (comp as any).metrics.loading$.next(false);
    (comp as any).metrics.error$.next(false);
    (comp as any).metrics.metrics$.next(metrics);
    fixture.detectChanges();

    const titleAmountEl = fixture.nativeElement.querySelector(
      '.m-affiliatesEarnings__titleAmount'
    );
    expect(titleAmountEl).toBeTruthy();
    expect(titleAmountEl.textContent.trim()).toBe('$1.23');
  });

  it('should show $1.00 in earnings title when amount is 1', () => {
    const amount: number = 1;
    let metrics: AffiliatesMetrics = defaultMetrics;
    metrics.amount_usd = amount;

    (comp as any).metrics.loading$.next(false);
    (comp as any).metrics.error$.next(false);
    (comp as any).metrics.metrics$.next(metrics);
    fixture.detectChanges();

    const titleAmountEl = fixture.nativeElement.querySelector(
      '.m-affiliatesEarnings__titleAmount'
    );
    expect(titleAmountEl).toBeTruthy();
    expect(titleAmountEl.textContent.trim()).toBe('$1.00');
  });

  it('should show loading error message in earnings title on error', () => {
    (comp as any).metrics.loading$.next(false);
    (comp as any).metrics.error$.next(true);
    fixture.detectChanges();

    const titleAmountEl = fixture.nativeElement.querySelector(
      '.m-affiliatesEarnings__titleAmount'
    );
    expect(titleAmountEl).toBeTruthy();
    expect(titleAmountEl.textContent.trim()).toBe(
      'Currently unable to calculate'
    );
  });
});
