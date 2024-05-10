import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatMessagesService, PAGE_SIZE } from './chat-messages.service';
import {
  ChatMessageEdge,
  DeleteChatMessageGQL,
  GetChatMessagesDocument,
  GetChatMessagesGQL,
  GetChatMessagesQuery,
} from '../../../../graphql/generated.engine';
import { MockService } from '../../../utils/mock';
import { ToasterService } from '../../../common/services/toaster.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { mockChatMessageEdge } from '../../../mocks/chat.mock';
import { Session } from '../../../services/session';
import {
  ChatRoomEvent,
  GlobalChatSocketService,
} from './global-chat-socket.service';

const DEFAULT_ROOM_GUID: string = '1234567890';

const mockResponse: ApolloQueryResult<GetChatMessagesQuery> = {
  loading: false,
  networkStatus: 7,
  data: {
    chatMessages: {
      edges: [mockChatMessageEdge],
      pageInfo: {
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
        hasNextPage: false,
      },
    },
  },
};

describe('ChatMessagesService', () => {
  let service: ChatMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatMessagesService,
        {
          provide: GetChatMessagesGQL,
          useValue: jasmine.createSpyObj<GetChatMessagesGQL>(['watch']),
        },
        {
          provide: DeleteChatMessageGQL,
          useValue: jasmine.createSpyObj<DeleteChatMessageGQL>(['mutate']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: GlobalChatSocketService,
          useValue: MockService(GlobalChatSocketService),
        },
        { provide: Session, useValue: MockService(Session) },
      ],
    });

    spyOn(console, 'error'); // suppress console errors.

    service = TestBed.inject(ChatMessagesService);
    (service as any).getChatMessagesGql.watch.and.returnValue({
      valueChanges: new BehaviorSubject<
        ApolloQueryResult<GetChatMessagesQuery>
      >(mockResponse),
      fetchMore: jasmine.createSpy('fetchMore'),
    });
    (
      service as any
    ).globalChatSocketService.getEventsByChatRoomGuid.and.returnValue(
      new Subject<ChatRoomEvent>()
    );
    service.init(DEFAULT_ROOM_GUID);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should init', fakeAsync(() => {
    service.init(DEFAULT_ROOM_GUID);
    tick();

    expect((service as any).getChatMessagesGql.watch).toHaveBeenCalledWith(
      {
        roomGuid: DEFAULT_ROOM_GUID,
        after: null,
        first: 24,
      },
      {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );
  }));

  describe('valueChanges', () => {
    it('should handle value changes', fakeAsync(() => {
      (service as any)._edges$.next([]);
      (service as any)._pageInfo$.next(null);
      (service as any)._initialized$.next(false);

      (service as any).queryRef.valueChanges.next(mockResponse);
      tick();

      expect((service as any)._edges$.getValue()).toEqual([
        mockChatMessageEdge,
      ]);
      expect((service as any)._pageInfo$.getValue()).toEqual(
        mockResponse.data.chatMessages.pageInfo
      );
      expect((service as any)._inProgress$.getValue()).toBe(false);
      expect((service as any)._initialized$.getValue()).toBe(true);
    }));

    it('should handle errors when value changes', fakeAsync(() => {
      (service as any)._edges$.next([]);

      (service as any).queryRef.valueChanges.next({
        loading: false,
        networkStatus: 7,
        errors: [{ message: 'error' }],
      });
      tick();

      expect((service as any)._edges$.getValue()).toEqual([]);
      expect((service as any).toaster.error).toHaveBeenCalledWith('error');
      expect((service as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/chat/rooms'
      );
    }));
  });

  it('should fetch more', () => {
    (service as any)._pageInfo$.next(mockResponse.data.chatMessages.pageInfo);

    (service as any).fetchMore();

    expect((service as any).queryRef.fetchMore).toHaveBeenCalledWith({
      variables: {
        before: mockResponse.data.chatMessages.pageInfo.startCursor,
      },
    });
  });

  describe('removeChatMessage', () => {
    it('should remove a chat message', fakeAsync(() => {
      (service as any)._edges$.next([mockChatMessageEdge]);
      (service as any).deleteChatMessage.mutate.and.returnValue(
        of({ data: { deleteChatMessage: true } })
      );

      service.removeChatMessage(mockChatMessageEdge);
      tick();

      expect((service as any).deleteChatMessage.mutate).toHaveBeenCalledWith(
        {
          messageGuid: mockChatMessageEdge.node.guid,
          roomGuid: mockChatMessageEdge.node.roomGuid,
        },
        { update: jasmine.any(Function) }
      );
      expect((service as any)._edges$.getValue()).toEqual([]);
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'Message deleted'
      );
    }));

    it('should handle errors when removing a chat message', fakeAsync(() => {
      (service as any)._edges$.next([mockChatMessageEdge]);
      (service as any).deleteChatMessage.mutate.and.returnValue(
        of({ errors: [{ message: 'error' }] })
      );

      service.removeChatMessage(mockChatMessageEdge);
      tick();

      expect((service as any).deleteChatMessage.mutate).toHaveBeenCalledWith(
        {
          messageGuid: mockChatMessageEdge.node.guid,
          roomGuid: mockChatMessageEdge.node.roomGuid,
        },
        { update: jasmine.any(Function) }
      );
      expect((service as any)._edges$.getValue()).toEqual([
        mockChatMessageEdge,
      ]);
      expect((service as any).toaster.error).toHaveBeenCalledWith('error');
    }));
  });

  describe('fetchNew', () => {
    it('should fetch new messages', () => {
      (service as any).queryRef.subscribeToMore =
        jasmine.createSpy('subscribeToMore');
      (service as any).queryRef.variables = { roomGuid: DEFAULT_ROOM_GUID };

      (service as any).fetchNew();

      expect((service as any).queryRef.subscribeToMore).toHaveBeenCalledWith({
        document: GetChatMessagesDocument,
        variables: {
          roomGuid: (service as any).queryRef.variables.roomGuid,
          after: (service as any).endCursor,
          first: PAGE_SIZE,
        },
        updateQuery: jasmine.any(Function),
      });
    });
  });

  describe('updateCacheWithNewMessage', () => {
    it('should return updated cache value with a new message', () => {
      const newStartCursor: string = 'newStartCursor';
      const chatMessageEdge1 = {
        ...mockChatMessageEdge,
        id: '1',
      };
      const chatMessageEdge2 = {
        ...mockChatMessageEdge,
        id: '2',
      };
      const prev: GetChatMessagesQuery = {
        chatMessages: {
          edges: [chatMessageEdge1],
          pageInfo: {
            hasPreviousPage: false,
            startCursor: newStartCursor,
            endCursor: null,
            hasNextPage: false,
          },
        },
      };

      expect(
        (service as any).updateCacheWithNewMessage(prev, {
          subscriptionData: {
            data: {
              chatMessages: {
                edges: [chatMessageEdge2],
                pageInfo: {
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                  hasNextPage: false,
                },
              },
            },
          },
        })
      ).toEqual({
        chatMessages: {
          edges: [chatMessageEdge1, chatMessageEdge2],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: prev.chatMessages.pageInfo.hasPreviousPage,
            startCursor: prev.chatMessages.pageInfo.startCursor,
            endCursor: null,
          },
        },
      });
    });

    it('should return updated cache value without a new message that already exists by id', () => {
      const newStartCursor: string = 'newStartCursor';
      const chatMessageEdge1 = {
        ...mockChatMessageEdge,
        id: '1',
      };
      const prev: GetChatMessagesQuery = {
        chatMessages: {
          edges: [chatMessageEdge1],
          pageInfo: {
            hasPreviousPage: false,
            startCursor: newStartCursor,
            endCursor: null,
            hasNextPage: false,
          },
        },
      };

      expect(
        (service as any).updateCacheWithNewMessage(prev, {
          subscriptionData: {
            data: {
              chatMessages: {
                edges: [chatMessageEdge1],
                pageInfo: {
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                  hasNextPage: false,
                },
              },
            },
          },
        })
      ).toEqual({
        chatMessages: {
          edges: [chatMessageEdge1],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: prev.chatMessages.pageInfo.hasPreviousPage,
            startCursor: prev.chatMessages.pageInfo.startCursor,
            endCursor: null,
          },
        },
      });
    });
  });

  describe('handleMessageDeletion', () => {
    it('should return updated cache value with message deleted when there is a single message', () => {
      (service as any).queryRef = {
        variables: {
          roomGuid: DEFAULT_ROOM_GUID,
        },
      };

      const cache = {
        readQuery: jasmine.createSpy('readQuery').and.returnValue({
          chatMessages: {
            edges: [mockChatMessageEdge],
          },
        }),
        writeQuery: jasmine.createSpy('writeQuery'),
      };

      (service as any).handleMessageDeletion(cache, null, {
        variables: {
          messageGuid: mockChatMessageEdge.node.guid,
        },
      });

      expect(cache.readQuery).toHaveBeenCalledWith({
        query: GetChatMessagesDocument,
        variables: {
          first: PAGE_SIZE,
          roomGuid: DEFAULT_ROOM_GUID,
        },
      });

      expect(cache.writeQuery).toHaveBeenCalledWith({
        query: GetChatMessagesDocument,
        variables: {
          first: PAGE_SIZE,
          roomGuid: DEFAULT_ROOM_GUID,
        },
        data: {
          chatMessages: {
            edges: [],
          },
        },
      });
    });

    it('should return updated cache value with message deleted when there are multiple messages', () => {
      (service as any).queryRef = {
        variables: {
          roomGuid: DEFAULT_ROOM_GUID,
        },
      };

      const guidToDelete: string = '987654321098765';
      const message1: ChatMessageEdge = {
        ...mockChatMessageEdge,
        node: {
          ...mockChatMessageEdge.node,
          guid: guidToDelete + '1',
        },
      };
      const message2: ChatMessageEdge = {
        ...mockChatMessageEdge,
        node: {
          ...mockChatMessageEdge.node,
          guid: guidToDelete,
        },
      };
      const message3: ChatMessageEdge = {
        ...mockChatMessageEdge,
        node: {
          ...mockChatMessageEdge.node,
          guid: guidToDelete + '3',
        },
      };

      const cache = {
        readQuery: jasmine.createSpy('readQuery').and.returnValue({
          chatMessages: {
            edges: [message1, message2, message3],
          },
        }),
        writeQuery: jasmine.createSpy('writeQuery'),
      };

      (service as any).handleMessageDeletion(cache, null, {
        variables: {
          messageGuid: guidToDelete,
        },
      });

      expect(cache.readQuery).toHaveBeenCalledWith({
        query: GetChatMessagesDocument,
        variables: {
          first: PAGE_SIZE,
          roomGuid: DEFAULT_ROOM_GUID,
        },
      });

      expect(cache.writeQuery).toHaveBeenCalledWith({
        query: GetChatMessagesDocument,
        variables: {
          first: PAGE_SIZE,
          roomGuid: DEFAULT_ROOM_GUID,
        },
        data: {
          chatMessages: {
            edges: [message1, message3],
          },
        },
      });
    });
  });
});
