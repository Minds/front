import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SiteMembershipsPageComponent } from './site-memberships-page.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { SiteMembershipManagementService } from '../../services/site-membership-management.service';
import {
  GetSiteMembershipSubscriptionsGQL,
  SiteMembership,
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
  SiteMembershipSubscription,
} from '../../../../../graphql/generated.engine';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { OnboardingV5Service } from '../../../onboarding-v5/services/onboarding-v5.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { siteMembershipMock } from '../../../../mocks/site-membership.mock';
import userMock from '../../../../mocks/responses/user.mock';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { SiteMembershipService } from '../../services/site-memberships.service';

describe('SiteMembershipsPageComponent', () => {
  let comp: SiteMembershipsPageComponent;
  let fixture: ComponentFixture<SiteMembershipsPageComponent>;

  const mockSiteMemberships: SiteMembership[] = [
    {
      id: '1',
      membershipGuid: '1234567890',
      membershipName: 'name 1',
      membershipDescription: 'description 1',
      membershipPriceInCents: 1999,
      priceCurrency: 'USD',
      membershipBillingPeriod: SiteMembershipBillingPeriodEnum.Monthly,
      membershipPricingModel: SiteMembershipPricingModelEnum.Recurring,
      roles: [
        { id: 1, name: 'role 1', permissions: [] },
        { id: 2, name: 'role 2', permissions: [] },
      ],
      groups: [],
    },
    {
      id: '2',
      membershipGuid: '1234567892',
      membershipName: 'name 2',
      membershipDescription: 'description2',
      membershipPriceInCents: 2999,
      priceCurrency: 'USD',
      membershipBillingPeriod: SiteMembershipBillingPeriodEnum.Yearly,
      membershipPricingModel: SiteMembershipPricingModelEnum.OneTime,
      roles: [
        { id: 3, name: 'role 3', permissions: [] },
        { id: 4, name: 'role 4', permissions: [] },
      ],
      groups: [],
    },
  ];

  const mockSiteMembershipSubscriptions: SiteMembershipSubscription[] = [
    {
      membershipGuid: '1234567890',
      membershipSubscriptionId: 1,
      autoRenew: true,
      validFromTimestamp: Date.now(),
      validToTimestamp: Date.now() + 86400000,
    },
    {
      membershipGuid: '1234567892',
      membershipSubscriptionId: 2,
      autoRenew: true,
      validFromTimestamp: Date.now(),
      validToTimestamp: Date.now() + 86400000,
    },
  ];

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        SiteMembershipsPageComponent,
        MockComponent({
          selector: 'm-starCard',
          inputs: ['title', 'description'],
        }),
        MockComponent({
          selector: 'm-siteMembershipCard',
          inputs: [
            'name',
            'description',
            'priceInCents',
            'priceCurrencyCode',
            'billingPeriod',
            'pricingModel',
            'isMember',
            'inProgress',
          ],
          outputs: ['joinMembershipClick', 'managePlanClick'],
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
      ],
      providers: [
        {
          provide: SiteMembershipService,
          useValue: MockService(SiteMembershipService, {
            fetch: () => {},
            has: [
              'initialized$',
              'siteMemberships$',
              'siteMembershipSubscriptions$',
            ],
            props: {
              initialized$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              siteMemberships$: {
                get: () =>
                  new BehaviorSubject<SiteMembership[]>(mockSiteMemberships),
              },
              siteMembershipSubscriptions$: {
                get: () =>
                  new BehaviorSubject<SiteMembershipSubscription[]>(
                    mockSiteMembershipSubscriptions
                  ),
              },
            },
          }),
        },
        {
          provide: SiteMembershipManagementService,
          useValue: MockService(SiteMembershipManagementService),
        },
        {
          provide: GetSiteMembershipSubscriptionsGQL,
          useValue: jasmine.createSpyObj<GetSiteMembershipSubscriptionsGQL>([
            'fetch',
          ]),
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
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['snapshot'],
            props: {
              snapshot: {
                get: () => {
                  return {
                    queryParamMap: convertToParamMap({ error: 'error' }),
                  };
                },
              },
            },
          }),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    });

    fixture = TestBed.createComponent(SiteMembershipsPageComponent);
    comp = fixture.componentInstance;
    spyOn(console, 'error');
    (comp as any).getSiteMembershipSubscriptionsGQL.fetch.calls.reset();

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

  it('should init', fakeAsync(async () => {
    expect(comp).toBeTruthy();
    tick();

    expect((comp as any).siteMembershipsService.fetch).toHaveBeenCalled();
    expect(await firstValueFrom(comp.memberships$)).toEqual(
      mockSiteMemberships
    );
    expect((comp as any).membershipSubscriptions$.getValue()).toEqual(
      mockSiteMembershipSubscriptions
    );
  }));

  describe('onJoinMembershipClick', () => {
    it('should call to navigate a user to checkout when logged in ', fakeAsync(() => {
      (comp as any).session.isLoggedIn.and.returnValue(true);
      (comp as any).getSiteMembershipSubscriptionsGQL.fetch.and.returnValue(
        of({ data: { siteMembershipSubscriptions: [] } })
      );
      (comp as any).membershipManagement.navigateToCheckout.and.returnValue(
        Promise.resolve(true)
      );

      comp.onJoinMembershipClick(siteMembershipMock);
      tick();

      expect((comp as any).session.isLoggedIn).toHaveBeenCalled();
      expect(
        (comp as any).getSiteMembershipSubscriptionsGQL.fetch
      ).toHaveBeenCalled();
      expect(
        (comp as any).membershipManagement.navigateToCheckout
      ).toHaveBeenCalled();
    }));

    it('should NOT call to navigate a user to checkout when a user is not logged in and the auth modal returns no user', fakeAsync(() => {
      (comp as any).session.isLoggedIn.and.returnValue(false);
      (comp as any).authModal.open.and.returnValue(Promise.resolve(null));

      comp.onJoinMembershipClick(siteMembershipMock);
      tick();

      expect((comp as any).session.isLoggedIn).toHaveBeenCalled();
      expect(
        (comp as any).getSiteMembershipSubscriptionsGQL.fetch
      ).not.toHaveBeenCalled();
      expect(
        (comp as any).membershipManagement.navigateToCheckout
      ).not.toHaveBeenCalled();
    }));

    it('should call to navigate a user to checkout when a user logs in', fakeAsync(() => {
      (comp as any).session.isLoggedIn.and.returnValue(false);
      (comp as any).authModal.open.and.returnValue(Promise.resolve(userMock));
      (comp as any).getSiteMembershipSubscriptionsGQL.fetch.and.returnValue(
        of({ data: { siteMembershipSubscriptions: [] } })
      );
      (comp as any).membershipManagement.navigateToCheckout.and.returnValue(
        Promise.resolve(true)
      );

      comp.onJoinMembershipClick(siteMembershipMock);
      tick();

      expect((comp as any).session.isLoggedIn).toHaveBeenCalled();
      expect(
        (comp as any).membershipManagement.navigateToCheckout
      ).toHaveBeenCalled();
    }));

    it('should call to navigate a user to checkout when a user registers', fakeAsync(() => {
      (comp as any).session.isLoggedIn.and.returnValue(false);
      (comp as any).authModal.open.and.returnValue(
        Promise.resolve({
          ...userMock,
          email_confirmed: false,
        })
      );
      (comp as any).getSiteMembershipSubscriptionsGQL.fetch.and.returnValue(
        of({ data: { siteMembershipSubscriptions: [] } })
      );
      (comp as any).membershipManagement.navigateToCheckout.and.returnValue(
        Promise.resolve(true)
      );

      comp.onJoinMembershipClick(siteMembershipMock);
      tick();

      (comp as any).onboardingV5Service.onboardingCompleted$.next(true);
      tick();

      expect((comp as any).session.isLoggedIn).toHaveBeenCalled();
      expect(
        (comp as any).getSiteMembershipSubscriptionsGQL.fetch
      ).toHaveBeenCalled();
      expect(
        (comp as any).membershipManagement.navigateToCheckout
      ).toHaveBeenCalled();
    }));

    it('should NOT call to navigate a user to checkout when a user is already a member of a given plan ', fakeAsync(() => {
      (comp as any).session.isLoggedIn.and.returnValue(true);
      (comp as any).getSiteMembershipSubscriptionsGQL.fetch.and.returnValue(
        of({
          data: {
            siteMembershipSubscriptions: [
              {
                ...mockSiteMembershipSubscriptions,
                membershipGuid: siteMembershipMock.membershipGuid,
              },
            ],
          },
        })
      );

      comp.onJoinMembershipClick(siteMembershipMock);
      tick();

      expect((comp as any).session.isLoggedIn).toHaveBeenCalled();
      expect(
        (comp as any).getSiteMembershipSubscriptionsGQL.fetch
      ).toHaveBeenCalled();
      expect((comp as any).toaster.warn).toHaveBeenCalled();
      expect(
        (comp as any).membershipManagement.navigateToCheckout
      ).not.toHaveBeenCalled();
    }));
  });

  describe('onManagePlanClick', () => {
    it('should navigate to manage plan', () => {
      (comp as any).membershipSubscriptions$.next([
        {
          ...mockSiteMembershipSubscriptions[0],
          membershipGuid: siteMembershipMock.membershipGuid,
        },
      ]);
      (comp as any).membershipManagement.navigateToManagePlan.and.returnValue(
        Promise.resolve(true)
      );
      comp.onManagePlanClick(siteMembershipMock);
      expect(
        (comp as any).membershipManagement.navigateToManagePlan
      ).toHaveBeenCalled();
    });

    it('should not navigate to manage plan if you are not a subscriber to it', () => {
      (comp as any).membershipSubscriptions$.next([]);
      (comp as any).membershipManagement.navigateToManagePlan.and.returnValue(
        Promise.resolve(true)
      );
      comp.onManagePlanClick(siteMembershipMock);
      expect(
        (comp as any).membershipManagement.navigateToManagePlan
      ).not.toHaveBeenCalled();
    });
  });

  describe('checkForErrorParams', () => {
    it('should show toast for SUBSCRIPTION_ALREADY_CANCELLED error param', fakeAsync(() => {
      (comp as any).route.snapshot.queryParamMap = convertToParamMap({
        error: 'SUBSCRIPTION_ALREADY_CANCELLED',
      });

      comp.ngOnInit();
      tick();

      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'This subscription is already cancelled'
      );
    }));
  });
});