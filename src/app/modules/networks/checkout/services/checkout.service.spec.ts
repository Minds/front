import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApolloQueryResult } from '@apollo/client';
import { NetworksCheckoutService } from './checkout.service';
import {
  CheckoutPageKeyEnum,
  CheckoutTimePeriodEnum,
  GetCheckoutLinkGQL,
  GetCheckoutPageGQL,
  GetCheckoutPageQuery,
  GetCheckoutPageQueryVariables,
  Summary,
} from '../../../../../graphql/generated.engine';
import {
  mockCheckoutPage,
  mockSummary,
} from '../../../../mocks/responses/network-checkout.mock';
import { ToasterService } from '../../../../common/services/toaster.service';
import { MockService } from '../../../../utils/mock';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';

describe('NetworksCheckoutService', () => {
  let service: NetworksCheckoutService;

  const mockResponse: ApolloQueryResult<GetCheckoutPageQuery> = {
    loading: false,
    networkStatus: 7,
    data: {
      checkoutPage: mockCheckoutPage,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworksCheckoutService,
        {
          provide: GetCheckoutPageGQL,
          useValue: jasmine.createSpyObj<GetCheckoutPageGQL>(['watch']),
        },
        {
          provide: GetCheckoutLinkGQL,
          useValue: jasmine.createSpyObj<GetCheckoutLinkGQL>(['fetch']),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
        {
          provide: DOCUMENT,
          useValue: {
            defaultView: {
              location: {
                replace: jasmine.createSpy('replace'),
              },
            },
          },
        },
      ],
    });

    service = TestBed.inject(NetworksCheckoutService);
    (service as any).getCheckoutPageGQL.watch.calls.reset();
    (service as any).getCheckoutLinkGQL.fetch.calls.reset();
    (service as any).document.defaultView.location.replace.calls.reset();
    (service as any).getCheckoutPageQuery = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should load the checkout page', fakeAsync(() => {
      (service as any).checkoutPage$.next(null);
      (service as any).loaded$.next(false);
      (service as any).summaryChangeInProgress$.next(true);

      const variables: GetCheckoutPageQueryVariables = {
        planId: 'networks_community',
        page: CheckoutPageKeyEnum.Addons,
        timePeriod: CheckoutTimePeriodEnum.Monthly,
      };
      (service as any).getCheckoutPageGQL.watch.and.returnValue({
        valueChanges: of(mockResponse),
      });

      service.init(variables);
      tick();

      expect(
        (service as any).getCheckoutPageGQL.watch
      ).toHaveBeenCalledOnceWith(variables, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all',
      });
      expect((service as any).checkoutPage$.getValue()).toEqual(
        mockCheckoutPage
      );
      expect((service as any).loaded$.getValue()).toBeTrue();
      expect((service as any).summaryChangeInProgress$.getValue()).toBeFalse();
    }));

    it('should redirect on error while loading the checkout page', fakeAsync(() => {
      (service as any).checkoutPage$.next(null);
      (service as any).loaded$.next(false);
      (service as any).summaryChangeInProgress$.next(true);

      const variables: GetCheckoutPageQueryVariables = {
        planId: 'networks_community',
        page: CheckoutPageKeyEnum.Addons,
        timePeriod: CheckoutTimePeriodEnum.Monthly,
      };
      (service as any).getCheckoutPageGQL.watch.and.returnValue({
        valueChanges: of({
          errors: [new Error('error')],
        }),
      });

      service.init(variables);
      tick();

      expect(
        (service as any).getCheckoutPageGQL.watch
      ).toHaveBeenCalledOnceWith(variables, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all',
      });
      expect((service as any).toasterService.error).toHaveBeenCalled();
      expect((service as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/about/networks'
      );
    }));
  });

  describe('selectTimePeriod', () => {
    it('should select a time period and refetch the checkout page', fakeAsync(() => {
      (service as any).getCheckoutPageQuery = {
        refetch: jasmine.createSpy('refetch'),
      };

      service.selectTimePeriod(CheckoutTimePeriodEnum.Yearly);
      tick();

      expect(
        (service as any).getCheckoutPageQuery.refetch
      ).toHaveBeenCalledOnceWith({
        timePeriod: CheckoutTimePeriodEnum.Yearly,
      });
    }));
  });

  describe('addAddOn', () => {
    it('should add addon key that is not already added', fakeAsync(() => {
      (service as any).checkoutPage$.next({
        addOns: [
          {
            id: 'networks_community',
            inBasket: false,
          },
        ],
      });

      (service as any).getCheckoutPageQuery = {
        refetch: jasmine.createSpy('refetch'),
      };

      service.addAddOn('networks_community');
      tick();

      expect(
        (service as any).getCheckoutPageQuery.refetch
      ).toHaveBeenCalledOnceWith({
        addOnIds: ['networks_community'],
      });
    }));

    it('should NOT add addon key that is already added', fakeAsync(() => {
      (service as any).checkoutPage$.next({
        addOns: [
          {
            id: 'networks_community',
            inBasket: true,
          },
        ],
      });

      (service as any).getCheckoutPageQuery = {
        refetch: jasmine.createSpy('refetch'),
      };

      service.addAddOn('networks_community');
      tick();

      expect(
        (service as any).getCheckoutPageQuery.refetch
      ).not.toHaveBeenCalled();
    }));
  });

  describe('removeAddOn', () => {
    it('should remove addon key that is already added', fakeAsync(() => {
      (service as any).checkoutPage$.next({
        addOns: [
          {
            id: 'networks_community',
            inBasket: true,
          },
        ],
      });

      (service as any).getCheckoutPageQuery = {
        refetch: jasmine.createSpy('refetch'),
      };

      service.removeAddOn('networks_community');
      tick();

      expect(
        (service as any).getCheckoutPageQuery.refetch
      ).toHaveBeenCalledOnceWith({
        addOnIds: [],
      });
    }));

    it('should NOT remove addon key that is NOT already added', fakeAsync(() => {
      (service as any).checkoutPage$.next({
        addOns: [
          {
            id: 'networks_community',
            inBasket: false,
          },
        ],
      });

      (service as any).getCheckoutPageQuery = {
        refetch: jasmine.createSpy('refetch'),
      };

      service.removeAddOn('networks_community');
      tick();

      expect(
        (service as any).getCheckoutPageQuery.refetch
      ).not.toHaveBeenCalled();
    }));
  });

  describe('navigateToPaymentUrl', () => {
    it('should navigate to payment url', fakeAsync(() => {
      const checkoutLink: string = 'https://test-checkout.minds.com/';
      (service as any).document.defaultView.location.replace.and.returnValue(
        checkoutLink
      );
      (service as any).getCheckoutLinkGQL.fetch.and.returnValue(
        of({ data: { checkoutLink: checkoutLink } })
      );
      (service as any).summary$ = new BehaviorSubject<Summary>(mockSummary);
      (service as any).selectedTimePeriod$ = new BehaviorSubject<
        CheckoutTimePeriodEnum
      >(CheckoutTimePeriodEnum.Monthly);

      service.navigateToPaymentUrl();
      tick();

      expect(
        (service as any).getCheckoutLinkGQL.fetch
      ).toHaveBeenCalledOnceWith(
        {
          planId: mockSummary.planSummary.id,
          addOnIds: mockSummary.addonsSummary.map(addOn => addOn.id),
          timePeriod: CheckoutTimePeriodEnum.Monthly,
        },
        { fetchPolicy: 'no-cache', errorPolicy: 'all' }
      );
      expect(
        (service as any).document.defaultView.location.replace
      ).toHaveBeenCalledOnceWith(checkoutLink);
    }));
  });
});
