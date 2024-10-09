import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BoostConsoleActionButtonsComponent } from './action-buttons.component';
import { BoostConsoleService } from '../../../services/console.service';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { BoostRejectionModalService } from '../../../modal/rejection-modal/services/boost-rejection-modal.service';
import { BoostCancelModalService } from '../../../services/cancel-modal.service';
import { BehaviorSubject } from 'rxjs';
import { Boost, BoostPaymentMethod, BoostState } from '../../../../boost.types';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { ModalService } from '../../../../../../services/ux/modal.service';
import { Injector } from '@angular/core';

describe('BoostConsoleActionButtonsComponent', () => {
  let comp: BoostConsoleActionButtonsComponent;
  let fixture: ComponentFixture<BoostConsoleActionButtonsComponent>;
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

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        BoostConsoleActionButtonsComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['size', 'color', 'saving'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: BoostConsoleService,
          useValue: MockService(BoostConsoleService, {
            has: ['adminContext$'],
            props: {
              adminContext$: { get: () => new BehaviorSubject<boolean>(false) },
            },
          }),
        },
        {
          provide: BoostRejectionModalService,
          useValue: MockService(BoostRejectionModalService),
        },
        {
          provide: BoostCancelModalService,
          useValue: MockService(BoostCancelModalService),
        },
        {
          provide: ModalService,
          useValue: MockService(ModalService),
        },
        {
          provide: Injector,
          useValue: Injector,
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    });

    fixture = TestBed.createComponent(BoostConsoleActionButtonsComponent);
    comp = fixture.componentInstance;

    (comp as any).boostCancelled$.next(false);
    comp.service.adminContext$.next(false);
    comp.boost = mockBoost;

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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('shouldShowCancelButton$', () => {
    it('should not show for a boost that has already has its cancel button clicked', (done: DoneFn) => {
      (comp as any).boostCancelled$.next(true);
      (comp as any).service.adminContext$.next(false);
      comp.boost = { ...mockBoost, boost_status: BoostState.PENDING };

      (comp as any).shouldShowCancelButton$.subscribe((result: boolean) => {
        expect(result).toBeFalse();
        done();
      });
    });

    it('should not show for a boost when in an admin context', (done: DoneFn) => {
      (comp as any).boostCancelled$.next(false);
      (comp as any).service.adminContext$.next(true);
      comp.boost = { ...mockBoost, boost_status: BoostState.PENDING };

      (comp as any).shouldShowCancelButton$.subscribe((result: boolean) => {
        expect(result).toBeFalse();
        done();
      });
    });

    it('should not show for a boost that is not in a pending or approved state', (done: DoneFn) => {
      (comp as any).boostCancelled$.next(false);
      (comp as any).service.adminContext$.next(false);
      comp.boost = { ...mockBoost, boost_status: BoostState.FAILED };

      (comp as any).shouldShowCancelButton$.subscribe((result: boolean) => {
        expect(result).toBeFalse();
        done();
      });
    });

    it('should show for a boost that is in a pending state', (done: DoneFn) => {
      (comp as any).boostCancelled$.next(false);
      (comp as any).service.adminContext$.next(false);
      comp.boost = { ...mockBoost, boost_status: BoostState.PENDING };

      (comp as any).shouldShowCancelButton$.subscribe((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should show for a boost that is in an approved state', (done: DoneFn) => {
      (comp as any).boostCancelled$.next(false);
      (comp as any).service.adminContext$.next(false);
      comp.boost = { ...mockBoost, boost_status: BoostState.APPROVED };

      (comp as any).shouldShowCancelButton$.subscribe((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });
    });
  });

  describe('onCancel', () => {
    it('should not cancel a boost when cancellation has not been confirmed', () => {
      (
        comp as any
      ).boostCancelModalService.confirmSelfBoostCancellation.and.returnValue(
        Promise.resolve(false)
      );

      comp.onCancel(new MouseEvent('click'));

      expect(
        (comp as any).boostCancelModalService.confirmSelfBoostCancellation
      ).toHaveBeenCalled();
      expect(comp.service.cancel).not.toHaveBeenCalled();
    });

    it('should cancel a boost when cancellation has been confirmed', fakeAsync(() => {
      (
        comp as any
      ).boostCancelModalService.confirmSelfBoostCancellation.and.returnValue(
        Promise.resolve(true)
      );
      (comp as any).service.cancel.and.returnValue(Promise.resolve(true));
      (comp as any).boost = mockBoost;

      comp.onCancel(new MouseEvent('click'));
      tick();

      expect(
        (comp as any).boostCancelModalService.confirmSelfBoostCancellation
      ).toHaveBeenCalled();
      expect(comp.service.cancel).toHaveBeenCalledOnceWith(mockBoost);
      expect((comp as any).cancelling).toBeFalse();
      expect(mockBoost.boost_status).toBe(BoostState.CANCELLED);
      expect((comp as any).boostCancelled$.getValue()).toBeTrue();
    }));
  });

  describe('onApprove', () => {
    it('should approve non-onchain boosts', fakeAsync(() => {
      (comp as any).config.get.withArgs('blockchain').and.returnValue({
        'server_gas_price': 100,
      });
      comp.boost = { ...mockBoost, payment_method: BoostPaymentMethod.CASH };
      (comp as any).service.approve.and.returnValue(Promise.resolve(true));

      comp.onApprove(new MouseEvent('click'));
      tick();

      expect(comp.service.approve).toHaveBeenCalledWith(comp.boost);
      expect(comp.approving).toBeFalse();
    }));

    it('should approve onchain boosts when modal is confirmed', fakeAsync(() => {
      (comp as any).config.get.withArgs('blockchain').and.returnValue({
        'server_gas_price': 100,
      });
      (comp as any).modalService.present.and.returnValue({
        close: () => {},
      });
      comp.boost = {
        ...mockBoost,
        payment_method: BoostPaymentMethod.ONCHAIN_TOKENS,
      };
      (comp as any).service.approve.and.returnValue(Promise.resolve(true));

      comp.onApprove(new MouseEvent('click'));
      tick();

      expect((comp as any).modalService.present).toHaveBeenCalled();

      (comp as any).modalService.present.calls
        .mostRecent()
        .args[1].data.onConfirm();
      tick();

      expect(comp.service.approve).toHaveBeenCalled();
      expect(comp.approving).toBeFalse();
    }));
  });
});
