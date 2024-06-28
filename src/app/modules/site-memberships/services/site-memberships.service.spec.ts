import { TestBed } from '@angular/core/testing';
import { SiteMembershipService } from './site-memberships.service';
import {
  GetSiteMembershipGQL,
  GetSiteMembershipsAndSubscriptionsGQL,
  SiteMembership,
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
  SiteMembershipSubscription,
} from '../../../../graphql/generated.engine';
import { MockService } from '../../../utils/mock';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../common/services/toaster.service';
import { lastValueFrom, of } from 'rxjs';

export const mockSiteMemberships: SiteMembership[] = [
  {
    id: '1',
    membershipGuid: '1234567890',
    membershipName: 'name 1',
    membershipDescription: 'description 1',
    membershipPriceInCents: 2999,
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
    membershipPriceInCents: 1999,
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

export const mockSiteMembershipSubscriptions: SiteMembershipSubscription[] = [
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

describe('SiteMembershipService', () => {
  let service: SiteMembershipService;
  let getSiteMembershipGQL: jasmine.SpyObj<GetSiteMembershipGQL>;

  beforeEach(() => {
    getSiteMembershipGQL = jasmine.createSpyObj('GetSiteMembershipGQL', [
      'fetch',
    ]);

    TestBed.configureTestingModule({
      providers: [
        SiteMembershipService,
        {
          provide: GetSiteMembershipsAndSubscriptionsGQL,
          useValue: jasmine.createSpyObj<GetSiteMembershipsAndSubscriptionsGQL>(
            ['fetch']
          ),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: GetSiteMembershipGQL,
          useValue: getSiteMembershipGQL,
        },
      ],
    });

    service = TestBed.inject(SiteMembershipService);
    spyOn(console, 'error');
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('fetch', () => {
    it('should fetch site memberships and subscriptions with network-only policy', async () => {
      service.siteMemberships$.next([]);
      service.siteMembershipSubscriptions$.next([]);

      (
        service as any
      ).getSiteMembershipsAndSubscriptionsGQL.fetch.and.returnValue(
        of({
          data: {
            siteMemberships: mockSiteMemberships,
            siteMembershipSubscriptions: mockSiteMembershipSubscriptions,
          },
        })
      );

      await service.fetch(true);

      expect(
        (service as any).getSiteMembershipsAndSubscriptionsGQL.fetch
      ).toHaveBeenCalledWith(null, {
        fetchPolicy: 'network-only',
      });
      expectAsync(lastValueFrom(service.siteMemberships$)).toBeResolvedTo(
        mockSiteMemberships
      );
      expectAsync(
        lastValueFrom(service.siteMembershipSubscriptions$)
      ).toBeResolvedTo(mockSiteMembershipSubscriptions);
    });

    it('should fetch site memberships and subscriptions with cache-first policy', async () => {
      service.siteMemberships$.next([]);
      service.siteMembershipSubscriptions$.next([]);

      (
        service as any
      ).getSiteMembershipsAndSubscriptionsGQL.fetch.and.returnValue(
        of({
          data: {
            siteMemberships: mockSiteMemberships,
            siteMembershipSubscriptions: mockSiteMembershipSubscriptions,
          },
        })
      );

      await service.fetch(false);

      expect(
        (service as any).getSiteMembershipsAndSubscriptionsGQL.fetch
      ).toHaveBeenCalledWith(null, {
        fetchPolicy: 'cache-first',
      });
    });

    it('should handle errors', async () => {
      (service as any).siteMemberships$.next([]);
      (service as any).siteMembershipSubscriptions$.next([]);

      (
        service as any
      ).getSiteMembershipsAndSubscriptionsGQL.fetch.and.returnValue(
        of({
          errors: ['error'],
        })
      );

      await service.fetch(true);

      expect(
        (service as any).getSiteMembershipsAndSubscriptionsGQL.fetch
      ).toHaveBeenCalledOnceWith(null, {
        fetchPolicy: 'network-only',
      });

      expectAsync(
        lastValueFrom((service as any).siteMemberships$)
      ).toBeResolvedTo([]);
      expectAsync(
        lastValueFrom((service as any).siteMembershipSubscriptions$)
      ).toBeResolvedTo([]);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        DEFAULT_ERROR_MESSAGE
      );
    });

    it('should handle no data', async () => {
      (service as any).siteMemberships$.next([]);
      (service as any).siteMembershipSubscriptions$.next([]);

      (
        service as any
      ).getSiteMembershipsAndSubscriptionsGQL.fetch.and.returnValue(
        of({
          data: {
            siteMemberships: null,
            siteMembershipSubscriptions: null,
          },
        })
      );

      await service.fetch(true);

      expect(
        (service as any).getSiteMembershipsAndSubscriptionsGQL.fetch
      ).toHaveBeenCalledOnceWith(null, {
        fetchPolicy: 'network-only',
      });

      expectAsync(
        lastValueFrom((service as any).siteMemberships$)
      ).toBeResolvedTo([]);
      expectAsync(
        lastValueFrom((service as any).siteMembershipSubscriptions$)
      ).toBeResolvedTo([]);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        DEFAULT_ERROR_MESSAGE
      );
    });
  });

  describe('getLowestPriceMembershipFromArray', () => {
    it('should get the lowest price membership', () => {
      const lowestPriceMembership =
        service.getLowestPriceMembershipFromArray(mockSiteMemberships);
      expect(lowestPriceMembership).toEqual(mockSiteMemberships[1]);
    });
  });

  describe('loadMembershipByGuid', () => {
    it('should fetch and return a SiteMembership for a valid GUID', (done) => {
      const expectedMembership = mockSiteMemberships[1];
      const mockMembershipGuid = mockSiteMemberships[1].membershipGuid;

      getSiteMembershipGQL.fetch.and.returnValue(
        of({
          data: { siteMembership: mockSiteMemberships[1] },
          loading: false,
          networkStatus: 7,
          stale: false,
        })
      );

      service.loadMembershipByGuid(mockMembershipGuid).subscribe((result) => {
        expect(result).toEqual(expectedMembership);
        expect(getSiteMembershipGQL.fetch).toHaveBeenCalledWith({
          membershipGuid: mockMembershipGuid,
        });
        done();
      });
    });
  });
});
