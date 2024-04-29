import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  ChatRoomEdge,
  ChatRoomTypeEnum,
} from '../../../../../../graphql/generated.engine';

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
});
