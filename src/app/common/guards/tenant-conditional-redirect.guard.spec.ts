import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';
import { tenantConditionalRedirectGuard } from './tenant-conditional-redirect.guard';

describe('tenantConditionalRedirectGuard', () => {
  const routerMock: jasmine.SpyObj<Router> = jasmine.createSpyObj<Router>([
    'navigate',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: IS_TENANT_NETWORK, useValue: true },
      ],
    });

    routerMock.navigate.calls.reset();
  });

  it('should navigate to tenant path when on a tenant network', () => {
    const tenantPath: string = '/discovery';
    const nonTenantPath: string = '/newsfeed';
    const isTenantNetwork: boolean = true;
    TestBed.overrideProvider(IS_TENANT_NETWORK, { useValue: isTenantNetwork });

    TestBed.runInInjectionContext(() => {
      const result = tenantConditionalRedirectGuard(tenantPath, nonTenantPath)(
        null,
        null
      );

      expect(result).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith([tenantPath]);
    });
  });

  it('should navigate to NON-tenant path when on a tenant network', () => {
    const tenantPath: string = '/discovery';
    const nonTenantPath: string = '/newsfeed';
    const isTenantNetwork: boolean = false;
    TestBed.overrideProvider(IS_TENANT_NETWORK, { useValue: isTenantNetwork });

    TestBed.runInInjectionContext(() => {
      const result = tenantConditionalRedirectGuard(tenantPath, nonTenantPath)(
        null,
        null
      );

      expect(result).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith([nonTenantPath]);
    });
  });
});
