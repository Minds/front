import { TestBed } from '@angular/core/testing';
import { MockService } from '../../../utils/mock';
import { OnboardingV5MinimalModeService } from './onboarding-v5-minimal-mode.service';
import { Location } from '@angular/common';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';

describe('OnboardingV5MinimalModeService', () => {
  let service: OnboardingV5MinimalModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Location,
          useValue: MockService(Location),
        },
        {
          provide: IS_TENANT_NETWORK,
          useValue: false,
        },
        OnboardingV5MinimalModeService,
      ],
    });

    service = TestBed.inject(OnboardingV5MinimalModeService);

    Object.defineProperty(service, 'isTenantNetwork', { writable: true });
    (service as any).isTenantNetwork = false;
    (service as any).location.path.and.returnValue('/');
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('shouldShow', () => {
    it('should determine if minimal mode should show because this is a tenant network', () => {
      (service as any).isTenantNetwork = true;
      (service as any).location.path.and.returnValue('/');

      expect(service.shouldShow()).toBeTrue();
    });

    it('should determine if minimal mode should show because this is a forced route', () => {
      (service as any).isTenantNetwork = false;
      (service as any).location.path.and.returnValue(
        (service as any).forcedMinimalModeRoutes[0]
      );

      expect(service.shouldShow()).toBeTrue();
    });

    it('should determine if minimal mode should show because the route INCLUDES a forced route', () => {
      (service as any).isTenantNetwork = false;
      (service as any).location.path.and.returnValue(
        (service as any).forcedMinimalModeRoutes[0] +
          '?queryParam1=true&queryParam2=false'
      );

      expect(service.shouldShow()).toBeTrue();
    });

    it('should determine if minimal mode should NOT show', () => {
      (service as any).isTenantNetwork = false;
      (service as any).location.path.and.returnValue('/');

      expect(service.shouldShow()).toBeFalse();
    });
  });
});
