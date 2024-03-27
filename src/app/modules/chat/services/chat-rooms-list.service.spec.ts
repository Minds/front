import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  GetChatRoomsListGQL,
  GetChatRoomsListQuery,
} from '../../../../graphql/generated.engine';
import { MockService } from '../../../utils/mock';
import { ToasterService } from '../../../common/services/toaster.service';
import { BehaviorSubject, of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { mockChatRoomEdge } from '../../../mocks/chat.mock';
import { ChatRoomsListService } from './chat-rooms-list.service';

const mockResponse: ApolloQueryResult<GetChatRoomsListQuery> = {
  loading: false,
  networkStatus: 7,
  data: {
    chatRoomList: {
      edges: [mockChatRoomEdge],
      pageInfo: {
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
        hasNextPage: false,
      },
    },
  },
};

describe('ChatRoomsListService', () => {
  let service: ChatRoomsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatRoomsListService,
        {
          provide: GetChatRoomsListGQL,
          useValue: jasmine.createSpyObj<GetChatRoomsListGQL>(['watch']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    spyOn(console, 'error'); // suppress console errors.

    service = TestBed.inject(ChatRoomsListService);
    (service as any).getChatRoomsListGql.watch.and.returnValue({
      valueChanges: new BehaviorSubject<
        ApolloQueryResult<GetChatRoomsListQuery>
      >(mockResponse),
      fetchMore: jasmine.createSpy('fetchMore'),
      refetch: jasmine.createSpy('refetch'),
    });
    service.init();
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should init', fakeAsync(() => {
    service.init();
    tick();

    expect((service as any).getChatRoomsListGql.watch).toHaveBeenCalledWith(
      {
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

      expect((service as any)._edges$.getValue()).toEqual([mockChatRoomEdge]);
      expect((service as any)._pageInfo$.getValue()).toEqual(
        mockResponse.data.chatRoomList.pageInfo
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
    }));
  });

  it('should fetch more', () => {
    (service as any)._pageInfo$.next(mockResponse.data.chatRoomList.pageInfo);

    (service as any).fetchMore();

    expect((service as any).queryRef.fetchMore).toHaveBeenCalledWith({
      variables: {
        after: mockResponse.data.chatRoomList.pageInfo.endCursor,
      },
    });
  });

  it('should refetch', () => {
    (service as any)._initialized$.next(true);

    (service as any).refetch();

    expect((service as any)._initialized$.getValue()).toBe(false);
    expect((service as any).queryRef.refetch).toHaveBeenCalled();
  });
});
