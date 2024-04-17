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
  let service: GlobalChatSocketService, socketsMock: any;

  beforeEach(() => {
    socketsMock = MockService(SocketsService, {
      has: ['onReady$', 'socket'],
      props: {
        onReady$: {
          get: () => new BehaviorSubject<boolean>(false),
        },
        socket: {
          get: () => ({
            offAny: () => ({}),
            onAny: (listener) => listener(),
          }),
        },
      },
    });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SocketsService,
          useValue: socketsMock,
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

  it('should listen', fakeAsync(() => {
    const guid1: string = 'guid1';

    spyOn(service.globalEvents$, 'next');

    socketsMock.socket.onAny = (listener) => {
      listener(
        'chat:guid1',
        JSON.stringify({
          senderGuid: '123',
        })
      );
    };

    service.listen();
    tick();

    expect(service.globalEvents$.next).toHaveBeenCalledWith({
      roomGuid: guid1,
      data: {
        senderGuid: '123',
      },
    });
  }));
});
