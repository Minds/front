import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { SiteMembershipsPageComponent } from './site-memberships-page.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import {
  SiteMembership,
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
  SiteMembershipSubscription,
} from '../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
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
      archived: false,
      isExternal: false,
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
      archived: false,
      isExternal: false,
    },
  ];

  const mockSiteMembershipSubscriptions: SiteMembershipSubscription[] = [
    {
      membershipGuid: '1234567890',
      membershipSubscriptionId: 1,
      autoRenew: true,
      isManual: false,
      validFromTimestamp: Date.now(),
      validToTimestamp: Date.now() + 86400000,
    },
    {
      membershipGuid: '1234567892',
      membershipSubscriptionId: 2,
      autoRenew: true,
      isManual: false,
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
          ],
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
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['queryParamMap', 'snapshot'],
            props: {
              queryParamMap: {
                get: () => new BehaviorSubject(convertToParamMap({})),
              },
              snapshot: {
                get: () => ({ queryParamMap: convertToParamMap({}) }),
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

    (comp as any).configs.isModal = false;

    spyOn(console, 'error');

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

  it('should init and fetch when skipInitialFetch is false', fakeAsync(async () => {
    (comp as any).skipInitialFetch = false;
    expect(comp).toBeTruthy();
    tick();

    expect((comp as any).siteMembershipsService.fetch).toHaveBeenCalled();
    expect(await firstValueFrom(comp.memberships$)).toEqual(
      mockSiteMemberships
    );
    flush();
  }));

  it('should init and not fetch when skipInitialFetch is true', fakeAsync(async () => {
    (comp as any).skipInitialFetch = true;
    (comp as any).siteMembershipsService.fetch.calls.reset();
    comp.ngOnInit();

    expect(comp).toBeTruthy();
    tick();

    expect((comp as any).siteMembershipsService.fetch).not.toHaveBeenCalled();
    flush();
  }));

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

  describe('starCardTitleText', () => {
    it('should set default starCardTitleText when membershipRedirect query param is not present', fakeAsync(() => {
      (comp as any).route.queryParamMap.next(convertToParamMap({}));

      fixture.detectChanges();
      tick();

      expect((comp as any).starCardTitleText).toEqual(
        'Become a supporting member'
      );
      flush();
    }));

    it('should set starCardTitleText correctly when membershipRedirect query param is present', fakeAsync(() => {
      (comp as any).route.queryParamMap.next(
        convertToParamMap({ membershipRedirect: 'true' })
      );

      fixture.detectChanges();
      tick();

      expect((comp as any).starCardTitleText).toEqual(
        'This membership is no longer available'
      );
      flush();
    }));
  });

  describe('starCardDescriptionText$', () => {
    it('should set starCardDescriptionText$ correctly when membershipRedirect query param is present', (done) => {
      (comp as any).isModal = false;
      (comp as any).configs.get.withArgs('tenant').and.returnValue({
        should_show_membership_gate: true,
      });
      (comp as any).configs.get.withArgs('site_name').and.returnValue('test');
      (comp as any).route.queryParamMap.next(
        convertToParamMap({ membershipRedirect: 'true' })
      );

      (comp as any).starCardDescriptionText$.subscribe((description) => {
        expect(description).toContain(
          'Check out these other available memberships'
        );
        done();
      });
    });

    it('should set starCardDescriptionText$ correctly when membership gate is shown', (done) => {
      (comp as any).route.queryParamMap.next(convertToParamMap({}));
      (comp as any).isModal = true;
      (comp as any).configs.get.withArgs('tenant').and.returnValue({
        should_show_membership_gate: true,
      });
      (comp as any).configs.get.withArgs('site_name').and.returnValue('test');

      (comp as any).starCardDescriptionText$.subscribe((description) => {
        expect(description).toContain(
          'This community is exclusively for supporting members. Join today.'
        );
        done();
      });
    });

    it('should set starCardDescriptionText$ correctly when no membership gate or redirect title should be shown', (done) => {
      (comp as any).route.queryParamMap.next(convertToParamMap({}));
      (comp as any).isModal = false;
      (comp as any).configs.get.withArgs('tenant').and.returnValue({
        should_show_membership_gate: false,
      });
      (comp as any).configs.get.withArgs('site_name').and.returnValue('test');

      (comp as any).starCardDescriptionText$.subscribe((description) => {
        expect(description).toContain(
          'Join and support test to unlock members-only access.'
        );
        done();
      });
    });
  });
});
