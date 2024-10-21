import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SiteMembershipGateService } from './site-membership-gate.service';
import { MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';
import { Router } from '@angular/router';
import { ShouldShowMembershipGateGQL } from '../../../../graphql/generated.engine';
import { SiteMembershipsPageModal } from './site-memberships-page-modal.service';
import { OnboardingV5Service } from '../../onboarding-v5/services/onboarding-v5.service';
import { Session } from '../../../services/session';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { of } from 'rxjs';

describe('SiteMembershipGateService', () => {
  let service: SiteMembershipGateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SiteMembershipGateService,
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: Router,
          useValue: jasmine.createSpyObj<Router>(['navigate']),
        },
        {
          provide: ShouldShowMembershipGateGQL,
          useValue: jasmine.createSpyObj<ShouldShowMembershipGateGQL>([
            'fetch',
          ]),
        },
        {
          provide: SiteMembershipsPageModal,
          useValue: MockService(SiteMembershipsPageModal),
        },
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service),
        },
        { provide: IS_TENANT_NETWORK, useValue: true },
      ],
    });

    service = TestBed.inject(SiteMembershipGateService);

    Object.defineProperty(service, 'isTenantNetwork', {
      writable: true,
      value: true,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('refreshLocalState', () => {
    it('should refresh the local state when membership gate should be shown', fakeAsync(() => {
      (service as any).shouldShowMembershipGateGQL.fetch.and.returnValue(
        of({ data: { shouldShowMembershipGate: true } })
      );

      service.refreshLocalState();
      tick();

      expect(
        (service as any).shouldShowMembershipGateGQL.fetch
      ).toHaveBeenCalled();
      expect((service as any).configs.set).toHaveBeenCalledWith('tenant', {
        should_show_membership_gate: true,
      });
    }));

    it('should not refresh the local state when membership gate should not be shown', fakeAsync(() => {
      (service as any).shouldShowMembershipGateGQL.fetch.and.returnValue(
        of({ data: { shouldShowMembershipGate: false } })
      );

      service.refreshLocalState();
      tick();

      expect(
        (service as any).shouldShowMembershipGateGQL.fetch
      ).toHaveBeenCalled();
      expect((service as any).configs.set).toHaveBeenCalledWith('tenant', {
        should_show_membership_gate: false,
      });
    }));
  });

  describe('showIfRequired', () => {
    it('should show the site memberships page modal when the membership gate should be shown', fakeAsync(() => {
      Object.defineProperty(service, 'isTenantNetwork', {
        writable: true,
        value: true,
      });
      (service as any).configs.get.and.returnValue({
        should_show_membership_gate: true,
      });
      (service as any).session.isLoggedIn.and.returnValue(true);
      (
        service as any
      ).onboardingV5Service.hasCompletedOnboarding.and.returnValue(
        Promise.resolve(true)
      );
      (service as any).router.url = '/some-url';

      service.showIfRequired();
      tick();

      expect((service as any).siteMembershipsPageModal.open).toHaveBeenCalled();
    }));

    it('should not show the site memberships page modal when the user is not on the tenant network', fakeAsync(() => {
      Object.defineProperty(service, 'isTenantNetwork', {
        writable: true,
        value: false,
      });

      service.showIfRequired();
      tick();

      expect(
        (service as any).siteMembershipsPageModal.open
      ).not.toHaveBeenCalled();
    }));

    it('should not show the site memberships page modal when the user is not logged in', fakeAsync(() => {
      Object.defineProperty(service, 'isTenantNetwork', {
        writable: true,
        value: true,
      });
      (service as any).configs.get.and.returnValue({
        should_show_membership_gate: true,
      });
      (service as any).session.isLoggedIn.and.returnValue(false);
      (service as any).router.url = '/some-url';
      (
        service as any
      ).onboardingV5Service.hasCompletedOnboarding.and.returnValue(
        Promise.resolve(true)
      );

      service.showIfRequired();
      tick();

      expect(
        (service as any).siteMembershipsPageModal.open
      ).not.toHaveBeenCalled();
    }));

    it('should not show the site memberships page modal when the membership gate should not be shown', fakeAsync(() => {
      Object.defineProperty(service, 'isTenantNetwork', {
        writable: true,
        value: true,
      });
      (service as any).configs.get.and.returnValue({
        should_show_membership_gate: false,
      });
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).router.url = '/some-url';
      (
        service as any
      ).onboardingV5Service.hasCompletedOnboarding.and.returnValue(
        Promise.resolve(true)
      );

      service.showIfRequired();
      tick();

      expect(
        (service as any).siteMembershipsPageModal.open
      ).not.toHaveBeenCalled();
    }));

    it('should not show the site memberships page modal when the user is logging out', fakeAsync(() => {
      Object.defineProperty(service, 'isTenantNetwork', {
        writable: true,
        value: true,
      });
      (service as any).configs.get.and.returnValue({
        should_show_membership_gate: true,
      });
      (service as any).session.isLoggedIn.and.returnValue(true);
      (
        service as any
      ).onboardingV5Service.hasCompletedOnboarding.and.returnValue(
        Promise.resolve(true)
      );
      (service as any).router.url = '/logout';

      service.showIfRequired();
      tick();

      expect(
        (service as any).siteMembershipsPageModal.open
      ).not.toHaveBeenCalled();
    }));

    it('should not show the site memberships page modal when the user has not completed onboarding', fakeAsync(() => {
      Object.defineProperty(service, 'isTenantNetwork', {
        writable: true,
        value: true,
      });
      (service as any).configs.get.and.returnValue({
        should_show_membership_gate: true,
      });
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).router.url = '/some-url';
      (
        service as any
      ).onboardingV5Service.hasCompletedOnboarding.and.returnValue(
        Promise.resolve(false)
      );

      service.showIfRequired();
      tick();

      expect(
        (service as any).siteMembershipsPageModal.open
      ).not.toHaveBeenCalled();
    }));
  });
});
