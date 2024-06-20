import { of } from 'rxjs';
import {
  Boost,
  BoostLocation,
  BoostState,
  BoostSuitability,
} from '../../boost.types';
import { BoostPaymentCategory } from '../../modal-v2/boost-modal-v2.types';
import { BoostConsoleService } from './console.service';

let permissionsServiceMock = new (function () {
  this.canModerateContent = jasmine.createSpy('canModerateContent');
})();

let apiMock = new (function () {
  this.get = jasmine.createSpy('get');
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
      apiMock,
      toasterMock,
      adminStatsMock,
      permissionsServiceMock,
      routerMock,
      routeMock
    );

    (service as any).toasterService.error.calls.reset();
    (service as any).api.post.calls.reset();
    (service as any).api.get.calls.reset();
    (service as any).permissionsService.canModerateContent.calls.reset();
    (service as any).permissionsService.canModerateContent.and.returnValue(
      false
    );

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
    (service as any).permissionsService.canModerateContent.and.returnValue(
      true
    );
    (service as any).api.post.and.returnValue(of({}));

    await service.approve(mockBoost);

    expect(
      (service as any).adminStats.decrementPendingSafeCount
    ).toHaveBeenCalled();
  });

  it('should approve and decrement admin stat count for controversial boosts', async () => {
    service.suitabilityFilterValue$.next('controversial');
    (service as any).permissionsService.canModerateContent.and.returnValue(
      true
    );
    (service as any).api.post.and.returnValue(of({}));

    await service.approve(mockBoost);

    expect(
      (service as any).adminStats.decrementPendingControversialCount
    ).toHaveBeenCalled();
  });

  it('should reject and decrement admin stat count for safe boosts', async () => {
    service.suitabilityFilterValue$.next('safe');
    (service as any).permissionsService.canModerateContent.and.returnValue(
      true
    );
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
    (service as any).permissionsService.canModerateContent.and.returnValue(
      true
    );
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

  it('should get list for non admins', (done: DoneFn) => {
    (service as any).adminContext$.next(false);
    (service as any).permissionsService.canModerateContent.and.returnValue(
      false
    );
    (service as any).api.get.and.returnValue(
      of({
        status: '200',
        boosts: [mockBoost],
      })
    );

    service.getList$().subscribe((result) => {
      expect((service as any).api.get).toHaveBeenCalledWith('api/v3/boosts', {
        limit: 12,
        offset: 0,
        location: 1,
        status: null,
        audience: null,
        payment_method: null,
        remote_user_guid: null,
      });
      expect(result).toEqual({
        status: '200',
        boosts: [mockBoost],
      });
      done();
    });
  });

  it('should get list for admins', (done: DoneFn) => {
    (service as any).adminContext$.next(true);
    (service as any).permissionsService.canModerateContent.and.returnValue(
      true
    );
    (service as any).api.get.and.returnValue(
      of({
        status: '200',
        boosts: [mockBoost],
      })
    );

    service.getList$().subscribe((result) => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/boosts/admin',
        {
          limit: 12,
          offset: 0,
          location: 1,
          status: 1,
          audience: 1,
          payment_method: null,
          remote_user_guid: null,
        }
      );
      expect(result).toEqual({
        status: '200',
        boosts: [mockBoost],
      });
      done();
    });
  });
});
