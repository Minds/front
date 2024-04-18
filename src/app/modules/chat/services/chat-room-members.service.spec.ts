import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  GetChatRoomMembersGQL,
  GetChatRoomMembersQuery,
} from '../../../../graphql/generated.engine';
import { MockService } from '../../../utils/mock';
import { ToasterService } from '../../../common/services/toaster.service';
import { BehaviorSubject } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { mockChatMemberEdge } from '../../../mocks/chat.mock';
import { ChatRoomMembersService } from './chat-room-members.service';

const DEFAULT_ROOM_GUID: string = '1234567890';

const mockResponse: ApolloQueryResult<GetChatRoomMembersQuery> = {
  loading: false,
  networkStatus: 7,
  data: {
    chatRoomMembers: {
      edges: [mockChatMemberEdge],
      pageInfo: {
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
        hasNextPage: false,
      },
    },
  },
};

describe('ChatRoomMembersService', () => {
  let service: ChatRoomMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatRoomMembersService,
        {
          provide: GetChatRoomMembersGQL,
          useValue: jasmine.createSpyObj<GetChatRoomMembersGQL>(['watch']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    spyOn(console, 'error'); // suppress console errors.

    service = TestBed.inject(ChatRoomMembersService);
    (service as any).getChatRoomMembersGQL.watch.and.returnValue({
      valueChanges: new BehaviorSubject<
        ApolloQueryResult<GetChatRoomMembersQuery>
      >(mockResponse),
      fetchMore: jasmine.createSpy('fetchMore'),
      refetch: jasmine.createSpy('refetch'),
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

    expect((service as any).getChatRoomMembersGQL.watch).toHaveBeenCalledWith(
      {
        roomGuid: DEFAULT_ROOM_GUID,
        excludeSelf: false,
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

      expect((service as any)._edges$.getValue()).toEqual([mockChatMemberEdge]);
      expect((service as any)._pageInfo$.getValue()).toEqual(
        mockResponse.data.chatRoomMembers.pageInfo
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
    (service as any)._pageInfo$.next(
      mockResponse.data.chatRoomMembers.pageInfo
    );

    (service as any).fetchMore();

    expect((service as any).queryRef.fetchMore).toHaveBeenCalledWith({
      variables: {
        after: mockResponse.data.chatRoomMembers.pageInfo.endCursor,
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
