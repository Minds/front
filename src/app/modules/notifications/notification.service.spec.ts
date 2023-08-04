import {
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { Session } from '../../services/session';
import { Client } from '../../services/api';
import { SocketsService } from '../../services/sockets';
import { MetaService } from '../../common/services/meta.service';
import { NotificationCountSocketsService } from './notification-count-sockets.service';
import { NotificationCountSocketsExperimentService } from '../experiments/sub-services/notification-count-sockets-experiment.service';
import { SiteService } from '../../common/services/site.service';
import { PLATFORM_ID } from '@angular/core';
import userMock from '../../mocks/responses/user.mock';
import { MockService } from '../../utils/mock';
import { Subject, Subscription } from 'rxjs';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: Session, useValue: MockService(Session) },
        { provide: Client, useValue: MockService(Client) },
        { provide: SocketsService, useValue: MockService(SocketsService) },
        { provide: MetaService, useValue: MockService(MetaService) },
        {
          provide: NotificationCountSocketsService,
          useValue: MockService(NotificationCountSocketsService, {
            has: ['count$'],
            props: {
              count$: {
                get: () => new Subject<boolean>(),
              },
            },
          }),
        },
        {
          provide: NotificationCountSocketsExperimentService,
          useValue: MockService(NotificationCountSocketsExperimentService),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SiteService, useValue: MockService(SiteService) },
      ],
    });

    service = TestBed.inject(NotificationService);

    (service as any).session.getLoggedInUser.and.returnValue(userMock);
    (service as any).notificationCountExperiment.isActive.and.returnValue(true);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  describe('listen', () => {
    it('should listen and subscribe to count changes', () => {
      (service as any).notificationCountExperiment.isActive.and.returnValue(
        true
      );
      (service as any).session.getLoggedInUser.and.returnValue(userMock);

      service.listen();

      expect(
        (service as any).notificationCountSockets.listen
      ).toHaveBeenCalledWith(userMock.guid);
    });

    it('should NOT listen and subscribe to count changes when experiment is off', () => {
      (service as any).notificationCountExperiment.isActive.and.returnValue(
        false
      );
      (service as any).session.getLoggedInUser.and.returnValue(userMock);

      service.listen();

      expect(
        (service as any).notificationCountSockets.listen
      ).not.toHaveBeenCalled();
    });

    it('should NOT listen and subscribe to count changes when user is not logged in', () => {
      (service as any).notificationCountExperiment.isActive.and.returnValue(
        true
      );
      (service as any).session.getLoggedInUser.and.returnValue(null);

      service.listen();

      expect(
        (service as any).notificationCountSockets.listen
      ).not.toHaveBeenCalled();
    });

    it('should listen and sync count on new count$ emission', () => {
      (service as any).notificationCountExperiment.isActive.and.returnValue(
        true
      );
      (service as any).session.getLoggedInUser.and.returnValue(userMock);
      const count: number = 4;

      service.listen();
      (service as any).notificationCountSockets.count$.next(count);

      expect((service as any).count).toBe(count);
      expect((service as any).metaService.setCounter).toHaveBeenCalledWith(
        count
      );
    });
  });

  describe('unlisten', () => {
    it('should unlisten', () => {
      (service as any).notificationCountSocketSubscription = new Subscription();
      (service as any).notificationCountExperiment.isActive.and.returnValue(
        true
      );
      expect(
        (service as any).notificationCountSocketSubscription.closed
      ).toBeFalse();

      service.unlisten();

      expect(
        (service as any).notificationCountSockets.leaveAll
      ).toHaveBeenCalled();
      expect(
        (service as any).notificationCountSocketSubscription.closed
      ).toBeTrue();
    });

    it('should NOT unlisten when experiment is off', () => {
      (service as any).notificationCountExperiment.isActive.and.returnValue(
        false
      );

      service.unlisten();

      expect(
        (service as any).notificationCountSockets.leaveAll
      ).not.toHaveBeenCalled();
    });
  });

  describe('updateNotificationCount', () => {
    it('should update notification count', fakeAsync(() => {
      const responseCount: number = 5;
      (service as any).notificationCountExperiment.isActive.and.returnValue(
        true
      );
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).client.get
        .withArgs('api/v3/notifications/unread-count', {})
        .and.returnValue(Promise.resolve({ count: responseCount }));

      service.updateNotificationCount();
      tick();

      expect((service as any).client.get).toHaveBeenCalledWith(
        'api/v3/notifications/unread-count',
        {}
      );
      expect((service as any).count).toBe(responseCount);
      expect((service as any).metaService.setCounter).toHaveBeenCalledWith(
        responseCount
      );
    }));

    it('should NOT update notification count if a user is not logged in', fakeAsync(() => {
      (service as any).notificationCountExperiment.isActive.and.returnValue(
        true
      );
      (service as any).session.isLoggedIn.and.returnValue(false);

      service.updateNotificationCount();
      tick();

      expect((service as any).client.get).not.toHaveBeenCalled();
    }));

    it('should update notification count when socket experiment is off', fakeAsync(() => {
      const responseCount: number = 5;
      (service as any).notificationCountExperiment.isActive.and.returnValue(
        false
      );
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).client.get
        .withArgs('api/v3/notifications/unread-count', {})
        .and.returnValue(Promise.resolve({ count: responseCount }));

      service.updateNotificationCount();
      tick();

      expect((service as any).client.get).toHaveBeenCalledWith(
        'api/v3/notifications/unread-count',
        {}
      );
      expect((service as any).count).toBe(responseCount);
      expect((service as any).metaService.setCounter).toHaveBeenCalledWith(
        responseCount
      );

      discardPeriodicTasks();
      flush();
    }));

    it('should NOT update notification count when experiment is off BUT a user is not logged in', fakeAsync(() => {
      (service as any).notificationCountExperiment.isActive.and.returnValue(
        true
      );
      (service as any).session.isLoggedIn.and.returnValue(false);

      service.updateNotificationCount();
      tick();

      expect((service as any).client.get).not.toHaveBeenCalled();

      discardPeriodicTasks();
      flush();
    }));
  });

  describe('incrementCount', () => {
    it('should increment count', () => {
      const baseCount: number = 2;
      const countIncrement: number = 3;
      const newCount: number = baseCount + countIncrement;
      service.count = baseCount;
      service.count$.next(baseCount);

      service.incrementCount(countIncrement);

      expect(service.count).toBe(newCount);
      expect((service as any).metaService.setCounter).toHaveBeenCalledWith(
        newCount
      );
    });
  });

  describe('clearCount', () => {
    it('should clear count', () => {
      const baseCount: number = 2;
      const newCount: number = 0;
      service.count = baseCount;
      service.count$.next(baseCount);

      service.clearCount();

      expect(service.count).toBe(newCount);
      expect((service as any).metaService.setCounter).toHaveBeenCalledWith(
        newCount
      );
    });
  });
});
