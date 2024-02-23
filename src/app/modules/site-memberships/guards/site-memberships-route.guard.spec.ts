import { TestBed } from '@angular/core/testing';
import { SiteMembershipsRouteGuard } from './site-memberships-route.guard';
import { MockService } from '../../../utils/mock';
import { Router } from '@angular/router';
import { SiteMembershipsCountService } from '../services/site-membership-count.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { BehaviorSubject } from 'rxjs';

describe('SiteMembershipsRouteGuard', () => {
  let service: SiteMembershipsRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SiteMembershipsRouteGuard,
        {
          provide: SiteMembershipsCountService,
          useValue: { count$: new BehaviorSubject<number>(1) },
        },
        { provide: Router, useValue: MockService(Router) },
        { provide: IS_TENANT_NETWORK, useValue: true },
      ],
    });

    service = TestBed.inject(SiteMembershipsRouteGuard);
    Object.defineProperty(service, 'isTenantNetwork', { writable: true });
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if the user should be able to visit the memberships page', () => {
    (service as any).isTenantNetwork = true;
    (service as any).membershipsCountService.count$.next(1);

    expect(service.canActivate()).toBeTrue();
  });

  it('should return false and redirect if not on a tenant network', () => {
    (service as any).isTenantNetwork = false;
    (service as any).membershipsCountService.count$.next(1);

    expect(service.canActivate()).toBeFalse();
    expect((service as any).router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should return false and redirect if the networks membership count is 0', () => {
    (service as any).isTenantNetwork = true;
    (service as any).membershipsCountService.count$.next(0);

    expect(service.canActivate()).toBeFalse();
    expect((service as any).router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
