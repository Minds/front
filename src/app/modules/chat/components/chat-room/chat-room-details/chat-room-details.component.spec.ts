import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChatRoomDetailsComponent } from './chat-room-details.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { TotalChatRoomMembersService } from '../../../services/total-chat-room-members.service';
import { ChatRoomMembersService } from '../../../services/chat-room-members.service';
import { SingleChatRoomService } from '../../../services/single-chat-room.service';
import { ChatRoomUserActionsService } from '../../../services/chat-room-user-actions.service';
import { ChatRoomsListService } from '../../../services/chat-rooms-list.service';
import { ModalService } from '../../../../../services/ux/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ChatRoomEdge,
  ChatRoomTypeEnum,
} from '../../../../../../graphql/generated.engine';
import { mockChatRoomEdge } from '../../../../../mocks/chat.mock';
import { ConfirmV2Component } from '../../../../modals/confirm-v2/confirm.component';

const DEFAULT_ROOM_GUID: string = '1234567890123456';

describe('ChatRoomDetailsComponent', () => {
  let comp: ChatRoomDetailsComponent;
  let fixture: ComponentFixture<ChatRoomDetailsComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomDetailsComponent],
      providers: [
        {
          provide: TotalChatRoomMembersService,
          useValue: MockService(TotalChatRoomMembersService, {
            has: ['membersCount$'],
            props: {
              membersCount$: {
                get: () => new BehaviorSubject<number>(5),
              },
            },
          }),
        },
        {
          provide: ChatRoomMembersService,
          useValue: MockService(ChatRoomMembersService, {
            has: ['initialized$'],
            props: {
              initialized$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
            },
          }),
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
          provide: ChatRoomUserActionsService,
          useValue: MockService(ChatRoomUserActionsService),
        },
        {
          provide: ChatRoomsListService,
          useValue: MockService(ChatRoomsListService),
        },
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: Router, useValue: MockService(Router) },
        { provide: ActivatedRoute, useValue: MockService(ActivatedRoute) },
        Injector,
      ],
    }).overrideComponent(ChatRoomDetailsComponent, {
      set: {
        imports: [
          NgCommonModule,
          MockComponent({
            selector: 'm-chatRoom__notificationSettings',
            standalone: true,
          }),
          MockComponent({
            selector: 'm-chatRoom__membersList',
            inputs: ['roomGuid'],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRoomDetailsComponent);
    comp = fixture.componentInstance;

    (comp as any).roomGuid = DEFAULT_ROOM_GUID;

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
    expect((comp as any).chatRoomMembersService.init).toHaveBeenCalledWith(
      DEFAULT_ROOM_GUID
    );
  });

  describe('onBlockUserClick', () => {
    it('should handle block user click', fakeAsync(() => {
      const chatRoom: ChatRoomEdge = mockChatRoomEdge;
      chatRoom.node.roomType = ChatRoomTypeEnum.OneToOne;
      (comp as any).chatRoom$.next(mockChatRoomEdge);

      (comp as any).onBlockUserClick();
      tick();

      expect((comp as any).modalService.present).toHaveBeenCalledWith(
        ConfirmV2Component,
        {
          data: {
            title: 'Block user',
            body:
              'Are you sure you want to block this user? \n\n' +
              "Blocking ensures that you won't receive any message requests from this user going forward. Your chat history with this user will be deleted.",
            confirmButtonText: 'Block',
            confirmButtonColor: 'red',
            confirmButtonSolid: true,
            showCancelButton: false,
            onConfirm: jasmine.any(Function),
          },
          injector: (comp as any).injector,
        }
      );
    }));

    it('should NOT handle block user click for multi user rooms', fakeAsync(() => {
      const chatRoom: ChatRoomEdge = mockChatRoomEdge;
      chatRoom.node.roomType = ChatRoomTypeEnum.MultiUser;
      (comp as any).chatRoom$.next(mockChatRoomEdge);

      (comp as any).onBlockUserClick();
      tick();

      expect((comp as any).modalService.present).not.toHaveBeenCalled();
    }));

    it('should NOT handle block user click for group owned rooms', fakeAsync(() => {
      const chatRoom: ChatRoomEdge = mockChatRoomEdge;
      chatRoom.node.roomType = ChatRoomTypeEnum.GroupOwned;
      (comp as any).chatRoom$.next(mockChatRoomEdge);

      (comp as any).onBlockUserClick();
      tick();

      expect((comp as any).modalService.present).not.toHaveBeenCalled();
    }));
  });

  it('should handle delete chat click', fakeAsync(() => {
    (comp as any).onDeleteChatClick();
    tick();

    expect((comp as any).modalService.present).toHaveBeenCalledWith(
      ConfirmV2Component,
      {
        data: {
          title: 'Delete chat',
          body:
            'Are you sure you want to delete this chat?\n\n' +
            'This chat will be deleted for everyone in the chat. No one will be able to see it and all of the message history will be deleted.',
          confirmButtonText: 'Delete',
          confirmButtonColor: 'red',
          confirmButtonSolid: true,
          showCancelButton: false,
          onConfirm: jasmine.any(Function),
        },
        injector: (comp as any).injector,
      }
    );
  }));

  it('should handle leave chat click', fakeAsync(() => {
    (comp as any).onLeaveChatClick();
    tick();

    expect((comp as any).modalService.present).toHaveBeenCalledWith(
      ConfirmV2Component,
      {
        data: {
          title: 'Leave chat',
          body:
            'Are you sure you want to leave this chat?\n\n' +
            'This chat will be removed from your chat list.',
          confirmButtonText: 'Leave',
          confirmButtonColor: 'red',
          confirmButtonSolid: true,
          showCancelButton: false,
          onConfirm: jasmine.any(Function),
        },
        injector: (comp as any).injector,
      }
    );
  }));

  it('should handle navigate back', () => {
    (comp as any).navigateBack();
    expect((comp as any).router.navigate).toHaveBeenCalledWith(['..'], {
      relativeTo: (comp as any).route,
    });
  });
});
