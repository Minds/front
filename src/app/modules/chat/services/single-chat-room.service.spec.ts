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
          useValue: jasmine.createSpyObj<GetChatRoomGQL>(['watch']),
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

  describe('init', () => {
    it('should get chat room', (done: DoneFn) => {
      const roomGuid: string = '1234567890';

      (service as any).getChatRoomGql.watch.and.returnValue({
        refetch: jasmine.createSpy('refetch'),
        valueChanges: of({ data: { chatRoom: mockChatRoomEdge } }),
      });

      service.init(roomGuid);

      expect((service as any).getChatRoomGql.watch).toHaveBeenCalledWith({
        roomGuid: roomGuid,
        firstMembers: 12,
        afterMembers: 0,
      });

      service.chatRoom$
        .pipe(take(1))
        .subscribe((chatRoom: ChatRoomEdge): void => {
          expect(chatRoom).toEqual(mockChatRoomEdge);
          done();
        });
    });

    it('should handle errors when getting chat room', (done: DoneFn) => {
      const roomGuid: string = '1234567890';
      const error: Error = new Error('Error getting chat room');

      (service as any).getChatRoomGql.watch.and.returnValue({
        refetch: jasmine.createSpy('refetch'),
        valueChanges: throwError(() => error),
      });

      service.init(roomGuid);

      expect((service as any).getChatRoomGql.watch).toHaveBeenCalledWith({
        roomGuid: roomGuid,
        firstMembers: 12,
        afterMembers: 0,
      });

      service.chatRoom$
        .pipe(take(1))
        .subscribe((chatRoom: ChatRoomEdge): void => {
          expect((service as any).toaster.error).toHaveBeenCalledWith(error);
          expect(chatRoom).toBeNull();
          done();
        });
    });
  });

  describe('refetch', () => {
    it('should refetch', () => {
      (service as any).queryRef = {
        refetch: jasmine.createSpy('refetch'),
      };

      service.refetch();

      expect((service as any).queryRef.refetch).toHaveBeenCalledTimes(1);
    });
  });
});
