import { of } from 'rxjs';
import {
  Boost,
  BoostLocation,
  BoostState,
  BoostSuitability,
} from '../../boost.types';
import { BoostPaymentCategory } from '../../modal-v2/boost-modal-v2.types';
import { BoostConsoleService } from './console.service';

let sessionMock = new (function () {
  this.isAdmin = jasmine.createSpy('isAdmin');
})();

let apiMock = new (function () {
  this.post = jasmine.createSpy('post');
})();

let toasterMock = new (function () {
  this.error = jasmine.createSpy('error');
})();

let adminStatsMock = new (function () {
  this.decrementPendingSafeCount = jasmine.createSpy(
    'decrementPendingSafeCount'
  );
  this.decrementPendingControversialCount = jasmine.createSpy(
    'decrementPendingControversialCount'
  );
})();

let routerMock = new (function () {})();

let routeMock = new (function () {})();

let mockBoost: Boost = {
  guid: '123',
  urn: '234',
  owner_guid: '345',
  entity_guid: '456',
  entity: { guid: '567' },
  target_location: BoostLocation.NEWSFEED,
  target_suitability: BoostSuitability.SAFE,
  payment_method: BoostPaymentCategory.CASH,
  payment_amount: 10,
  daily_bid: 2,
  duration_days: 5,
  boost_status: BoostState.PENDING,
  created_timestamp: 1111,
  updated_timestamp: 2222,
  approved_timestamp: 3333,
  payment_tx_id: '0X01',
};

describe('BoostConsoleService', () => {
  let service: BoostConsoleService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    service = new BoostConsoleService(
      sessionMock,
      apiMock,
      toasterMock,
      adminStatsMock,
      routerMock,
      routeMock
    );

    (service as any).toasterService.error.calls.reset();
    (service as any).session.isAdmin.calls.reset();
    (service as any).api.post.calls.reset();

    (service as any).session.isAdmin.and.returnValue(false);

    (service as any).adminStats.decrementPendingSafeCount.calls.reset();
    (
      service as any
    ).adminStats.decrementPendingControversialCount.calls.reset();

    service.suitabilityFilterValue$.next('safe');
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should approve and decrement admin stat count for safe boosts', async () => {
    service.suitabilityFilterValue$.next('safe');
    (service as any).session.isAdmin.and.returnValue(true);
    (service as any).api.post.and.returnValue(of({}));

    await service.approve(mockBoost);

    expect(
      (service as any).adminStats.decrementPendingSafeCount
    ).toHaveBeenCalled();
  });

  it('should approve and decrement admin stat count for controversial boosts', async () => {
    service.suitabilityFilterValue$.next('controversial');
    (service as any).session.isAdmin.and.returnValue(true);
    (service as any).api.post.and.returnValue(of({}));

    await service.approve(mockBoost);

    expect(
      (service as any).adminStats.decrementPendingControversialCount
    ).toHaveBeenCalled();
  });

  it('should reject and decrement admin stat count for safe boosts', async () => {
    service.suitabilityFilterValue$.next('safe');
    (service as any).session.isAdmin.and.returnValue(true);
    (service as any).api.post.and.returnValue(of({}));
    let boost = mockBoost;
    boost.rejection_reason = 1;

    await service.reject(mockBoost).toPromise();

    expect((service as any).api.post).toHaveBeenCalledWith(
      'api/v3/boosts/123/reject',
      {
        reason: boost.rejection_reason,
      }
    );
  });

  it('should reject and decrement admin stat count for controversial boosts', async () => {
    service.suitabilityFilterValue$.next('controversial');
    (service as any).session.isAdmin.and.returnValue(true);
    (service as any).api.post.and.returnValue(of({}));
    let boost = mockBoost;
    boost.rejection_reason = 1;

    await service.reject(mockBoost);

    expect((service as any).api.post).toHaveBeenCalledWith(
      'api/v3/boosts/123/reject',
      {
        reason: boost.rejection_reason,
      }
    );
  });
});
