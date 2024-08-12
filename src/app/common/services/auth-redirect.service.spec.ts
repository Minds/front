import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthRedirectService } from './auth-redirect.service';
import { MockService } from '../../utils/mock';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';
import { TenantLoggedInLandingRedirectService } from '../../modules/multi-tenant-network/services/logged-in-landing-redirect.service';

describe('AuthRedirectService', () => {
  let service: AuthRedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthRedirectService,
        { provide: Router, useValue: MockService(Router) },
        {
          provide: TenantLoggedInLandingRedirectService,
          useValue: MockService(TenantLoggedInLandingRedirectService),
        },
        { provide: IS_TENANT_NETWORK, useValue: false },
      ],
    });
    service = TestBed.inject(AuthRedirectService);
    Object.defineProperty(service, 'isTenantNetwork', { writable: true });
  });

  afterEach(() => {
    (service as any).isTenantNetwork = false;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('redirect', () => {
    it('should navigate to default redirect URL for non-tenant network', async () => {
      (service as any).isTenantNetwork = false;
      await service.redirect();
      expect((service as any).router.navigate).toHaveBeenCalledWith([
        '/newsfeed/subscriptions/for-you',
      ]);
    });

    it('should navigate for tenant network', async () => {
      (service as any).isTenantNetwork = true;
      await service.redirect();
      expect(
        (service as any).tenantLoggedInLandingRedirect.redirect
      ).toHaveBeenCalled();
    });
  });

  describe('getDefaultRedirectUrl', () => {
    it('should return default redirect URL', () => {
      (service as any).isTenantNetwork = false;
      expect(service.getDefaultRedirectUrl()).toBe(
        '/newsfeed/subscriptions/for-you'
      );
    });

    it('should get default redirect URL for a tenant', () => {
      (service as any).isTenantNetwork = true;
      expect(service.getDefaultRedirectUrl()).toBe(
        '/newsfeed/subscriptions/top'
      );
    });
  });
});
