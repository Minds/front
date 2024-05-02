import { TestBed } from '@angular/core/testing';
import { ChatRoomAvatarsService } from './chat-room-avatars.service';
import { mockChatMemberEdge } from '../../../mocks/chat.mock';
import { ChatRoomMemberEdge } from '../../../../graphql/generated.engine';

describe('ChatRoomAvatarsService', () => {
  let service: ChatRoomAvatarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatRoomAvatarsService],
    });

    service = TestBed.inject(ChatRoomAvatarsService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserAvatarObjects', () => {
    it('should get user avatar objects', () => {
      const members: ChatRoomMemberEdge[] = [
        mockChatMemberEdge,
        mockChatMemberEdge,
      ];
      const maxAvatarCount: number = 3;

      expect(service.getUserAvatarObjects(members, maxAvatarCount)).toEqual([
        {
          guid: members[0].node.guid,
          type: 'user',
          username: members[0].node.username,
          navigationPath: '/' + members[0].node.username,
        },
        {
          guid: members[1].node.guid,
          type: 'user',
          username: members[1].node.username,
          navigationPath: '/' + members[1].node.username,
        },
      ]);
    });

    it('should get user avatar objects and truncate past max amount', () => {
      const members: ChatRoomMemberEdge[] = [
        mockChatMemberEdge,
        mockChatMemberEdge,
      ];
      const maxAvatarCount: number = 1;

      expect(service.getUserAvatarObjects(members, maxAvatarCount)).toEqual([
        {
          guid: members[0].node.guid,
          type: 'user',
          username: members[0].node.username,
          navigationPath: '/' + members[0].node.username,
        },
      ]);
    });
  });

  describe('getGroupAvatarObjects', () => {
    it('should get group avatar objects', () => {
      const groupGuid: string = '1234567890123456';

      expect(service.getGroupAvatarObjects(groupGuid)).toEqual([
        {
          guid: groupGuid,
          type: 'group',
          navigationPath: '/group/' + groupGuid + '/latest',
        },
      ]);
    });
  });
});
