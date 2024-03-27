import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  GetTotalRoomInviteRequestsGQL,
  GetTotalRoomInviteRequestsQuery,
} from '../../../../graphql/generated.engine';
import { MockService } from '../../../utils/mock';
import { ToasterService } from '../../../common/services/toaster.service';
import { BehaviorSubject } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { TotalChatRoomInviteRequestsService } from './total-chat-room-invite-requests.service';

const mockResponse: ApolloQueryResult<GetTotalRoomInviteRequestsQuery> = {
  loading: false,
  networkStatus: 7,
  data: {
    totalRoomInviteRequests: 10,
  },
};

describe('TotalChatRoomInviteRequestsService', () => {
  let service: TotalChatRoomInviteRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TotalChatRoomInviteRequestsService,
        {
          provide: GetTotalRoomInviteRequestsGQL,
          useValue: jasmine.createSpyObj<GetTotalRoomInviteRequestsGQL>([
            'watch',
          ]),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    spyOn(console, 'error'); // suppress console errors.

    service = TestBed.inject(TotalChatRoomInviteRequestsService);
    (service as any).getTotalRoomInviteRequestsGQL.watch.and.returnValue({
      valueChanges: new BehaviorSubject<
        ApolloQueryResult<GetTotalRoomInviteRequestsQuery>
      >(mockResponse),
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
      (service as any).getTotalRoomInviteRequestsGQL.watch
    ).toHaveBeenCalledWith(null, {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: false,
      errorPolicy: 'all',
      useInitialLoading: true,
    });
  }));

  describe('valueChanges', () => {
    it('should handle value changes', fakeAsync(() => {
      (service as any)._totalRequests$.next(0);
      (service as any)._initialized$.next(false);

      (service as any).queryRef.valueChanges.next(mockResponse);
      tick();

      expect((service as any)._totalRequests$.getValue()).toEqual(
        mockResponse.data.totalRoomInviteRequests
      );
      expect((service as any)._initialized$.getValue()).toBe(true);
    }));

    it('should handle errors when value changes', fakeAsync(() => {
      (service as any)._totalRequests$.next(0);

      (service as any).queryRef.valueChanges.next({
        loading: false,
        networkStatus: 7,
        errors: [{ message: 'error' }],
      });
      tick();

      expect((service as any)._totalRequests$.getValue()).toEqual(0);
      expect((service as any).toaster.error).toHaveBeenCalledWith('error');
    }));
  });

  it('should refetch', () => {
    (service as any).refetch();
    expect((service as any).queryRef.refetch).toHaveBeenCalled();
  });
});
