import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TenantCustomHomepageMembershipsComponent } from './memberships.component';
import { SiteMembershipService } from '../../../../site-memberships/services/site-memberships.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { SiteMembership } from '../../../../../../graphql/generated.engine';
import { BehaviorSubject } from 'rxjs';
import { siteMembershipMock } from '../../../../../mocks/site-membership.mock';
import { By } from '@angular/platform-browser';
import { AuthModalService } from '../../../../auth/modal/auth-modal.service';
import { OnboardingV5Service } from '../../../../onboarding-v5/services/onboarding-v5.service';
import { SiteMembershipManagementService } from '../../../../site-memberships/services/site-membership-management.service';
import userMock from '../../../../../mocks/responses/user.mock';
import { TenantCustomHomepageService } from '../../services/tenant-custom-homepage.service';

describe('TenantCustomHomepageMembershipsComponent', () => {
  let comp: TenantCustomHomepageMembershipsComponent;
  let fixture: ComponentFixture<TenantCustomHomepageMembershipsComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        TenantCustomHomepageMembershipsComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'solid', 'softSquare'],
          template: `<ng-content></ng-content>`,
        }),
      ],
      providers: [
        {
          provide: TenantCustomHomepageService,
          useValue: MockService(TenantCustomHomepageService, {
            has: ['isMembersSectionLoaded$'],
            props: {
              isMembersSectionLoaded$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: SiteMembershipService,
          useValue: MockService(SiteMembershipService, {
            has: ['siteMemberships$', 'initialized$'],
            props: {
              siteMemberships$: {
                get: () =>
                  new BehaviorSubject<SiteMembership[]>([
                    siteMembershipMock,
                    siteMembershipMock,
                  ]),
              },
              initialized$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        { provide: AuthModalService, useValue: MockService(AuthModalService) },
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service, {
            has: ['onboardingCompleted$'],
            props: {
              onboardingCompleted$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: SiteMembershipManagementService,
          useValue: MockService(SiteMembershipManagementService),
        },
      ],
    });

    fixture = TestBed.createComponent(TenantCustomHomepageMembershipsComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should set isMembersSectionLoaded$ to true when members section data is loaded', fakeAsync(() => {
    (comp as any).tenantCustomHomepageService.isMembersSectionLoaded$.next(
      false
    );

    (comp as any).siteMembershipService.initialized$.next(true);
    tick();

    expect(
      (
        comp as any
      ).tenantCustomHomepageService.isMembersSectionLoaded$.getValue()
    ).toBe(true);
  }));

  describe('rendering', () => {
    it('should render site memberships when available', () => {
      expect(
        fixture.debugElement.queryAll(By.css('.m-tenantHomepageMembership'))
          .length
      ).toBe(2);
    });

    it('should NOT render site memberships when none are available', () => {
      (comp as any).siteMemberships$.next([]);

      fixture.detectChanges();
      expect(
        fixture.debugElement.queryAll(By.css('.m-tenantHomepageMembership'))
          .length
      ).toBe(0);
    });
  });

  describe('onJoinMembershipClick', () => {
    it('should handle join membership click when the auth modal emits a user with a confirmed email', fakeAsync(() => {
      const membershipGuid: string = '123';
      (comp as any).authModal.open.and.returnValue({
        userMock,
        email_confirmed: true,
      });

      comp.onJoinMembershipClick(membershipGuid);
      tick();

      expect((comp as any).authModal.open).toHaveBeenCalledOnceWith({
        formDisplay: 'register',
      });
      expect(
        (comp as any).membershipManagement.navigateToCheckout
      ).toHaveBeenCalledOnceWith(membershipGuid, '/memberships');
    }));

    it('should handle join membership click when the auth modal emits that a user completed onboarding', fakeAsync(() => {
      const membershipGuid: string = '123';
      (comp as any).authModal.open.and.returnValue({
        userMock,
        email_confirmed: false,
      });

      comp.onJoinMembershipClick(membershipGuid);
      tick();

      expect((comp as any).authModal.open).toHaveBeenCalledOnceWith({
        formDisplay: 'register',
      });
      expect(
        (comp as any).membershipManagement.navigateToCheckout
      ).not.toHaveBeenCalled();

      (comp as any).onboardingV5Service.onboardingCompleted$.next(true);
      tick();

      expect(
        (comp as any).membershipManagement.navigateToCheckout
      ).toHaveBeenCalledOnceWith(membershipGuid, '/memberships');
    }));

    it('should handle join membership click by doing nothing when the auth modal returns no user', fakeAsync(() => {
      const membershipGuid: string = '123';
      (comp as any).authModal.open.and.returnValue(null);

      comp.onJoinMembershipClick(membershipGuid);
      tick();

      expect((comp as any).authModal.open).toHaveBeenCalledOnceWith({
        formDisplay: 'register',
      });
      expect(
        (comp as any).membershipManagement.navigateToCheckout
      ).not.toHaveBeenCalled();
    }));
  });
});
