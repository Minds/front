import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoostConsoleStatsBarComponent } from './stats-bar.component';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { BoostModalV2LazyService } from '../../../../modal-v2/boost-modal-v2-lazy.service';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { Boost, BoostPaymentMethod, BoostState } from '../../../../boost.types';
import { BoostConsoleService } from '../../../services/console.service';
import { BehaviorSubject, take } from 'rxjs';

describe('BoostConsoleStatsBarComponent', () => {
  let component: BoostConsoleStatsBarComponent;
  let fixture: ComponentFixture<BoostConsoleStatsBarComponent>;

  const mockBoost: Boost = {
    guid: '123',
    urn: 'boost:123',
    owner_guid: '345',
    entity_guid: '456',
    entity: { guid: '456' },
    boost_status: 1,
    payment_method: 1,
    payment_tx_id: '567',
    target_location: 1,
    target_suitability: 1,
    payment_amount: 1,
    daily_bid: 1,
    duration_days: 1,
    created_timestamp: 1662715004,
    updated_timestamp: 1662715004,
    approved_timestamp: null,
    summary: {
      views_delivered: 1000,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BoostConsoleStatsBarComponent,
        MockComponent({ selector: 'm-tooltip' }),
      ],
      providers: [
        {
          provide: BoostConsoleService,
          useValue: MockService(BoostConsoleService, {
            has: ['adminContext$'],
            props: {
              adminContext$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: ConfigsService,
          useValue: {
            get: () => {
              return {
                rejection_reasons: [
                  {
                    code: 1,
                    label: '',
                  },
                ],
              };
            },
          },
        },
        {
          provide: BoostModalV2LazyService,
          useValue: MockService(BoostModalV2LazyService),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostConsoleStatsBarComponent);
    component = fixture.componentInstance;

    component.boost = mockBoost;

    (component as any).service.adminContext$.next(false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should determine if a boost is completed', () => {
    component.boost.boost_status = BoostState.COMPLETED;
    expect(component.isBoostCompleted()).toBeTrue();
  });

  it('it should determine if a boost is not completed', () => {
    component.boost.boost_status = BoostState.APPROVED;
    expect(component.isBoostCompleted()).toBeFalse();
  });

  it('it should get cpm string for cash a boost', () => {
    component.boost.payment_method = BoostPaymentMethod.CASH;
    component.boost.summary.views_delivered = 2500;
    component.boost.payment_amount = 2;

    expect(component.getCpmString()).toBe('$0.80');
  });

  it('it should get cpm string for onchain tokens', () => {
    component.boost.payment_method = BoostPaymentMethod.OFFCHAIN_TOKENS;
    component.boost.summary.views_delivered = 5000;
    component.boost.payment_amount = 200;

    expect(component.getCpmString()).toBe('40.00 tokens');
  });

  it('it should get cpm string for offchain tokens', () => {
    component.boost.payment_method = BoostPaymentMethod.ONCHAIN_TOKENS;
    component.boost.summary.views_delivered = 6000;
    component.boost.payment_amount = 100;

    expect(component.getCpmString()).toBe('16.67 tokens');
  });

  it('it should get cpm string for a singular offchain token', () => {
    component.boost.payment_method = BoostPaymentMethod.OFFCHAIN_TOKENS;
    component.boost.summary.views_delivered = 1000;
    component.boost.payment_amount = 1;

    expect(component.getCpmString()).toBe('1.00 token');
  });

  it('it should get cpm string for a singular onchain token', () => {
    component.boost.payment_method = BoostPaymentMethod.ONCHAIN_TOKENS;
    component.boost.summary.views_delivered = 1000;
    component.boost.payment_amount = 1;

    expect(component.getCpmString()).toBe('1.00 token');
  });

  it('it should show unknown for unknown payment method', () => {
    component.boost.payment_method = 4;
    component.boost.summary.views_delivered = 1000;
    component.boost.payment_amount = 1;

    expect(component.getCpmString()).toBe('Unknown');
  });

  it('it should return 0 if there are no views delivered', () => {
    component.boost.payment_method = BoostPaymentMethod.ONCHAIN_TOKENS;
    component.boost.summary.views_delivered = 0;
    component.boost.payment_amount = 1;

    expect(component.getCpmString()).toBe('0.00 tokens');
  });

  it('should show CTA preview when in an admin context', (done: DoneFn) => {
    (component as any).service.adminContext$.next(true);
    component.boost.boost_status = BoostState.PENDING;
    component.boost.goal_button_url = 'https://www.minds.com/';
    component.boostIsPending = true;

    component.showCtaPreview$
      .pipe(take(1))
      .subscribe((showCtaPreview: boolean): void => {
        expect(showCtaPreview).toBeTrue();
        done();
      });
  });

  it('should NOT show CTA preview when NOT in an admin context', (done: DoneFn) => {
    (component as any).service.adminContext$.next(false);
    component.boost.goal_button_url = 'https://www.minds.com/';
    component.boostIsPending = true;

    component.showCtaPreview$
      .pipe(take(1))
      .subscribe((showCtaPreview: boolean): void => {
        expect(showCtaPreview).toBeFalse();
        done();
      });
  });

  it('should NOT show CTA preview when boost is NOT in a pending context', (done: DoneFn) => {
    (component as any).service.adminContext$.next(true);
    component.boost.goal_button_url = 'https://www.minds.com/';
    component.boostIsPending = false;

    component.showCtaPreview$
      .pipe(take(1))
      .subscribe((showCtaPreview: boolean): void => {
        expect(showCtaPreview).toBeFalse();
        done();
      });
  });

  it('should NOT show CTA preview when boost has no goal_button_url', (done: DoneFn) => {
    (component as any).service.adminContext$.next(true);
    component.boost.goal_button_url = undefined;
    component.boostIsPending = true;

    component.showCtaPreview$
      .pipe(take(1))
      .subscribe((showCtaPreview: boolean): void => {
        expect(showCtaPreview).toBeFalse();
        done();
      });
  });
});
