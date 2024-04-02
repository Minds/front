import { TestBed } from '@angular/core/testing';
import { ChatRoomUtilsService } from './utils.service';
import { mockChatMemberEdge } from '../../../mocks/chat.mock';
import { ChatRoomMemberEdge } from '../../../../graphql/generated.engine';

describe('ChatRoomUtilsService', () => {
  let service: ChatRoomUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatRoomUtilsService],
    });
    service = TestBed.inject(ChatRoomUtilsService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('deriveRoomNameFromMembers', () => {
    it('should derive room name from members when there is only 1 member', () => {
      const members: ChatRoomMemberEdge[] = [
        {
          ...mockChatMemberEdge,
          node: {
            name: 'user1',
          },
        } as ChatRoomMemberEdge,
      ];

      const result = service.deriveRoomNameFromMembers(members);
      expect(result).toEqual('user1');
    });

    it('should derive room name from members when there are 2 members', () => {
      const members: ChatRoomMemberEdge[] = [
        {
          ...mockChatMemberEdge,
          node: {
            name: 'user1',
          },
        } as ChatRoomMemberEdge,
        {
          ...mockChatMemberEdge,
          node: {
            name: 'user2',
          },
        } as ChatRoomMemberEdge,
      ];

      const result = service.deriveRoomNameFromMembers(members);
      expect(result).toEqual('user1 and user2');
    });

    it('should derive room name from members when there are more than 2 members', () => {
      const members: ChatRoomMemberEdge[] = [
        {
          ...mockChatMemberEdge,
          node: {
            name: 'user1',
          },
        } as ChatRoomMemberEdge,
        {
          ...mockChatMemberEdge,
          node: {
            name: 'user2',
          },
        } as ChatRoomMemberEdge,
        {
          ...mockChatMemberEdge,
          node: {
            name: 'user3',
          },
        } as ChatRoomMemberEdge,
      ];

      const result = service.deriveRoomNameFromMembers(members);
      expect(result).toEqual('user1, user2, and more');
    });
  });
});
