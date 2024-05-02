import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRoomListItemComponent } from './room-list-item.component';
import { mockChatRoomEdge } from '../../../../../mocks/chat.mock';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { Router } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ChatDatePipe } from '../../../pipes/chat-date-pipe';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';
import {
  ChatRoomEdge,
  ChatRoomTypeEnum,
} from '../../../../../../graphql/generated.engine';
import {
  ChatRoomAvatarsService,
  ChatRoomListAvatarObject,
} from '../../../services/chat-room-avatars.service';

describe('ChatRoomListItemComponent', () => {
  let comp: ChatRoomListItemComponent;
  let fixture: ComponentFixture<ChatRoomListItemComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomListItemComponent],
      providers: [
        { provide: Router, useValue: MockService(Router) },
        {
          provide: ChatRoomAvatarsService,
          useValue: MockService(ChatRoomAvatarsService),
        },
        { provide: WINDOW, useValue: jasmine.createSpyObj<Window>(['open']) },
      ],
    }).overrideComponent(ChatRoomListItemComponent, {
      set: {
        imports: [
          NgCommonModule,
          ChatDatePipe,
          MockComponent({
            selector: 'minds-avatar',
            inputs: ['object'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRoomListItemComponent);
    comp = fixture.componentInstance;

    comp.edge = mockChatRoomEdge;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should get user avatar objects array', () => {
    (comp as any).chatRoomAvatarsService.getGroupAvatarObjects.calls.reset();
    (comp as any).chatRoomAvatarsService.getUserAvatarObjects.calls.reset();

    const mockAvatars: ChatRoomListAvatarObject[] = [
      {
        guid: '1234567890',
        type: 'user',
        username: 'user1',
        navigationPath: '/user',
      },
      {
        guid: '2234567890',
        type: 'user',
        username: 'user2',
        navigationPath: '/user2',
      },
    ];

    (comp as any).chatRoomAvatarsService.getUserAvatarObjects.and.returnValue(
      mockAvatars
    );

    let edge: ChatRoomEdge = mockChatRoomEdge;
    edge.members.edges = [
      mockChatRoomEdge.members.edges[0],
      mockChatRoomEdge.members.edges[1],
    ];
    edge.node.roomType = ChatRoomTypeEnum.MultiUser;
    edge.node.groupGuid = null;

    comp.edge = edge;
    fixture.detectChanges();

    expect(
      (comp as any).chatRoomAvatarsService.getUserAvatarObjects
    ).toHaveBeenCalledWith(edge.members.edges, 2);
    expect(
      (comp as any).chatRoomAvatarsService.getGroupAvatarObjects
    ).not.toHaveBeenCalled();
    expect((comp as any).avatars).toEqual(mockAvatars);
  });

  it('should get group avatar objects array', () => {
    (comp as any).chatRoomAvatarsService.getGroupAvatarObjects.calls.reset();
    (comp as any).chatRoomAvatarsService.getUserAvatarObjects.calls.reset();

    const mockAvatars: ChatRoomListAvatarObject[] = [
      {
        guid: '123',
        type: 'group',
        navigationPath: '/group/123',
      },
      {
        guid: '234',
        type: 'group',
        navigationPath: '/group/234',
      },
    ];
    const groupGuid: string = '345';

    (comp as any).chatRoomAvatarsService.getGroupAvatarObjects.and.returnValue(
      mockAvatars
    );

    let edge: ChatRoomEdge = mockChatRoomEdge;
    edge.members.edges = [];
    edge.node.roomType = ChatRoomTypeEnum.GroupOwned;
    edge.node.groupGuid = groupGuid;

    comp.edge = edge;
    fixture.detectChanges();

    expect(
      (comp as any).chatRoomAvatarsService.getGroupAvatarObjects
    ).toHaveBeenCalledWith(groupGuid);
    expect(
      (comp as any).chatRoomAvatarsService.getUserAvatarObjects
    ).not.toHaveBeenCalled();
    expect((comp as any).avatars).toEqual(mockAvatars);
  });

  it('should navigate to chat room', () => {
    (comp as any).navigateToChat();
    expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
      `/chat/rooms/${mockChatRoomEdge.node.guid}`
    );
  });

  it('should open a path in a new tab', () => {
    (comp as any).openInNewTab('/username');
    expect((comp as any).window.open).toHaveBeenCalledWith(
      '/username',
      '_blank'
    );
  });
});
