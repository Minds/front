import { TestBed } from '@angular/core/testing';
import {
  AlertKey,
  GET_TOPBAR_QUERY,
  TopbarAlertService,
} from './topbar-alert.service';
import { Session } from '../../../services/session';
import { ObjectLocalStorageService } from '../../services/object-local-storage.service';
import { Apollo } from 'apollo-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, firstValueFrom, of, skip, take } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { MockService } from '../../../utils/mock';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import userMock from '../../../mocks/responses/user.mock';

describe('TopbarAlertService', () => {
  let service: TopbarAlertService;
  let sessionMock: Partial<Session>;
  let controller: ApolloTestingController;

  beforeEach(() => {
    sessionMock = {
      user$: new BehaviorSubject<MindsUser | null>(null),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ApolloTestingModule],
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
        { provide: PLATFORM_ID, useValue: 'browser' },
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
    service.identifier$.subscribe(identifier => {});

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
});
