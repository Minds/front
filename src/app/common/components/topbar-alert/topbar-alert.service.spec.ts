import { TestBed } from '@angular/core/testing';
import {
  AlertKey,
  GET_TOPBAR_QUERY,
  TopbarAlertService,
} from './topbar-alert.service';
import { Session } from '../../../services/session';
import { ObjectLocalStorageService } from '../../services/object-local-storage.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, firstValueFrom, skip, take } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { MockService } from '../../../utils/mock';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import userMock from '../../../mocks/responses/user.mock';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';
import { ConfigsService } from '../../services/configs.service';
import { PushNotificationService } from '../../services/push-notification.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('TopbarAlertService', () => {
  let service: TopbarAlertService;
  let sessionMock: Partial<Session>;
  let controller: ApolloTestingController;

  beforeEach(() => {
    sessionMock = {
      user$: new BehaviorSubject<MindsUser | null>(null),
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
    };

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule.withClients(['strapi'])],
      providers: [
        TopbarAlertService,
        { provide: Session, useValue: sessionMock },
        {
          provide: ObjectLocalStorageService,
          useValue: MockService(ObjectLocalStorageService, {
            getAll: () => {
              return {};
            },
          }),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        {
          provide: PushNotificationService,
          useValue: MockService(PushNotificationService, {
            has: ['enabled$', 'supported$'],
            props: {
              enabled$: { get: () => new BehaviorSubject<boolean>(true) },
              supported$: { get: () => new BehaviorSubject<boolean>(true) },
            },
          }),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: IS_TENANT_NETWORK,
          useValue: false,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TopbarAlertService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dismiss an alert', async () => {
    // Pull the identifie (will call Apollo)
    service.identifier$.subscribe((identifier) => {});

    // Apollo will expect this query
    const op = controller.expectOne(GET_TOPBAR_QUERY);

    // Mock the Apollo response
    op.flush({
      data: {
        topbarAlert: {
          data: {
            id: 1,
            attributes: {
              message: 'test',
              enabled: true,
              url: '',
              identifier: 'spectest',
              onlyDisplayAfter: '',
            },
          },
        },
      },
    });

    const alertKey: AlertKey = 'spectest';

    // Mock the response from getDismissedAlerts
    (service as any).objectStorage.getAll.and.returnValue({ spectest: '1' });

    await service.dismiss();

    // Object store should be updated
    expect((service as any).objectStorage.setSingle).toHaveBeenCalledWith(
      (service as any).storageKey,
      {
        [alertKey]: '1',
      }
    );

    // Dismissed alerts should be repopulated
    const dismissedAlerts: AlertKey[] = await firstValueFrom(
      service.dismissedAlerts$.pipe(skip(1))
    );
    expect(dismissedAlerts[0]).toBe(alertKey);
  });

  it('shouldShow$ to emit true when logged in', async () => {
    // Provide a test user (so we look like we're logged in)
    sessionMock.user$?.next(userMock);

    // Kicks off the request
    service.shouldShow$.subscribe();

    // Apollo will expect this query
    const op = controller.expectOne(GET_TOPBAR_QUERY);

    // Mock the Apollo response
    op.flush({
      data: {
        topbarAlert: {
          data: {
            id: 1,
            attributes: {
              message: 'test',
              enabled: true,
              url: '',
              identifier: 'spectest',
              onlyDisplayAfter: new Date(Date.now() - 1000).toISOString(),
            },
          },
        },
      },
    });

    expect(await firstValueFrom(service.shouldShow$)).toBe(true);
  });

  it('shouldShow$ to emit false when logged out', async () => {
    sessionMock.user$?.next(null);

    // Kicks off the request
    service.shouldShow$.subscribe();

    // Apollo will expect this query
    const op = controller.expectOne(GET_TOPBAR_QUERY);

    // Mock the Apollo response
    op.flush({
      data: {
        topbarAlert: {
          data: {
            id: 1,
            attributes: {
              message: 'test',
              enabled: true,
              url: '',
              identifier: 'spectest',
              onlyDisplayAfter: new Date(Date.now() - 1000).toISOString(),
            },
          },
        },
      },
    });

    expect(await firstValueFrom(service.shouldShow$)).toBe(false);
  });

  it('should not display if onlyDisplayAfter is in the future', async () => {
    // Provide a test user (so we look like we're logged in)
    sessionMock.user$?.next(userMock);

    // Kicks off the request
    service.shouldShow$.subscribe();

    // Apollo will expect this query
    const op = controller.expectOne(GET_TOPBAR_QUERY);

    // Mock the Apollo response
    op.flush({
      data: {
        topbarAlert: {
          data: {
            id: 1,
            attributes: {
              message: 'test',
              enabled: true,
              url: '',
              identifier: 'spectest',
              onlyDisplayAfter: new Date(Date.now() + 1000).toISOString(),
            },
          },
        },
      },
    });

    expect(await firstValueFrom(service.shouldShow$)).toBe(false);
  });

  it('should not display if enabled is false', async () => {
    // Provide a test user (so we look like we're logged in)
    sessionMock.user$?.next(userMock);

    // Kicks off the request
    service.shouldShow$.subscribe();

    // Apollo will expect this query
    const op = controller.expectOne(GET_TOPBAR_QUERY);

    // Mock the Apollo response
    op.flush({
      data: {
        topbarAlert: {
          data: {
            id: 1,
            attributes: {
              message: 'test',
              enabled: false,
              url: '',
              identifier: 'spectest',
              onlyDisplayAfter: new Date(Date.now() - 1000).toISOString(),
            },
          },
        },
      },
    });

    expect(await firstValueFrom(service.shouldShow$)).toBe(false);
  });

  it('should not display an alert I have already dismissed', async () => {
    // Provide a test user (so we look like we're logged in)
    sessionMock.user$?.next(userMock);

    // Mock the response from getDismissedAlerts
    (service as any).objectStorage.getAll.and.returnValue({ spectest: '1' });
    service.dismissedAlerts$.next(['spectest']);

    // Kicks off the request
    service.shouldShow$.subscribe();

    // Apollo will expect this query
    const op = controller.expectOne(GET_TOPBAR_QUERY);

    // Mock the Apollo response
    op.flush({
      data: {
        topbarAlert: {
          data: {
            id: 1,
            attributes: {
              message: 'test',
              enabled: true,
              url: '',
              identifier: 'spectest',
              onlyDisplayAfter: new Date(Date.now() - 1000).toISOString(),
            },
          },
        },
      },
    });

    expect(await firstValueFrom(service.shouldShow$)).toBe(false);
  });

  it('should display an alert if the identifier is different to alerts I have dismissed', async () => {
    // Provide a test user (so we look like we're logged in)
    sessionMock.user$?.next(userMock);

    // Mock the response from getDismissedAlerts
    (service as any).objectStorage.getAll.and.returnValue({ spectest: '1' });
    service.dismissedAlerts$.next(['spectest']);

    // Kicks off the request
    service.shouldShow$.subscribe();

    // Apollo will expect this query
    const op = controller.expectOne(GET_TOPBAR_QUERY);

    // Mock the Apollo response
    op.flush({
      data: {
        topbarAlert: {
          data: {
            id: 1,
            attributes: {
              message: 'test',
              enabled: true,
              url: '',
              identifier: 'spectest_alt',
              onlyDisplayAfter: new Date(Date.now() - 1000).toISOString(),
            },
          },
        },
      },
    });

    expect(await firstValueFrom(service.shouldShow$)).toBe(true);
  });

  describe('shouldShowPushNotificationAlert$', () => {
    it('should emit true for shouldShow$ when a push notification banner should be shown', (done: DoneFn) => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).pushNotificationService.enabled$.next(false);
      (service as any).pushNotificationService.supported$.next(true);

      service.shouldShowPushNotificationAlert$
        .pipe(take(1))
        .subscribe((shouldShow) => {
          expect(shouldShow).toBe(true);
          done();
        });
    });

    it('should emit false for shouldShow$ when a push notification banner should NOT be shown because the user is not logged in', (done: DoneFn) => {
      (service as any).session.isLoggedIn.and.returnValue(false);
      (service as any).pushNotificationService.enabled$.next(false);
      (service as any).pushNotificationService.supported$.next(true);

      service.shouldShowPushNotificationAlert$
        .pipe(take(1))
        .subscribe((shouldShow) => {
          expect(shouldShow).toBe(false);
          done();
        });
    });

    it('should emit false for shouldShow$ when a push notification banner should NOT be shown because push notifications are enabled', (done: DoneFn) => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).pushNotificationService.enabled$.next(true);
      (service as any).pushNotificationService.supported$.next(true);

      service.shouldShowPushNotificationAlert$
        .pipe(take(1))
        .subscribe((shouldShow) => {
          expect(shouldShow).toBe(false);
          done();
        });
    });

    it('should emit false for shouldShow$ when a push notification banner should NOT be shown because push notifications are not supported', (done: DoneFn) => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).pushNotificationService.enabled$.next(false);
      (service as any).pushNotificationService.supported$.next(false);

      service.shouldShowPushNotificationAlert$
        .pipe(take(1))
        .subscribe((shouldShow) => {
          expect(shouldShow).toBe(false);
          done();
        });
    });
  });

  describe('shouldShowTenantTrialAlert', () => {
    it('should determine when a trial banner should be shown', () => {
      Object.defineProperty(service, 'isTenantNetwork', {
        value: true,
        writable: true,
      });
      (service as any).config.get.withArgs('tenant').and.returnValue({
        'is_trial': true,
      });

      expect(service.shouldShowTenantTrialAlert()).toBe(true);
    });

    it('should determine when a trial banner should NOT be shown because it is not a tenant network', () => {
      Object.defineProperty(service, 'isTenantNetwork', {
        value: false,
        writable: true,
      });
      (service as any).config.get.withArgs('tenant').and.returnValue({
        'is_trial': true,
      });

      expect(service.shouldShowTenantTrialAlert()).toBe(false);
    });

    it('should determine when a trial banner should NOT be shown because it is not a tenant trial', () => {
      Object.defineProperty(service, 'isTenantNetwork', {
        value: true,
        writable: true,
      });
      (service as any).config.get.withArgs('tenant').and.returnValue({
        'is_trial': false,
      });

      expect(service.shouldShowTenantTrialAlert()).toBe(false);
    });
  });
});
