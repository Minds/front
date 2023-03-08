import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoostConsoleStatsBarComponent } from './stats-bar.component';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { BoostModalLazyService } from '../../../../modal/boost-modal-lazy.service';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { Boost, BoostPaymentMethod, BoostState } from '../../../../boost.types';

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
          provide: BoostModalLazyService,
          useValue: MockService(BoostModalLazyService),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostConsoleStatsBarComponent);
    component = fixture.componentInstance;

    component.boost = mockBoost;

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
});
