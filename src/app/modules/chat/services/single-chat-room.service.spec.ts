import { TestBed } from '@angular/core/testing';
import { SingleChatRoomService } from './single-chat-room.service';
import { of, take, throwError } from 'rxjs';
import {
  ChatRoomEdge,
  GetChatRoomGQL,
} from '../../../../graphql/generated.engine';
import { ToasterService } from '../../../common/services/toaster.service';
import { MockService } from '../../../utils/mock';
import { mockChatRoomEdge } from '../../../mocks/chat.mock';

describe('SingleChatRoomService', () => {
  let service: SingleChatRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SingleChatRoomService,
        {
          provide: GetChatRoomGQL,
          useValue: jasmine.createSpyObj<GetChatRoomGQL>(['fetch']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    service = TestBed.inject(SingleChatRoomService);

    spyOn(console, 'error'); // mute console errors.
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('chatRoom$', () => {
    it('should get chat room', (done: DoneFn) => {
      const roomGuid: string = '1234567890';

      (service as any).getChatRoomGql.fetch.and.returnValue(
        of({
          data: { chatRoom: mockChatRoomEdge },
        })
      );

      service.setRoomGuid(roomGuid);
      service.chatRoom$
        .pipe(take(1))
        .subscribe((chatRoom: ChatRoomEdge): void => {
          expect((service as any).getChatRoomGql.fetch).toHaveBeenCalledWith(
            {
              roomGuid: roomGuid,
              firstMembers: 12,
              afterMembers: 0,
            },
            { fetchPolicy: 'no-cache' }
          );
          expect(chatRoom).toEqual(mockChatRoomEdge);
          done();
        });
    });

    it('should handle errors when getting chat room', (done: DoneFn) => {
      const roomGuid: string = '1234567890';
      const errorMessage: string = 'Error getting chat room';

      (service as any).getChatRoomGql.fetch.and.returnValue(
        throwError(() => errorMessage)
      );

      service.setRoomGuid(roomGuid);
      service.chatRoom$
        .pipe(take(1))
        .subscribe((chatRoom: ChatRoomEdge): void => {
          expect((service as any).getChatRoomGql.fetch).toHaveBeenCalledWith(
            {
              roomGuid: roomGuid,
              firstMembers: 12,
              afterMembers: 0,
            },
            { fetchPolicy: 'no-cache' }
          );
          expect((service as any).toaster.error).toHaveBeenCalledWith(
            errorMessage
          );
          expect(chatRoom).toBeNull();
          done();
        });
    });
  });

  describe('setRoomGuid', () => {
    it('should set room guid', () => {
      const roomGuid: string = '1234567890';
      (service as any)._roomGuid$.next(null);

      service.setRoomGuid(roomGuid);

      expect((service as any)._roomGuid$.getValue()).toEqual(roomGuid);
    });
  });

  describe('refetch', () => {
    it('should refetch', () => {
      const roomGuid: string = '1234567890';
      (service as any)._roomGuid$.next(roomGuid);

      service.refetch();

      expect((service as any)._roomGuid$.getValue()).toEqual(roomGuid);
    });
  });
});
