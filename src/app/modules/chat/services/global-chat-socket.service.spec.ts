import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GetChatRoomGuidsGQL } from '../../../../graphql/generated.engine';
import {
  CHAT_ROOM_NAME_PREFIX,
  ChatRoomEvent,
  GlobalChatSocketService,
} from './global-chat-socket.service';
import { MockService } from '../../../utils/mock';
import { SocketsService } from '../../../services/sockets';
import { BehaviorSubject, Subscription } from 'rxjs';

describe('GlobalChatSocketService', () => {
  let service: GlobalChatSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SocketsService,
          useValue: MockService(SocketsService, {
            has: ['onReady$'],
            props: {
              onReady$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: GetChatRoomGuidsGQL,
          useValue: jasmine.createSpyObj<GetChatRoomGuidsGQL>(['watch']),
        },
        GlobalChatSocketService,
      ],
    });

    service = TestBed.inject(GlobalChatSocketService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should listen to given room guids', fakeAsync(() => {
    const guid1: string = 'guid1';
    const guid2: string = 'guid2';

    (service as any).sockets.subscribe.and.returnValue(new Subscription());

    service.listenToRoomGuids([guid1, guid2]);
    tick();

    expect((service as any).sockets.join).toHaveBeenCalledWith(
      CHAT_ROOM_NAME_PREFIX + guid1
    );
    expect((service as any).sockets.join).toHaveBeenCalledWith(
      CHAT_ROOM_NAME_PREFIX + guid2
    );
    expect(
      (service as any).roomMap.get(CHAT_ROOM_NAME_PREFIX + guid1)
    ).toBeTruthy();
    expect(
      (service as any).roomMap.get(CHAT_ROOM_NAME_PREFIX + guid2)
    ).toBeTruthy();
  }));

  it('should leave all rooms', () => {
    const room1Subscription = new Subscription();
    (service as any).roomMap.set('room1', room1Subscription);

    service.leaveAllRooms();

    expect((service as any).roomMap.size).toBe(0);
    expect((service as any).sockets.leave).toHaveBeenCalled();
  });

  it('should get an event by chat room id', (done: DoneFn) => {
    const roomGuid: string = '123457890123456';
    const chatRoomEvent: ChatRoomEvent = {
      roomGuid: roomGuid,
      data: { type: 'test' },
    };

    (service as any).getEventsByChatRoomGuid(roomGuid).subscribe((event) => {
      expect(event).toEqual(chatRoomEvent);
      done();
    });

    service.globalEvents$.next(chatRoomEvent);
  });
});
