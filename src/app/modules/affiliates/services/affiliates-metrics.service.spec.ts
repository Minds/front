import { TestBed } from '@angular/core/testing';
import { MockService } from '../../../utils/mock';
import {
  AffiliatesMetrics,
  AffiliatesMetricsService,
} from './affiliates-metrics.service';
import { ApiService } from '../../../common/api/api.service';
import { of } from 'rxjs';

describe('AffiliatesMetricsService', () => {
  let service: AffiliatesMetricsService;

  const defaultMetrics: AffiliatesMetrics = {
    user_guid: '123',
    amount_cents: 1.23,
    amount_usd: 123,
    amount_tokens: 2,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AffiliatesMetricsService,
        {
          provide: ApiService,
          useValue: MockService(ApiService),
        },
      ],
    });

    service = TestBed.inject(AffiliatesMetricsService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should get metrics from server', (done: DoneFn) => {
    (service as any).api.get.and.returnValue(of(defaultMetrics));

    service.metrics$.subscribe((metrics) => {
      expect(metrics).toEqual(defaultMetrics);
      expect((service as any).api.get).toHaveBeenCalledOnceWith(
        'api/v3/referrals/metrics'
      );
      expect((service as any).loading$.getValue()).toBe(false);
      expect((service as any).error$.getValue()).toBe(false);
      done();
    });
  });

  it('should handle error and set error$ to true', (done: DoneFn) => {
    (service as any).api.get.and.returnValue(Promise.reject('Mocked error'));

    service.metrics$.subscribe((metrics) => {
      expect(metrics).toBeNull();
      expect((service as any).api.get).toHaveBeenCalledOnceWith(
        'api/v3/referrals/metrics'
      );
      expect((service as any).loading$.getValue()).toBe(false);
      expect((service as any).error$.getValue()).toBe(true);
      done();
    });
  });
});
