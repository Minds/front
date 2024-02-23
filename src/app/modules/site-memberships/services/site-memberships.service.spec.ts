import { TestBed } from '@angular/core/testing';
import { SiteMembershipService } from './site-memberships.service';
import {
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
  },
];

export const mockSiteMembershipSubscriptions: SiteMembershipSubscription[] = [
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

describe('SiteMembershipService', () => {
  let service: SiteMembershipService;

  beforeEach(() => {
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
      ],
    });

    service = TestBed.inject(SiteMembershipService);
    spyOn(console, 'error');
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('fetch', () => {
    it('should fetch site memberships and subscriptions', async () => {
      (service as any).siteMemberships$.next([]);
      (service as any).siteMembershipSubscriptions$.next([]);

      (service as any).getSiteMembershipsAndSubscriptionsGQL.fetch.and.returnValue(
        of({
          data: {
            siteMemberships: mockSiteMemberships,
            siteMembershipSubscriptions: mockSiteMembershipSubscriptions,
          },
        })
      );

      await service.fetch();

      expect(
        (service as any).getSiteMembershipsAndSubscriptionsGQL.fetch
      ).toHaveBeenCalledOnceWith(null, {
        fetchPolicy: 'network-only',
      });

      expectAsync(
        lastValueFrom((service as any).siteMemberships$)
      ).toBeResolvedTo(mockSiteMemberships);
      expectAsync(
        lastValueFrom((service as any).siteMembershipSubscriptions$)
      ).toBeResolvedTo(mockSiteMembershipSubscriptions);
    });

    it('should handle errors', async () => {
      (service as any).siteMemberships$.next([]);
      (service as any).siteMembershipSubscriptions$.next([]);

      (service as any).getSiteMembershipsAndSubscriptionsGQL.fetch.and.returnValue(
        of({
          errors: ['error'],
        })
      );

      await service.fetch();

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

      (service as any).getSiteMembershipsAndSubscriptionsGQL.fetch.and.returnValue(
        of({
          data: {
            siteMemberships: null,
            siteMembershipSubscriptions: null,
          },
        })
      );

      await service.fetch();

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
      const lowestPriceMembership = service.getLowestPriceMembershipFromArray(
        mockSiteMemberships
      );
      expect(lowestPriceMembership).toEqual(mockSiteMemberships[1]);
    });
  });
});
