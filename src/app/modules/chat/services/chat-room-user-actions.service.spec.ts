import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatRoomUserActionsService } from './chat-room-user-actions.service';
import { MockService } from '../../../utils/mock';
import {
  DeleteChatRoomAndBlockUserGQL,
  DeleteChatRoomGQL,
  LeaveChatRoomGQL,
  RemoveMemberFromChatRoomGQL,
} from '../../../../graphql/generated.engine';
import { ToasterService } from '../../../common/services/toaster.service';
import { mockChatRoomEdge } from '../../../mocks/chat.mock';
import { of } from 'rxjs';
import userMock from '../../../mocks/responses/user.mock';

describe('ChatRoomUserActionsService', () => {
  let service: ChatRoomUserActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatRoomUserActionsService,
        {
          provide: DeleteChatRoomGQL,
          useValue: jasmine.createSpyObj<DeleteChatRoomGQL>(['mutate']),
        },
        {
          provide: LeaveChatRoomGQL,
          useValue: jasmine.createSpyObj<LeaveChatRoomGQL>(['mutate']),
        },
        {
          provide: RemoveMemberFromChatRoomGQL,
          useValue: jasmine.createSpyObj<RemoveMemberFromChatRoomGQL>([
            'mutate',
          ]),
        },
        {
          provide: DeleteChatRoomAndBlockUserGQL,
          useValue: jasmine.createSpyObj<DeleteChatRoomAndBlockUserGQL>([
            'mutate',
          ]),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    service = TestBed.inject(ChatRoomUserActionsService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('blockUserByChatRoom', () => {
    it('should block user by chat room', fakeAsync(() => {
      (service as any).deleteChatRoomAndBlockUserGQL.mutate.and.returnValue(
        of({
          data: {
            deleteChatRoomAndBlockUser: true,
          },
        })
      );

      service.blockUserByChatRoom(mockChatRoomEdge);
      tick();

      expect(
        (service as any).deleteChatRoomAndBlockUserGQL.mutate
      ).toHaveBeenCalledWith({
        roomGuid: mockChatRoomEdge.node.guid,
      });
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'User blocked'
      );
    }));

    it('should handle error when blocking user by chat room', fakeAsync(() => {
      (service as any).deleteChatRoomAndBlockUserGQL.mutate.and.returnValue(
        of({
          errors: [{ message: 'Error' }],
        })
      );

      service.blockUserByChatRoom(mockChatRoomEdge);
      tick();

      expect(
        (service as any).deleteChatRoomAndBlockUserGQL.mutate
      ).toHaveBeenCalledWith({
        roomGuid: mockChatRoomEdge.node.guid,
      });
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        new Error('Error')
      );
    }));
  });

  describe('deleteChatRoom', () => {
    it('should delete chat room', fakeAsync(() => {
      (service as any).deleteChatRoomGQL.mutate.and.returnValue(
        of({
          data: {
            deleteChatRoom: true,
          },
        })
      );

      service.deleteChatRoom(mockChatRoomEdge);
      tick();

      expect((service as any).deleteChatRoomGQL.mutate).toHaveBeenCalledWith({
        roomGuid: mockChatRoomEdge.node.guid,
      });
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'Chat room deleted'
      );
    }));

    it('should handle error when deleting chat room', fakeAsync(() => {
      (service as any).deleteChatRoomGQL.mutate.and.returnValue(
        of({
          errors: [{ message: 'Error' }],
        })
      );

      service.deleteChatRoom(mockChatRoomEdge);
      tick();

      expect((service as any).deleteChatRoomGQL.mutate).toHaveBeenCalledWith({
        roomGuid: mockChatRoomEdge.node.guid,
      });
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        new Error('Error')
      );
    }));
  });

  describe('leaveChatRoom', () => {
    it('should leave chat room', fakeAsync(() => {
      (service as any).leaveChatRoomGQL.mutate.and.returnValue(
        of({
          data: {
            leaveChatRoom: true,
          },
        })
      );

      service.leaveChatRoom(mockChatRoomEdge);
      tick();

      expect((service as any).leaveChatRoomGQL.mutate).toHaveBeenCalledWith({
        roomGuid: mockChatRoomEdge.node.guid,
      });
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'Left chat room'
      );
    }));

    it('should handle error when leaving chat room', fakeAsync(() => {
      (service as any).leaveChatRoomGQL.mutate.and.returnValue(
        of({
          errors: [{ message: 'Error' }],
        })
      );

      service.leaveChatRoom(mockChatRoomEdge);
      tick();

      expect((service as any).leaveChatRoomGQL.mutate).toHaveBeenCalledWith({
        roomGuid: mockChatRoomEdge.node.guid,
      });
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        new Error('Error')
      );
    }));
  });

  describe('removeFromChatRoom', () => {
    it('should remove member from chat room', fakeAsync(() => {
      (service as any).removeMemberFromChatRoomGql.mutate.and.returnValue(
        of({
          data: {
            removeMemberFromChatRoom: true,
          },
        })
      );

      service.removeFromChatRoom(mockChatRoomEdge, userMock);
      tick();

      expect(
        (service as any).removeMemberFromChatRoomGql.mutate
      ).toHaveBeenCalledWith({
        roomGuid: mockChatRoomEdge.node.guid,
        memberGuid: userMock.guid,
      });
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'Member removed from chat room'
      );
    }));

    it('should handle error when removing member from chat room', fakeAsync(() => {
      (service as any).removeMemberFromChatRoomGql.mutate.and.returnValue(
        of({
          errors: [{ message: 'Error' }],
        })
      );

      service.removeFromChatRoom(mockChatRoomEdge, userMock);
      tick();

      expect(
        (service as any).removeMemberFromChatRoomGql.mutate
      ).toHaveBeenCalledWith({
        roomGuid: mockChatRoomEdge.node.guid,
        memberGuid: userMock.guid,
      });
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        new Error('Error')
      );
    }));
  });
});
