import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatReceiptService } from './chat-receipt.service';
import {
  ChatMessageNode,
  GetChatRoomsListDocument,
  InitChatDocument,
  SetReadReceiptGQL,
} from '../../../../graphql/generated.engine';
import { ReplaySubject, Subject, of } from 'rxjs';
import {
  ChatRoomEvent,
  ChatRoomEventType,
  GlobalChatSocketService,
} from './global-chat-socket.service';
import { MockService } from '../../../utils/mock';
import { Apollo } from 'apollo-angular';
import { Session } from '../../../services/session';
import { ApolloClient } from '@apollo/client';
import { mockChatMemberEdge } from '../../../mocks/chat.mock';
import { PAGE_SIZE } from './chat-rooms-list.service';
import { ChatInitService } from './chat-init.service';

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
          provide: ChatInitService,
          useValue: MockService(ChatInitService),
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
          useValue: MockService(Apollo, {
            has: ['client'],
            props: {
              client: {
                get: () => MockService(ApolloClient),
              },
            },
          }),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
        ChatReceiptService,
      ],
    });

    service = TestBed.inject(ChatReceiptService);

    (service as any).chatInitService.getUnreadCount$.and.returnValue(
      new ReplaySubject()
    );
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('update', () => {
    it('should call to update and refetch the query', async () => {
      (service as any).setReadReceiptGql.mutate.and.returnValue(
        of({ data: { readReceipt: true } })
      );

      (service as any).session.getLoggedInUser.and.returnValue({ guid: '123' });

      const result = await service.update({
        roomGuid: 'roomGuid',
        guid: 'messageGuid',
        sender: {
          node: {
            guid: '456',
          },
        },
      } as ChatMessageNode);

      expect(result).toBe(true);
      expect((service as any).setReadReceiptGql.mutate).toHaveBeenCalledWith({
        roomGuid: 'roomGuid',
        messageGuid: 'messageGuid',
      });
      expect((service as any).chatInitService.refetch).toHaveBeenCalled();
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
      (service as any).apollo.client.readQuery
        .withArgs({
          query: GetChatRoomsListDocument,
          variables: {
            first: PAGE_SIZE,
          },
        })
        .and.returnValue({
          chatRoomList: {
            edges: [mockChatMemberEdge],
          },
        });
      (service as any).apollo.client.readQuery
        .withArgs({
          query: InitChatDocument,
        })
        .and.returnValue({
          chatUnreadMessagesCount: 1,
        });

      (service as any).globalChatSocketService.globalEvents$.next({
        roomGuid: 'roomGuid',
        data: {
          type: ChatRoomEventType.NewMessage,
          messageGuid: 'messageGuid',
          userGuid: '1234567890123456',
        },
      });
      tick();

      expect((service as any).apollo.client.readQuery).toHaveBeenCalledWith({
        query: GetChatRoomsListDocument,
        variables: { first: PAGE_SIZE },
      });
      expect((service as any).apollo.client.writeQuery).toHaveBeenCalledWith(
        jasmine.objectContaining({
          query: GetChatRoomsListDocument,
          variables: { first: PAGE_SIZE },
        })
      );

      expect((service as any).apollo.client.readQuery).toHaveBeenCalledWith({
        query: InitChatDocument,
      });
      expect((service as any).apollo.client.writeQuery).toHaveBeenCalledWith({
        query: InitChatDocument,
        data: { chatUnreadMessagesCount: 2 },
      });
    }));
  });
});
