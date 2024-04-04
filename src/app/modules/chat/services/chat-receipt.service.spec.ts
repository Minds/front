import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatReceiptService } from './chat-receipt.service';
import {
  GetChatRoomsListDocument,
  GetChatUnreadCountGQL,
  SetReadReceiptGQL,
} from '../../../../graphql/generated.engine';
import { BehaviorSubject, ReplaySubject, Subject, of, take } from 'rxjs';
import {
  ChatRoomEvent,
  GlobalChatSocketService,
} from './global-chat-socket.service';
import { MockService } from '../../../utils/mock';
import { Apollo } from 'apollo-angular';
import { Session } from '../../../services/session';
import { ApolloClient } from '@apollo/client';
import { mockChatMemberEdge } from '../../../mocks/chat.mock';
import { PAGE_SIZE } from './chat-rooms-list.service';

describe('ChatReceiptService', () => {
  let service: ChatReceiptService, getChatUnreadCountMock$: ReplaySubject<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SetReadReceiptGQL,
          useValue: jasmine.createSpyObj<SetReadReceiptGQL>(['mutate']),
        },
        {
          provide: GetChatUnreadCountGQL,
          useValue: jasmine.createSpyObj<GetChatUnreadCountGQL>(['watch']),
        },
        {
          provide: GlobalChatSocketService,
          useValue: MockService(GlobalChatSocketService, {
            has: ['globalEvents$'],
            props: {
              globalEvents$: {
                get: () => new Subject<ChatRoomEvent>(),
              },
            },
          }),
        },
        {
          provide: Apollo,
          useValue: {
            client: MockService(ApolloClient),
          },
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
        ChatReceiptService,
      ],
    });

    service = TestBed.inject(ChatReceiptService);

    getChatUnreadCountMock$ = new ReplaySubject();

    (service as any).getUnreadCountGql.watch.and.returnValue({
      refetch: jasmine.createSpy('refetch'),
      fetchMore: jasmine.createSpy('fetchMore'),
      valueChanges: getChatUnreadCountMock$,
    });
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('getUnreadCount$', () => {
    it('should get unread count', (done: DoneFn) => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any)._queryRef = {
        valueChanges: new BehaviorSubject<any>({
          data: { chatUnreadMessagesCount: 4 },
        }),
      };

      service
        .getUnreadCount$()
        .pipe(take(1))
        .subscribe(count => {
          expect(count).toBe(4);
          done();
        });
    });

    it('should NOT get unread count when logged out', (done: DoneFn) => {
      (service as any).session.isLoggedIn.and.returnValue(false);
      (service as any)._queryRef = {
        valueChanges: new BehaviorSubject<any>({
          data: { chatUnreadMessagesCount: 4 },
        }),
      };

      service
        .getUnreadCount$()
        .pipe(take(1))
        .subscribe(count => {
          expect(count).toBe(null);
          done();
        });
    });
  });

  describe('update', () => {
    it('should call to update and refetch the query', async () => {
      (service as any)._queryRef = {
        refetch: jasmine.createSpy('refetch'),
      };

      (service as any).setReadReceiptGql.mutate.and.returnValue(
        of({ data: { readReceipt: true } })
      );

      const result = await service.update('roomGuid', 'messageGuid');

      expect(result).toBe(true);
      expect((service as any).setReadReceiptGql.mutate).toHaveBeenCalledWith({
        roomGuid: 'roomGuid',
        messageGuid: 'messageGuid',
      });
      expect((service as any)._queryRef.refetch).toHaveBeenCalled();
    });
  });

  describe('sockets', () => {
    it('should handle socket event for a user other than the logged in user', fakeAsync(() => {
      (service as any)._queryRef = {
        refetch: jasmine.createSpy('refetch'),
      };
      (service as any).session.getLoggedInUser.and.returnValue({
        guid: '2234567890123456',
      });
      (service as any).apollo.client.readQuery.and.returnValue({
        chatRoomList: {
          edges: [mockChatMemberEdge],
        },
      });

      (service as any).globalChatSocketService.globalEvents$.next({
        type: 'NEW_MESSAGE',
        data: {
          roomGuid: 'roomGuid',
          messageGuid: 'messageGuid',
          userGuid: '1234567890123456',
        },
      });
      tick();

      expect((service as any)._queryRef.refetch).toHaveBeenCalled();
      expect((service as any).apollo.client.writeQuery).toHaveBeenCalledWith(
        jasmine.objectContaining({
          query: GetChatRoomsListDocument,
          variables: { first: PAGE_SIZE },
        })
      );
    }));
  });
});
