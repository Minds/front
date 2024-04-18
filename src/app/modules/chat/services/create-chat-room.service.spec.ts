import { TestBed } from '@angular/core/testing';
import { CreateChatRoomService } from './create-chat-room.service';
import {
  ChatRoomTypeEnum,
  CreateChatRoomGQL,
} from '../../../../graphql/generated.engine';
import { mockChatRoomEdge } from '../../../mocks/chat.mock';
import { of } from 'rxjs';
import userMock from '../../../mocks/responses/user.mock';

describe('CreateChatRoomService', () => {
  let service: CreateChatRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateChatRoomService,
        {
          provide: CreateChatRoomGQL,
          useValue: jasmine.createSpyObj<CreateChatRoomGQL>(['mutate']),
        },
      ],
    });

    service = TestBed.inject(CreateChatRoomService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should create chat room when passed a string array of guids', async () => {
    const otherMembers = ['1234567890', '2234567890'];
    const roomType: ChatRoomTypeEnum = ChatRoomTypeEnum.MultiUser;

    (service as any).createChatRoomGql.mutate.and.returnValue(
      of({
        data: {
          createChatRoom: mockChatRoomEdge,
        },
      })
    );

    const result = await service.createChatRoom(otherMembers, roomType);

    expect(result).toEqual(mockChatRoomEdge.node.guid);
    expect((service as any).createChatRoomGql.mutate).toHaveBeenCalledWith({
      otherMemberGuids: otherMembers,
      roomType: roomType,
    });
  });

  it('should create chat room when passed an array of users', async () => {
    const otherMembers = [userMock];
    const roomType: ChatRoomTypeEnum = ChatRoomTypeEnum.MultiUser;

    (service as any).createChatRoomGql.mutate.and.returnValue(
      of({
        data: {
          createChatRoom: mockChatRoomEdge,
        },
      })
    );

    const result = await service.createChatRoom(otherMembers, roomType);

    expect(result).toEqual(mockChatRoomEdge.node.guid);
    expect((service as any).createChatRoomGql.mutate).toHaveBeenCalledWith({
      otherMemberGuids: [userMock.guid],
      roomType: roomType,
    });
  });
});
