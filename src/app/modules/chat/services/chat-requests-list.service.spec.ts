import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  GetChatRoomInviteRequestsGQL,
  GetChatRoomInviteRequestsQuery,
} from '../../../../graphql/generated.engine';
import { MockService } from '../../../utils/mock';
import { ToasterService } from '../../../common/services/toaster.service';
import { BehaviorSubject, of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { mockChatRoomEdge } from '../../../mocks/chat.mock';
import { ChatRequestsListService } from './chat-requests-list.service';

const mockResponse: ApolloQueryResult<GetChatRoomInviteRequestsQuery> = {
  loading: false,
  networkStatus: 7,
  data: {
    chatRoomInviteRequests: {
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

describe('ChatRequestsListService', () => {
  let service: ChatRequestsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatRequestsListService,
        {
          provide: GetChatRoomInviteRequestsGQL,
          useValue: jasmine.createSpyObj<GetChatRoomInviteRequestsGQL>([
            'watch',
          ]),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    spyOn(console, 'error'); // suppress console errors.

    service = TestBed.inject(ChatRequestsListService);
    (service as any).getChatRoomInviteRequestsGQL.watch.and.returnValue({
      valueChanges: new BehaviorSubject<
        ApolloQueryResult<GetChatRoomInviteRequestsQuery>
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

    expect(
      (service as any).getChatRoomInviteRequestsGQL.watch
    ).toHaveBeenCalledWith(
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
        mockResponse.data.chatRoomInviteRequests.pageInfo
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
      mockResponse.data.chatRoomInviteRequests.pageInfo
    );

    (service as any).fetchMore();

    expect((service as any).queryRef.fetchMore).toHaveBeenCalledWith({
      variables: {
        after: mockResponse.data.chatRoomInviteRequests.pageInfo.endCursor,
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
