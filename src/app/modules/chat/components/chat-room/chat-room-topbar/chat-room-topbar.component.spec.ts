import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChatRoomTopComponent } from './chat-room-topbar.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';
import {
  mockChatMemberEdge,
  mockChatRoomEdge,
} from '../../../../../mocks/chat.mock';
import { ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  ChatRoomAvatarsService,
  ChatRoomListAvatarObject,
} from '../../../services/chat-room-avatars.service';
import {
  AddMembersToChatRoomGQL,
  ChatRoomEdge,
  ChatRoomMemberEdge,
  ChatRoomTypeEnum,
} from '../../../../../../graphql/generated.engine';
import { EditChatRoomModalService } from '../edit-chat-room-modal/edit-chat-room-modal.service';
import { SingleChatRoomService } from '../../../services/single-chat-room.service';
import { BehaviorSubject, of } from 'rxjs';
import { UserSelectModalService } from '../../user-select-modal/user-select-modal.service';
import userMock from '../../../../../mocks/responses/user.mock';

describe('ChatRoomTopComponent', () => {
  let comp: ChatRoomTopComponent;
  let fixture: ComponentFixture<ChatRoomTopComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomTopComponent],
      providers: [
        ChangeDetectorRef,
        {
          provide: ChatRoomAvatarsService,
          useValue: MockService(ChatRoomAvatarsService),
        },
        { provide: WINDOW, useValue: jasmine.createSpyObj<Window>(['open']) },
        {
          provide: EditChatRoomModalService,
          useValue: MockService(EditChatRoomModalService),
        },
        {
          provide: SingleChatRoomService,
          useValue: MockService(SingleChatRoomService, {
            has: ['chatRoom$'],
            props: {
              chatRoom$: {
                get: () => new BehaviorSubject<ChatRoomEdge>(mockChatRoomEdge),
              },
            },
          }),
        },
        {
          provide: UserSelectModalService,
          useValue: MockService(UserSelectModalService),
        },
        {
          provide: AddMembersToChatRoomGQL,
          useValue: jasmine.createSpyObj<AddMembersToChatRoomGQL>(['mutate']),
        },
      ],
    }).overrideComponent(ChatRoomTopComponent, {
      set: {
        imports: [
          NgCommonModule,
          RouterTestingModule,
          MockComponent({
            selector: 'minds-avatar',
            inputs: ['object'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRoomTopComponent);
    comp = fixture.componentInstance;

    let edge: ChatRoomEdge = mockChatRoomEdge;
    edge.node.name = 'roomName';
    edge.members.edges = [mockChatMemberEdge];

    (comp as any).chatRoomEdge = edge;
    (comp as any).requestMode = false;

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

  describe('Setting the chat room edge', () => {
    it('should set class variables from chatroom edge', () => {
      (comp as any).chatRoomEdge = {
        ...mockChatRoomEdge,
        node: {
          ...mockChatRoomEdge.node,
          roomType: ChatRoomTypeEnum.OneToOne,
        },
      };
      expect((comp as any).roomName).toBe(mockChatRoomEdge.node.name);
      expect((comp as any).roomGuid).toBe(mockChatRoomEdge.node.guid);
      expect((comp as any).memberEdges).toBe(mockChatRoomEdge.members.edges);
      expect((comp as any).showEditRoomButton).toBe(false);
      expect((comp as any).showAddUsersButton).toBe(false);
    });

    it('should show add user button when multi-user room and not chat request', () => {
      (comp as any).chatRoomEdge = {
        ...mockChatRoomEdge,
        node: {
          ...mockChatRoomEdge.node,
          roomType: ChatRoomTypeEnum.MultiUser,
          isChatRequest: false,
        },
      };
      expect((comp as any).showAddUsersButton).toBe(true);
    });

    it('should not show add user button when not in multi-user room', () => {
      (comp as any).chatRoomEdge = {
        ...mockChatRoomEdge,
        node: {
          ...mockChatRoomEdge.node,
          roomType: ChatRoomTypeEnum.OneToOne,
          isChatRequest: false,
        },
      };
      expect((comp as any).showAddUsersButton).toBe(false);
    });

    it('should not show add user button when it is a chat request', () => {
      (comp as any).chatRoomEdge = {
        ...mockChatRoomEdge,
        node: {
          ...mockChatRoomEdge.node,
          roomType: ChatRoomTypeEnum.MultiUser,
          isChatRequest: true,
        },
      };
      expect((comp as any).showAddUsersButton).toBe(false);
    });
  });

  describe('avatar objects', () => {
    it('should get user avatar objects', () => {
      (comp as any).chatRoomAvatarsService.getUserAvatarObjects.calls.reset();
      (comp as any).chatRoomAvatarsService.getGroupAvatarObjects.calls.reset();

      let edge: ChatRoomEdge = mockChatRoomEdge;
      edge.node.name = 'roomName';
      edge.members.edges = [mockChatMemberEdge];
      edge.node.roomType = ChatRoomTypeEnum.OneToOne;
      edge.node.groupGuid = null;

      const mockAvatars: ChatRoomListAvatarObject[] = [
        {
          guid: mockChatMemberEdge.node.guid,
          type: 'user',
          username: mockChatMemberEdge.node.username,
          navigationPath: `/${mockChatMemberEdge.node.username}`,
        },
      ];
      (comp as any).chatRoomAvatarsService.getUserAvatarObjects.and.returnValue(
        mockAvatars
      );

      (comp as any).chatRoomEdge = edge;
      fixture.detectChanges();
      (comp as any).cd.detectChanges();

      expect((comp as any).avatars).toEqual(mockAvatars);
      expect(
        (comp as any).chatRoomAvatarsService.getGroupAvatarObjects
      ).not.toHaveBeenCalled();
      expect(
        (comp as any).chatRoomAvatarsService.getUserAvatarObjects
      ).toHaveBeenCalledWith([mockChatMemberEdge]);
      expect(fixture.debugElement.queryAll(By.css('minds-avatar')).length).toBe(
        1
      );
    });

    it('should get group avatar object', () => {
      (comp as any).chatRoomAvatarsService.getUserAvatarObjects.calls.reset();
      (comp as any).chatRoomAvatarsService.getGroupAvatarObjects.calls.reset();

      const groupGuid: string = '1234567890123456';

      let edge: ChatRoomEdge = mockChatRoomEdge;
      edge.node.name = 'roomName';
      edge.node.roomType = ChatRoomTypeEnum.GroupOwned;
      edge.node.groupGuid = groupGuid;

      const mockAvatars: ChatRoomListAvatarObject[] = [
        {
          guid: mockChatMemberEdge.node.guid,
          type: 'group',
          navigationPath: `/${mockChatMemberEdge.node.username}`,
        },
      ];

      (
        comp as any
      ).chatRoomAvatarsService.getGroupAvatarObjects.and.returnValue(
        mockAvatars
      );

      (comp as any).chatRoomEdge = edge;
      fixture.detectChanges();
      (comp as any).cd.detectChanges();

      expect((comp as any).avatars).toEqual(mockAvatars);
      expect(
        (comp as any).chatRoomAvatarsService.getUserAvatarObjects
      ).not.toHaveBeenCalled();
      expect(
        (comp as any).chatRoomAvatarsService.getGroupAvatarObjects
      ).toHaveBeenCalledWith(groupGuid);
      expect(fixture.debugElement.queryAll(By.css('minds-avatar')).length).toBe(
        1
      );
    });
  });

  it('should open a path in a new tab', () => {
    (comp as any).openInNewTab('/username');
    expect((comp as any).window.open).toHaveBeenCalledWith(
      '/username',
      '_blank'
    );
  });

  describe('Render template', () => {
    it('should show details icon for non request-mode', () => {
      (comp as any).requestMode = false;

      fixture.detectChanges();
      (comp as any).cd.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.m-chatRoomTop__rightContainer i')
      ).toBeTruthy();
    });

    it('should NOT show details icon for request-mode', () => {
      (comp as any).requestMode = true;

      fixture.detectChanges();
      (comp as any).cd.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.m-chatRoomTop__rightContainer i')
      ).toBeFalsy();
    });
  });

  describe('onEditChatNameClick', () => {
    it('should handle successful chat room name edit', fakeAsync(() => {
      (comp as any).editChatRoomModalService.open.and.returnValue(
        Promise.resolve(true)
      );

      (comp as any).onEditChatNameClick();
      tick();

      expect((comp as any).editChatRoomModalService.open).toHaveBeenCalledWith(
        mockChatRoomEdge
      );
    }));

    it('should handle unsuccessful chat room name edit', fakeAsync(() => {
      (comp as any).editChatRoomModalService.open.and.returnValue(
        Promise.resolve(false)
      );

      (comp as any).onEditChatNameClick();
      tick();

      expect((comp as any).editChatRoomModalService.open).toHaveBeenCalledWith(
        mockChatRoomEdge
      );
    }));
  });

  describe('handleAddToChatClick', () => {
    it('should open user select modal, and handle save function', fakeAsync(() => {
      (comp as any).addMembersToChatRoomGql.mutate.and.returnValue(of(true));

      (comp as any).handleAddToChatClick();

      expect((comp as any).userSelectModalService.open).toHaveBeenCalledWith({
        saveFunction: jasmine.any(Function),
        title: 'Add to chat',
        ctaText: 'Add members',
        emptyStateText: 'Try searching for users.',
        excludedUserGuids: mockChatRoomEdge.members.edges.map(
          (edge: ChatRoomMemberEdge) => edge.node.guid
        ),
      });

      (comp as any).userSelectModalService.open.calls
        .mostRecent()
        .args[0].saveFunction([userMock]);
      tick();

      expect((comp as any).addMembersToChatRoomGql.mutate).toHaveBeenCalledWith(
        {
          roomGuid: mockChatRoomEdge.node.guid,
          memberGuids: [userMock.guid],
        }
      );
      expect((comp as any).singleChatRoomService.refetch).toHaveBeenCalled();
    }));
  });
});
