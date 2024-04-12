import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BoostConsoleListItemComponent } from './list-item.component';
import { Boost, BoostPaymentMethod } from '../../../boost.types';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { Session } from '../../../../../services/session';

describe('BoostConsoleListItemComponent', () => {
  let comp: BoostConsoleListItemComponent;
  let fixture: ComponentFixture<BoostConsoleListItemComponent>;

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
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        BoostConsoleListItemComponent,
        MockComponent({
          selector: 'm-chipBadge',
        }),
        MockComponent({
          selector: 'm-activity',
          inputs: [
            'entity',
            'canDelete',
            'displayOptions',
            'autoplayVideo',
            'canRecordAnalytics',
          ],
        }),
        MockComponent({
          selector: 'm-publisherCard',
          inputs: ['publisher', 'showSubscribeButton'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['size'],
        }),
        MockComponent({
          selector: 'm-boostConsole__stateLabel',
          inputs: ['boost'],
        }),
        MockComponent({
          selector: 'm-boostConsole__actionButtons',
          inputs: ['boost'],
        }),
      ],
      providers: [
        {
          provide: Session,
          useValue: MockService(Session),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(BoostConsoleListItemComponent);
    comp = fixture.componentInstance;

    comp.boost = mockBoost;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  describe('amountBadgeText', () => {
    it('should get badge text when payment type is cash and user is not an admin', () => {
      comp.boost.payment_method = BoostPaymentMethod.CASH;
      comp.boost.payment_amount = 10;
      comp.boost.duration_days = 3;
      comp.boost.payment_tx_id = 'pm_123';
      expect(comp.amountBadgeText).toBe(`\$10 over 3 days`);
    });

    it('should get badge text when payment type is gift card cash and user is not an admin', () => {
      (comp as any).session.isAdmin.and.returnValue(false);
      comp.boost.payment_method = BoostPaymentMethod.CASH;
      comp.boost.payment_amount = 10;
      comp.boost.duration_days = 3;
      comp.boost.payment_tx_id = 'gift_card';

      expect(comp.amountBadgeText).toBe(`\$10 over 3 days`);
      expect((comp as any).session.isAdmin).toHaveBeenCalled();
    });

    it('should get badge text when payment type is cash and user is an admin', () => {
      (comp as any).session.isAdmin.and.returnValue(true);
      comp.boost.payment_method = BoostPaymentMethod.CASH;
      comp.boost.payment_amount = 10;
      comp.boost.duration_days = 3;
      comp.boost.payment_tx_id = 'pm_123';

      expect(comp.amountBadgeText).toBe(`\$10 over 3 days`);
    });

    it('should get badge text when payment type is gift card cash and an admin', () => {
      (comp as any).session.isAdmin.and.returnValue(true);
      comp.boost.payment_method = BoostPaymentMethod.CASH;
      comp.boost.payment_amount = 10;
      comp.boost.duration_days = 3;
      comp.boost.payment_tx_id = 'gift_card';

      expect(comp.amountBadgeText).toBe(`\$10 over 3 days (Gift Card)`);
      expect((comp as any).session.isAdmin).toHaveBeenCalled();
    });

    it('should get badge text when payment type is offchain tokens', () => {
      comp.boost.payment_method = BoostPaymentMethod.OFFCHAIN_TOKENS;
      comp.boost.payment_amount = 10;
      comp.boost.duration_days = 3;

      expect(comp.amountBadgeText).toBe(`10 tokens over 3 days`);
    });
  });
});
