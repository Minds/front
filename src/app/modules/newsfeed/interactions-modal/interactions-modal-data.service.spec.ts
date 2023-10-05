import { TestBed } from '@angular/core/testing';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import {
  InteractionType,
  InteractionsModalDataService,
} from './interactions-modal-data.service';
import { of } from 'rxjs';
import userMock from '../../../mocks/responses/user.mock';
import { MindsUser } from '../../../interfaces/entities';

describe('InteractionsModalDataService', () => {
  let service: InteractionsModalDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InteractionsModalDataService,
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj<ApiService>(['get']),
        },
      ],
    });

    service = TestBed.inject(InteractionsModalDataService);
    (service as any).api.get.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('apiRequest', () => {
    it('should make an api request for votes-up', (done: DoneFn) => {
      const entityGuid: string = '1234567890123456';
      const type: InteractionType = 'votes-up';
      const pagingToken: string = '1';
      const nextPagingToken: string = '2';
      const actor1Guid = '123';
      const actor2Guid = '234';

      (service as any).api.get.and.returnValue(
        of({
          status: 'success',
          votes: [{ actor: actor1Guid }, { actor: actor2Guid }],
          'load-next': nextPagingToken,
        })
      );

      service
        .apiRequest(entityGuid, type, pagingToken)
        .subscribe((response: ApiResponse) => {
          expect((service as any).api.get).toHaveBeenCalledWith(
            'api/v3/votes/list/' + entityGuid,
            {
              limit: 24,
              'next-page': pagingToken,
              direction: 'up',
            }
          );
          expect(response).toEqual({
            status: 'success',
            entities: [actor1Guid, actor2Guid],
            'load-next': nextPagingToken,
          });
          done();
        });
    });

    it('should make an api request for reminds', (done: DoneFn) => {
      const entityGuid: string = '1234567890123456';
      const type: InteractionType = 'reminds';
      const pagingToken: string = '1';
      const nextPagingToken: string = '2';
      const remindUser1 = '123';
      const remindUser2 = '234';

      (service as any).api.get.and.returnValue(
        of({
          status: 'success',
          entities: [
            { remind_users: [remindUser1] },
            { remind_users: [remindUser2] },
          ],
          'load-next': nextPagingToken,
        })
      );

      service
        .apiRequest(entityGuid, type, pagingToken)
        .subscribe((response: ApiResponse) => {
          expect((service as any).api.get).toHaveBeenCalledWith(
            'api/v3/newsfeed',
            {
              limit: 24,
              'next-page': pagingToken,
              remind_guid: entityGuid,
            }
          );
          expect(response).toEqual({
            status: 'success',
            entities: [remindUser1, remindUser2],
            'load-next': nextPagingToken,
          });
          done();
        });
    });

    it('should make an api request for quotes', (done: DoneFn) => {
      const entityGuid: string = '1234567890123456';
      const type: InteractionType = 'quotes';
      const pagingToken: string = '1';
      const nextPagingToken: string = '2';
      const response: ApiResponse = {
        status: 'success',
        'load-next': nextPagingToken,
      };

      (service as any).api.get.and.returnValue(of(response));

      service
        .apiRequest(entityGuid, type, pagingToken)
        .subscribe((response: ApiResponse) => {
          expect((service as any).api.get).toHaveBeenCalledWith(
            'api/v3/newsfeed',
            {
              limit: 24,
              'next-page': pagingToken,
              quote_guid: entityGuid,
            }
          );
          expect(response).toEqual(response);
          done();
        });
    });

    it('should make an api request for subscribers', (done: DoneFn) => {
      const entityGuid: string = '1234567890123456';
      const type: InteractionType = 'subscribers';
      const pagingToken: string = '1';
      const nextPagingToken: string = '2';
      const response: ApiResponse = {
        status: 'success',
        'load-next': nextPagingToken,
      };

      (service as any).api.get.and.returnValue(of(response));

      service
        .apiRequest(entityGuid, type, pagingToken)
        .subscribe((response: ApiResponse) => {
          expect((service as any).api.get).toHaveBeenCalledWith(
            `api/v3/subscriptions/graph/${entityGuid}/subscribers`,
            {
              limit: 24,
              from_timestamp: pagingToken,
            }
          );
          expect(response).toEqual(response);
          done();
        });
    });

    it('should make an api request for mutual-subscribers', (done: DoneFn) => {
      const entityGuid: string = '1234567890123456';
      const type: InteractionType = 'mutual-subscribers';
      const pagingToken: string = '1';
      const nextPagingToken: string = '2';
      const user1: MindsUser = userMock;
      const user2: MindsUser = {
        ...userMock,
        guid: '234567890123456677',
      };

      (service as any).api.get.and.returnValue(
        of({
          status: 'success',
          users: [user1, user2],
          'load-next': nextPagingToken,
        })
      );

      service
        .apiRequest(entityGuid, type, pagingToken)
        .subscribe((response: ApiResponse) => {
          expect((service as any).api.get).toHaveBeenCalledWith(
            `api/v3/subscriptions/relational/also-subscribe-to`,
            {
              guid: entityGuid,
              limit: 24,
              offset: pagingToken,
            }
          );
          expect(response).toEqual({
            'load-next': '124',
            status: 'success',
            entities: [user1, user2],
          });
          done();
        });
    });
  });
});
