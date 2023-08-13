import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SocketsService } from '../../services/sockets';
import { NotificationCountSocketsService } from './notification-count-sockets.service';
import { Subject, Subscription } from 'rxjs';
import { MockService } from '../../utils/mock';

describe('NotificationCountSocketsService', () => {
  let service: NotificationCountSocketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationCountSocketsService,
        {
          provide: SocketsService,
          useValue: MockService(SocketsService, {
            has: ['onReady$'],
            props: {
              onReady$: {
                get: () => new Subject<boolean>(),
              },
            },
          }),
        },
      ],
    });

    service = TestBed.inject(NotificationCountSocketsService);
  });

  afterEach(() => {
    service.leaveAll();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  describe('listen', () => {
    it('should join a socket room on ready', fakeAsync(() => {
      const userGuid: string = '1234567890123456';
      service.listen(userGuid);

      (service as any).sockets.onReady$.next(true);
      tick();

      expect((service as any).sockets.join).toHaveBeenCalledWith(
        `notification:count:${userGuid}`
      );
      expect((service as any).joinedRooms.length).toBe(1);
    }));

    it('should subscribe to socket events', fakeAsync(() => {
      const userGuid: string = '1234567890123456';

      service.listen(userGuid);
      tick();

      expect((service as any).sockets.subscribe).toHaveBeenCalledWith(
        `notification:count:${userGuid}`,
        jasmine.any(Function)
      );
    }));

    it('should leave all before listening if there is already a count subscription', fakeAsync(() => {
      const userGuid: string = '1234567890123456';
      const roomToJoin: string = `notification:count:${userGuid}`;
      const joinedRooms: string[] = [
        `notification:count:${userGuid}1`,
        `notification:count:${userGuid}2`,
      ];
      (service as any).joinedRooms = joinedRooms;
      (service as any).countSubscription = new Subscription();

      service.listen(userGuid);
      tick();

      for (let joinedRoom of joinedRooms) {
        expect((service as any).sockets.leave).toHaveBeenCalledWith(joinedRoom);
      }
      expect((service as any).sockets.subscribe).toHaveBeenCalledWith(
        roomToJoin,
        jasmine.any(Function)
      );
    }));

    it('should leave all before listening if there is already a ready subscription', fakeAsync(() => {
      const userGuid: string = '1234567890123456';
      const roomToJoin: string = `notification:count:${userGuid}`;
      const joinedRooms: string[] = [
        `notification:count:${userGuid}1`,
        `notification:count:${userGuid}2`,
      ];
      (service as any).joinedRooms = joinedRooms;
      (service as any).onReadySubscription = new Subscription();

      service.listen(userGuid);
      tick();

      for (let joinedRoom of joinedRooms) {
        expect((service as any).sockets.leave).toHaveBeenCalledWith(joinedRoom);
      }
      expect((service as any).sockets.subscribe).toHaveBeenCalledWith(
        roomToJoin,
        jasmine.any(Function)
      );
    }));
  });

  describe('leaveAll', () => {
    it('should leave all rooms', () => {
      const userGuid: string = '1234567890123456';
      const joinedRooms: string[] = [
        `notification:count:${userGuid}1`,
        `notification:count:${userGuid}2`,
      ];
      (service as any).joinedRooms = joinedRooms;

      service.leaveAll();

      for (let joinedRoom of joinedRooms) {
        expect((service as any).sockets.leave).toHaveBeenCalledWith(joinedRoom);
      }
      expect((service as any).joinedRooms.length).toBe(0);
    });
  });

  describe('destroySubscriptions', () => {
    it('should destroy subscriptions', () => {
      (service as any).countSubscription = new Subscription();
      (service as any).onReadySubscription = new Subscription();

      (service as any).destroySubscriptions();

      expect((service as any).countSubscription).toBe(null);
      expect((service as any).onReadySubscription).toBe(null);
    });
  });
});
