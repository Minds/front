import { TestBed } from '@angular/core/testing';
import { MembershipManagementService } from './membership-management.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { MockService } from '../../../utils/mock';
import { WINDOW } from '../../../common/injection-tokens/common-injection-tokens';

describe('MembershipManagementService', () => {
  let service: MembershipManagementService;
  let mockWindow: Window = window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MembershipManagementService,
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: WINDOW, useValue: mockWindow },
      ],
    });

    service = TestBed.inject(MembershipManagementService);
    spyOn((service as any).window, 'open');
    spyOn(console, 'error');
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('navigateToCheckout', () => {
    it('should navigate to checkout', async () => {
      expect(await service.navigateToCheckout('123')).toBe(true);
      expect(window.open).toHaveBeenCalledWith(
        '/api/v3/payments/site-memberships/123/checkout?redirectPath=/memberships',
        '_self'
      );
    });

    it('should NOT navigate to if no siteMembershipGuid is passed', async () => {
      expect(await service.navigateToCheckout(null)).toBe(false);
      expect(window.open).not.toHaveBeenCalledWith(
        '/api/v3/payments/site-memberships/123/checkout?redirectPath=/memberships',
        '_self'
      );
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        'There was an error navigating to the checkout. Please try again later.'
      );
    });
  });

  describe('navigateToManagePlan', () => {
    it('should navigate to checkout', async () => {
      expect(await service.navigateToManagePlan(123)).toBe(true);
      expect(window.open).toHaveBeenCalledWith(
        '/api/v3/payments/site-memberships/subscriptions/123/manage?redirectPath=/memberships',
        '_self'
      );
    });

    it('should NOT navigate to if no siteMembershipGuid is passed', async () => {
      expect(await service.navigateToManagePlan(null)).toBe(false);
      expect(window.open).not.toHaveBeenCalledWith(
        '/api/v3/payments/site-memberships/subscriptions/123/manage?redirectPath=/memberships',
        '_self'
      );
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        'There was an error navigating to the manage your plan page. Please try again later.'
      );
    });
  });
});
