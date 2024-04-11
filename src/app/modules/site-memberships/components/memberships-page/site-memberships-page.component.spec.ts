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
  const queryParamMapSubject = new BehaviorSubject(convertToParamMap({}));

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
          useValue: {
            queryParamMap: queryParamMapSubject.asObservable(),
            snapshot: { queryParamMap: queryParamMapSubject.value },
          },
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    });

    fixture = TestBed.createComponent(SiteMembershipsPageComponent);
    comp = fixture.componentInstance;
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

  it('should init', fakeAsync(async () => {
    expect(comp).toBeTruthy();
    tick();

    expect((comp as any).siteMembershipsService.fetch).toHaveBeenCalled();
    expect(await firstValueFrom(comp.memberships$)).toEqual(
      mockSiteMemberships
    );
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

  describe('SiteMembershipsPageComponent with membershipRedirect query param', () => {
    it('should set starCardTitleText correctly when membershipRedirect query param is present', fakeAsync(() => {
      queryParamMapSubject.next(
        convertToParamMap({ membershipRedirect: 'true' })
      );

      fixture.detectChanges();
      tick();

      expect((comp as any).starCardTitleText).toEqual(
        'This membership is no longer available'
      );
      flush();
    }));

    it('should set starCardDescriptionText$ correctly when membershipRedirect query param is present', (done) => {
      queryParamMapSubject.next(
        convertToParamMap({ membershipRedirect: 'true' })
      );

      (comp as any).starCardDescriptionText$.subscribe((description) => {
        expect(description).toContain(
          'Check out these other available memberships'
        );
        done();
      });
    });
  });
});
