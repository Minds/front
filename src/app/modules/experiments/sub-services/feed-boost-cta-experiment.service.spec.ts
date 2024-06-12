import { TestBed } from '@angular/core/testing';
import { FeedBoostCtaExperimentService } from './feed-boost-cta-experiment.service';
import { MockService } from '../../../utils/mock';
import { ExperimentsService } from '../experiments.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';

describe('FeedBoostCtaExperimentService', () => {
  let service: FeedBoostCtaExperimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeedBoostCtaExperimentService,
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
        { provide: IS_TENANT_NETWORK, useValue: false },
      ],
    });

    service = TestBed.inject(FeedBoostCtaExperimentService);

    Object.defineProperty(service, 'isTenantNetwork', { writable: true });
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should return true for tenants', () => {
    (service as any).isTenantNetwork = true;
    expect(service.isActive()).toBeTrue();
    expect((service as any).experiments.hasVariation).not.toHaveBeenCalled();
  });

  it('should return true for non-tenants when experiment is active', () => {
    (service as any).isTenantNetwork = false;
    (service as any).experiments.hasVariation.and.returnValue(true);
    expect(service.isActive()).toBeTrue();
    expect((service as any).experiments.hasVariation).toHaveBeenCalledOnceWith(
      'minds-4918-feed-boost-cta',
      'on'
    );
  });

  it('should return false for non-tenants when experiment is NOT active', () => {
    (service as any).isTenantNetwork = false;
    (service as any).experiments.hasVariation.and.returnValue(false);
    expect(service.isActive()).toBeFalse();
    expect((service as any).experiments.hasVariation).toHaveBeenCalledOnceWith(
      'minds-4918-feed-boost-cta',
      'on'
    );
  });
});
