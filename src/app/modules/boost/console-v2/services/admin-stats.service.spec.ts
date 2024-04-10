import { of } from 'rxjs';
import { BoostConsoleAdminStatsResponse } from '../../boost.types';
import { BoostConsoleAdminStatsService } from './admin-stats.service';

export let apiMock = new (function () {
  this.get = jasmine.createSpy('get');
})();

const mockFetchResponse: BoostConsoleAdminStatsResponse = {
  global_pending: {
    safe_count: 96,
    controversial_count: 42,
  },
};

describe('BoostConsoleAdminStatsService', () => {
  let service: BoostConsoleAdminStatsService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    service = new BoostConsoleAdminStatsService(apiMock);

    (service as any).api.get.and.returnValue(of(mockFetchResponse));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch from server and populate instance variables', async () => {
    service.pendingSafeCount$.next(0);
    service.pendingControversialCount$.next(0);

    await service.fetch();

    expect(service.pendingSafeCount$.getValue()).toBe(
      mockFetchResponse.global_pending.safe_count
    );
    expect(service.pendingControversialCount$.getValue()).toBe(
      mockFetchResponse.global_pending.controversial_count
    );
  });

  it('should decrement safe pending count', () => {
    service.pendingSafeCount$.next(10);

    service.decrementPendingSafeCount();
    expect(service.pendingSafeCount$.getValue()).toBe(9);

    service.decrementPendingSafeCount();
    expect(service.pendingSafeCount$.getValue()).toBe(8);
  });

  it('should decrement controversial pending count', () => {
    service.pendingControversialCount$.next(99);

    service.decrementPendingControversialCount();
    expect(service.pendingControversialCount$.getValue()).toBe(98);

    service.decrementPendingControversialCount();
    expect(service.pendingControversialCount$.getValue()).toBe(97);
  });
});
