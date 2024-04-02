import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatMessagesService } from './chat-messages.service';
import {
  DeleteChatMessageGQL,
  GetChatMessagesGQL,
  GetChatMessagesQuery,
} from '../../../../graphql/generated.engine';
import { MockService } from '../../../utils/mock';
import { ToasterService } from '../../../common/services/toaster.service';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { mockChatMessageEdge } from '../../../mocks/chat.mock';

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

  it('should append a chat message', () => {
    (service as any)._edges$.next([mockChatMessageEdge]);
    service.appendChatMessage(mockChatMessageEdge);
    expect((service as any)._edges$.getValue()).toEqual([
      mockChatMessageEdge,
      mockChatMessageEdge,
    ]);
  });

  describe('removeChatMessage', () => {
    it('should remove a chat message', fakeAsync(() => {
      (service as any)._edges$.next([mockChatMessageEdge]);
      (service as any).deleteChatMessage.mutate.and.returnValue(
        of({ data: { deleteChatMessage: true } })
      );

      service.removeChatMessage(mockChatMessageEdge);
      tick();

      expect((service as any).deleteChatMessage.mutate).toHaveBeenCalledWith({
        messageGuid: mockChatMessageEdge.node.guid,
        roomGuid: mockChatMessageEdge.node.roomGuid,
      });
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

      expect((service as any).deleteChatMessage.mutate).toHaveBeenCalledWith({
        messageGuid: mockChatMessageEdge.node.guid,
        roomGuid: mockChatMessageEdge.node.roomGuid,
      });
      expect((service as any)._edges$.getValue()).toEqual([
        mockChatMessageEdge,
      ]);
      expect((service as any).toaster.error).toHaveBeenCalledWith('error');
    }));
  });
});
