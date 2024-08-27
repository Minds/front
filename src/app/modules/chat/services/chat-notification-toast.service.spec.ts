import {
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ChatNotificationToasterService } from './chat-notification-toast.service';
import { MockService } from '../../../utils/mock';
import {
  ChatRoomEvent,
  ChatRoomEventType,
  GlobalChatSocketService,
} from './global-chat-socket.service';
import { NotificationToasterV2Service } from '../../../common/components/notification-toaster-v2/notification-toaster-v2.service';
import {
  ChatRoomNotificationStatusEnum,
  GetChatRoomNotificationStatusGQL,
} from '../../../../graphql/generated.engine';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import userMock from '../../../mocks/responses/user.mock';

describe('ChatNotificationToasterService', () => {
  let service: ChatNotificationToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatNotificationToasterService,
        {
          provide: GlobalChatSocketService,
          useValue: MockService(GlobalChatSocketService, {
            has: ['globalEvents$'],
            props: {
              globalEvents$: {
                get: () => new BehaviorSubject<ChatRoomEvent>(null),
              },
            },
          }),
        },
        {
          provide: NotificationToasterV2Service,
          useValue: MockService(NotificationToasterV2Service),
        },
        {
          provide: GetChatRoomNotificationStatusGQL,
          useValue: jasmine.createSpyObj<GetChatRoomNotificationStatusGQL>([
            'fetch',
          ]),
        },
        {
          provide: Session,
          useValue: MockService(Session, {
            has: ['loggedinEmitter'],
            props: {
              loggedinEmitter: {
                get: () => new Subject<boolean>(),
              },
            },
          }),
        },
        {
          provide: Router,
          useValue: {
            url: '/',
          },
        },
      ],
    });
    service = TestBed.inject(ChatNotificationToasterService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should init', () => {
      service.init();

      expect(service).toBeTruthy();
      expect((service as any).loggedInSubcription).not.toBeNull();
      expect((service as any).socketEventSubscription).not.toBeNull();
    });
  });

  describe('destroyRoomSubscriptions', () => {
    it('should show a notification toast when a new event comes through', fakeAsync(() => {
      (service as any).session.getLoggedInUser.and.returnValue(userMock);
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).router.url = '/';
      (service as any).getChatRoomNotificationStatusGql.fetch.and.returnValue(
        of({
          data: {
            chatRoom: {
              node: {
                chatRoomNotificationStatus: ChatRoomNotificationStatusEnum.All,
              },
            },
          },
        })
      );

      (service as any).ngOnDestroy();
      (service as any).initSocketSubscription();
      (service as any).globalChatSocketService.globalEvents$.next({
        data: {
          type: ChatRoomEventType.NewMessage,
          metadata: {
            roomGuid: 'test',
            senderGuid: '3234567890123456',
          },
        },
      });
      tick();

      expect(
        (service as any).notificationToaster.clearByKey
      ).toHaveBeenCalled();
      expect((service as any).notificationToaster.info).toHaveBeenCalledWith({
        key: 'chat-message:test',
        text: 'You received a new chat message.',
        href: '/chat/rooms/test',
        avatarObject: {
          guid: '3234567890123456',
          type: 'user',
        },
      });
      discardPeriodicTasks();
      flush();
    }));

    it('should NOT show a notification toast when the user is on a chat page', fakeAsync(() => {
      (service as any).session.getLoggedInUser.and.returnValue(userMock);
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).router.url = '/chat';
      (service as any).getChatRoomNotificationStatusGql.fetch.and.returnValue(
        of({
          data: {
            chatRoom: {
              node: {
                chatRoomNotificationStatus: ChatRoomNotificationStatusEnum.All,
              },
            },
          },
        })
      );

      (service as any).ngOnDestroy();
      (service as any).initSocketSubscription();
      (service as any).globalChatSocketService.globalEvents$.next({
        data: {
          type: ChatRoomEventType.NewMessage,
          metadata: {
            roomGuid: 'test',
            senderGuid: '3234567890123456',
          },
        },
      });
      tick();

      expect(
        (service as any).notificationToaster.clearByKey
      ).not.toHaveBeenCalled();
      expect((service as any).notificationToaster.info).not.toHaveBeenCalled();
      discardPeriodicTasks();
      flush();
    }));

    it('should NOT show a notification toast when the user has the chat room muted', fakeAsync(() => {
      (service as any).session.getLoggedInUser.and.returnValue(userMock);
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).router.url = '/';
      (service as any).getChatRoomNotificationStatusGql.fetch.and.returnValue(
        of({
          data: {
            chatRoom: {
              node: {
                chatRoomNotificationStatus:
                  ChatRoomNotificationStatusEnum.Muted,
              },
            },
          },
        })
      );

      (service as any).ngOnDestroy();
      (service as any).initSocketSubscription();
      (service as any).globalChatSocketService.globalEvents$.next({
        data: {
          type: ChatRoomEventType.NewMessage,
          metadata: {
            roomGuid: 'test',
            senderGuid: '3234567890123456',
          },
        },
      });
      tick();

      expect(
        (service as any).notificationToaster.clearByKey
      ).not.toHaveBeenCalled();
      expect((service as any).notificationToaster.info).not.toHaveBeenCalled();
      discardPeriodicTasks();
      flush();
    }));

    it('should NOT show a notification toast when the user is not logged in', fakeAsync(() => {
      (service as any).session.getLoggedInUser.and.returnValue(null);
      (service as any).session.isLoggedIn.and.returnValue(false);

      (service as any).router.url = '/';
      (service as any).getChatRoomNotificationStatusGql.fetch.and.returnValue(
        of({
          data: {
            chatRoom: {
              node: {
                chatRoomNotificationStatus: ChatRoomNotificationStatusEnum.All,
              },
            },
          },
        })
      );

      (service as any).ngOnDestroy();
      (service as any).initSocketSubscription();
      (service as any).globalChatSocketService.globalEvents$.next({
        data: {
          type: ChatRoomEventType.NewMessage,
          metadata: {
            roomGuid: 'test',
            senderGuid: '3234567890123456',
          },
        },
      });
      tick();

      expect(
        (service as any).notificationToaster.clearByKey
      ).not.toHaveBeenCalled();
      expect((service as any).notificationToaster.info).not.toHaveBeenCalled();
      discardPeriodicTasks();
      flush();
    }));
  });
});
