import {
  ChatMessageEdge,
  ChatRoomEdge,
  ChatRoomMemberEdge,
  ChatRoomNotificationStatusEnum,
  ChatRoomRoleEnum,
  ChatRoomTypeEnum,
  UserEdge,
  UserNode,
} from '../../graphql/generated.engine';

export const mockChatRoomEdge: ChatRoomEdge = {
  __typename: 'ChatRoomEdge',
  cursor: 'mockCursor',
  id: 'mockId',
  lastMessageCreatedTimestamp: 123456789,
  lastMessagePlainText: 'mockMessage',
  members: {
    __typename: 'ChatRoomMembersConnection',
    edges: [
      {
        cursor: 'mockCursor',
        __typename: 'ChatRoomMemberEdge',
        role: ChatRoomRoleEnum.Owner,
        timeJoinedISO8601: Date.now().toLocaleString(),
        timeJoinedUnix: Date.now().toString(),
        node: {
          __typename: 'UserNode',
          guid: '1234567890',
          iconUrl: 'http://example.com/icon.png',
          id: 'id1',
          name: 'Name 1',
          urn: 'urn:user:1',
          username: 'username1',
        } as UserNode,
      } as ChatRoomMemberEdge,
      {
        cursor: 'mockCursor',
        __typename: 'ChatRoomMemberEdge',
        role: ChatRoomRoleEnum.Member,
        timeJoinedISO8601: Date.now().toLocaleString(),
        timeJoinedUnix: Date.now().toString(),
        node: {
          __typename: 'UserNode',
          guid: '2234567890',
          iconUrl: 'http://example.com/icon.png',
          id: 'id1',
          name: 'Name 2',
          urn: 'urn:user:2',
          username: 'username2',
        } as UserNode,
      } as ChatRoomMemberEdge,
    ],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      endCursor: 'mockEndCursor',
      startCursor: 'mockStartCursor',
    },
  },
  messages: {
    __typename: 'ChatMessagesConnection',
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      endCursor: 'mockEndCursor',
      startCursor: 'mockStartCursor',
    },
    edges: [
      {
        __typename: 'ChatMessageEdge',
        node: {
          __typename: 'ChatMessageNode',
          id: 'messageId1',
          guid: '1234567890123456',
          plainText: 'messageContent1',
          roomGuid: 'roomId1',
          sender: {
            cursor: 'mockCursor',
            node: {
              __typename: 'UserNode',
              guid: '2234567890',
              iconUrl: 'http://example.com/icon.png',
              id: 'id1',
              name: 'Name 2',
              urn: 'urn:user:2',
              username: 'username2',
            } as UserNode,
          } as UserEdge,
          timeCreatedISO8601: Date.now().toLocaleString(),
          timeCreatedUnix: Date.now().toString(),
        },
      } as ChatMessageEdge,
    ],
  },
  node: {
    guid: '1234567890123456',
    id: 'id1',
    roomType: ChatRoomTypeEnum.OneToOne,
    isChatRequest: false,
    timeCreatedISO8601: Date.now().toLocaleString(),
    timeCreatedUnix: Date.now().toString(),
    __typename: 'ChatRoomNode',
    chatRoomNotificationStatus: ChatRoomNotificationStatusEnum.All,
    isUserRoomOwner: false,
  },
  totalMembers: 10,
  unreadMessagesCount: 2,
};

export const mockChatMemberEdge: ChatRoomMemberEdge = {
  cursor: 'mockCursor',
  __typename: 'ChatRoomMemberEdge',
  role: ChatRoomRoleEnum.Owner,
  timeJoinedISO8601: Date.now().toLocaleString(),
  timeJoinedUnix: Date.now().toString(),
  node: {
    __typename: 'UserNode',
    guid: '1234567890',
    iconUrl: 'http://example.com/icon.png',
    id: 'id1',
    name: 'Name 1',
    urn: 'urn:user:1',
    username: 'username1',
  } as UserNode,
} as ChatRoomMemberEdge;

export const mockChatMessageEdge: ChatMessageEdge = {
  __typename: 'ChatMessageEdge',
  node: {
    __typename: 'ChatMessageNode',
    id: 'messageId1',
    guid: '1234567890123456',
    plainText: 'messageContent1',
    roomGuid: 'roomId1',
    sender: {
      cursor: 'mockCursor',
      node: {
        __typename: 'UserNode',
        guid: '2234567890',
        iconUrl: 'http://example.com/icon.png',
        id: 'id1',
        name: 'Name 2',
        urn: 'urn:user:2',
        username: 'username2',
      } as UserNode,
    } as UserEdge,
    timeCreatedISO8601: Date.now().toLocaleString(),
    timeCreatedUnix: Date.now().toString(),
  },
} as ChatMessageEdge;
