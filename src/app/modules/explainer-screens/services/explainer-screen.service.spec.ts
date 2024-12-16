import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ExplainerScreensService } from './explainer-screen.service';
import {
  ExplainerScreenWeb,
  GetExplainerScreensDocument,
} from '../../../../graphql/generated.strapi';
import { of, take } from 'rxjs';
import { ExplainerScreenModalService } from './explainer-screen-lazy-modal.service';
import { DismissalV2Service } from '../../../common/services/dismissal-v2.service';
import { MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('ExplainerScreensService', () => {
  let service: ExplainerScreensService;
  let controller: ApolloTestingController;

  const mockGetExplainerScreensResponse = {
    data: {
      explainerScreensWeb: {
        data: [
          {
            attributes: {
              continueButton: {
                __typename: 'ComponentExplainerScreenContinueButton',
                id: 'id',
                text: 'Continue',
                dataRef: 'data-ref-boost-continue',
              },
              key: 'boost',
              section: [
                {
                  __typename: 'ComponentExplainerScreenSection',
                  id: '1',
                  title: 'Boost section title 1',
                  description: 'Boost section description 1',
                  icon: 'icon1',
                },
                {
                  __typename: 'ComponentExplainerScreenSection',
                  id: '2',
                  title: 'Boost section title 2',
                  description: 'Boost section description 2',
                  icon: 'icon2',
                },
              ],
              subtitle: 'Boost subtitle',
              title: 'Boost',
              triggerRoute: '/boost/boost-console',
            },
          },
          {
            attributes: {
              continueButton: {
                __typename: 'ComponentExplainerScreenContinueButton',
                id: 'id',
                text: 'Continue',
                dataRef: 'data-ref-affiliate-continue',
              },
              key: 'affiliates',
              section: [
                {
                  __typename: 'ComponentExplainerScreenSection',
                  id: '1',
                  title: 'Affiliate section title 1',
                  description: 'Affiliate section description 1',
                  icon: 'icon1',
                },
                {
                  __typename: 'ComponentExplainerScreenSection',
                  id: '2',
                  title: 'Affiliate section title 2',
                  description: 'Affiliate section description 2',
                  icon: 'icon2',
                },
              ],
              subtitle: 'Affiliate Subtitle',
              title: 'Affiliate',
              triggerRoute: '/settings/affiliates',
            },
          },
        ],
      },
    },
  };

  const mockExplainerScreens: ExplainerScreenWeb[] = [
    {
      __typename: 'ExplainerScreenWeb',
      continueButton: {
        __typename: 'ComponentExplainerScreenContinueButton',
        id: 'id',
        text: 'Continue',
        dataRef: 'data-ref-boost-continue',
      },
      createdAt: 1688988708,
      key: 'boost',
      publishedAt: 1688988708,
      section: [
        {
          __typename: 'ComponentExplainerScreenSection',
          id: '1',
          title: 'Boost section title 1',
          description: 'Boost section description 1',
          icon: 'icon1',
        },
        {
          __typename: 'ComponentExplainerScreenSection',
          id: '2',
          title: 'Boost section title 2',
          description: 'Boost section description 2',
          icon: 'icon2',
        },
      ],
      subtitle: 'Boost subtitle',
      title: 'Boost',
      triggerRoute: '/boost/boost-console',
      updatedAt: 1688988708,
    },
    {
      __typename: 'ExplainerScreenWeb',
      continueButton: {
        __typename: 'ComponentExplainerScreenContinueButton',
        id: 'id',
        text: 'Continue',
        dataRef: 'data-ref-affiliate-continue',
      },
      createdAt: 1688988709,
      key: 'affiliates',
      publishedAt: 1688988709,
      section: [
        {
          __typename: 'ComponentExplainerScreenSection',
          id: '1',
          title: 'Affiliate section title 1',
          description: 'Affiliate section description 1',
          icon: 'icon1',
        },
        {
          __typename: 'ComponentExplainerScreenSection',
          id: '2',
          title: 'Affiliate section title 2',
          description: 'Affiliate section description 2',
          icon: 'icon2',
        },
      ],
      subtitle: 'Affiliate Subtitle',
      title: 'Affiliate',
      triggerRoute: '/settings/affiliates',
      updatedAt: 1688988709,
    },
    {
      __typename: 'ExplainerScreenWeb',
      continueButton: {
        __typename: 'ComponentExplainerScreenContinueButton',
        id: 'id',
        text: 'Continue',
        dataRef: 'data-ref-supermind-request-continue',
      },
      createdAt: 1688988709,
      key: 'supermind_request',
      publishedAt: 1688988709,
      section: [
        {
          __typename: 'ComponentExplainerScreenSection',
          id: '1',
          title: 'Supermind request section title 1',
          description: 'Affiliate section description 1',
          icon: 'icon1',
        },
        {
          __typename: 'ComponentExplainerScreenSection',
          id: '2',
          title: 'Supermind request section title 2',
          description: 'Affiliate section description 2',
          icon: 'icon2',
        },
      ],
      subtitle: 'Supermind request Subtitle',
      title: 'Supermind request title',
      triggerRoute: null,
      updatedAt: 1688988709,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule.withClients(['strapi'])],
      providers: [
        ExplainerScreensService,
        {
          provide: ExplainerScreenModalService,
          useValue: MockService(ExplainerScreenModalService),
        },
        {
          provide: DismissalV2Service,
          useValue: MockService(DismissalV2Service),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ExplainerScreensService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be init', () => {
    expect(service).toBeTruthy();
  });

  describe('getExplainerScreens$', () => {
    it('should get explainer screens from server', (done: DoneFn) => {
      (service as any).getExplainerScreens$
        .pipe(take(1))
        .subscribe((explanationScreens: ExplainerScreenWeb[]) => {
          expect(explanationScreens[0] as any).toEqual({
            key: 'boost',
            triggerRoute: '/boost/boost-console',
            title: 'Boost',
            subtitle: 'Boost subtitle',
            section: [
              {
                icon: 'icon1',
                title: 'Boost section title 1',
                description: 'Boost section description 1',
              },
              {
                icon: 'icon2',
                title: 'Boost section title 2',
                description: 'Boost section description 2',
              },
            ],
            continueButton: {
              text: 'Continue',
              dataRef: 'data-ref-boost-continue',
            },
          });
          expect(explanationScreens[1] as any).toEqual({
            key: 'affiliates',
            triggerRoute: '/settings/affiliates',
            title: 'Affiliate',
            subtitle: 'Affiliate Subtitle',
            section: [
              {
                icon: 'icon1',
                title: 'Boost section title 1',
                description: 'Boost section description 1',
              },
              {
                icon: 'icon2',
                title: 'Boost section title 2',
                description: 'Boost section description 2',
              },
            ],
            continueButton: {
              text: 'Continue',
              dataRef: 'data-ref-boost-continue',
            },
          });
          controller.verify();
          done();
        });

      const op = controller.expectOne(GetExplainerScreensDocument);
      op.flush(mockGetExplainerScreensResponse);
    });
  });

  describe('triggerRoutes$', () => {
    it('should get trigger routes from server', (done: DoneFn) => {
      (service as any).triggerRoutes$
        .pipe(take(1))
        .subscribe((triggerRoutes: string[]) => {
          expect(triggerRoutes).toEqual([
            '/boost/boost-console',
            '/settings/affiliates',
          ]);
          controller.verify();
          done();
        });

      const op = controller.expectOne(GetExplainerScreensDocument);
      op.flush(mockGetExplainerScreensResponse);
    });
  });

  describe('handleRouteChange', () => {
    it('should handle matching trigger routes', fakeAsync(() => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).session.getLoggedInUser.and.returnValue({
        email_confirmed: true,
      });
      (service as any).dismissalV2Service.getDismissals.and.returnValue(of([]));
      (service as any).triggerRoutes$ = of([
        '/boost/boost-console',
        '/settings/affiliates',
      ]);
      (service as any).getExplainerScreens$ = of(mockExplainerScreens);

      service.handleRouteChange('/boost/boost-console');
      tick();

      expect((service as any).explainerScreenModal.open).toHaveBeenCalled();
    }));

    it('should handle completely non-matching trigger routes', fakeAsync(() => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).session.getLoggedInUser.and.returnValue({
        email_confirmed: true,
      });
      (service as any).dismissalV2Service.getDismissals.and.returnValue(of([]));
      (service as any).triggerRoutes$ = of([
        '/boost/boost-console',
        '/settings/affiliates',
      ]);
      (service as any).getExplainerScreens$ = of(mockExplainerScreens);

      service.handleRouteChange('/unknown/route');
      tick();

      expect((service as any).explainerScreenModal.open).not.toHaveBeenCalled();
    }));

    it('should handle wildcard matching trigger routes', fakeAsync(() => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).session.getLoggedInUser.and.returnValue({
        email_confirmed: true,
      });
      (service as any).dismissalV2Service.getDismissals.and.returnValue(of([]));
      mockExplainerScreens[1].triggerRoute = '/boost/boost-console/*';
      (service as any).getExplainerScreens$ = of(mockExplainerScreens);
      (service as any).triggerRoutes$ = of([
        // NOTE: CHECK WILDCARD ROUTE - NOT WORKING.
        '/boost/boost-console/*',
        '/settings/affiliates',
      ]);

      service.handleRouteChange('/boost/boost-console/subroute');
      tick();

      expect((service as any).explainerScreenModal.open).toHaveBeenCalled();
    }));

    it('should handle partially non-matching trigger routes', fakeAsync(() => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).session.getLoggedInUser.and.returnValue({
        email_confirmed: true,
      });
      (service as any).dismissalV2Service.getDismissals.and.returnValue(of([]));
      (service as any).triggerRoutes$ = of([
        '/boost/boost-console/subroute',
        '/settings/affiliates',
      ]);
      (service as any).getExplainerScreens$ = of(mockExplainerScreens);

      service.handleRouteChange('/boost/boost-console');
      tick();

      expect((service as any).explainerScreenModal.open).not.toHaveBeenCalled();
    }));

    it('should NOT handle matching trigger routes when logged in with no confirmed email', fakeAsync(() => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).session.getLoggedInUser.and.returnValue({
        email_confirmed: false,
      });
      (service as any).dismissalV2Service.getDismissals.and.returnValue(of([]));
      (service as any).triggerRoutes$ = of([
        '/boost/boost-console',
        '/settings/affiliates',
      ]);
      (service as any).getExplainerScreens$ = of(mockExplainerScreens);

      service.handleRouteChange('/boost/boost-console');
      tick();

      expect((service as any).explainerScreenModal.open).not.toHaveBeenCalled();
    }));
  });

  describe('handleManualTriggerByKey', () => {
    beforeEach(() => {
      (service as any).dismissalV2Service.getDismissals.and.returnValue(of([]));
      (service as any).getExplainerScreens$ = of(mockExplainerScreens);
    });

    it('should handle matching trigger by key', fakeAsync(() => {
      service.handleManualTriggerByKey('supermind_request');
      tick();

      expect((service as any).explainerScreenModal.open).toHaveBeenCalled();
    }));

    it('should handle a non-matching trigger by key', fakeAsync(() => {
      service.handleManualTriggerByKey('unknown_key');
      tick();

      expect((service as any).explainerScreenModal.open).not.toHaveBeenCalled();
    }));

    it('should handle a matching trigger by key that has already been dismissed', fakeAsync(() => {
      (service as any).dismissalV2Service.getDismissals.and.returnValue(
        of([{ key: 'supermind_request' }])
      );

      service.handleManualTriggerByKey('supermind_request');
      tick();

      expect((service as any).explainerScreenModal.open).not.toHaveBeenCalled();
    }));
  });
});
