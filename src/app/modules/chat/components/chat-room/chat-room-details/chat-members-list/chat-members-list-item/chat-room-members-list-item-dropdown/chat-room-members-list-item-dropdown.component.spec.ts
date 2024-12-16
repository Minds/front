import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ChatRoomMembersListItemDropdownComponent } from './chat-room-members-list-item-dropdown.component';
import { MockService } from '../../../../../../../../utils/mock';
import { Router } from '@angular/router';
import { Session } from '../../../../../../../../services/session';
import { SingleChatRoomService } from '../../../../../../services/single-chat-room.service';
import { ChatRoomUserActionsService } from '../../../../../../services/chat-room-user-actions.service';
import { ChatRoomMembersService } from '../../../../../../services/chat-room-members.service';
import { TotalChatRoomMembersService } from '../../../../../../services/total-chat-room-members.service';
import userMock from '../../../../../../../../mocks/responses/user.mock';
import { BehaviorSubject, take } from 'rxjs';
import {
  mockChatMemberEdge,
  mockChatRoomEdge,
} from '../../../../../../../../mocks/chat.mock';
import {
  ChatRoomEdge,
  ChatRoomMemberEdge,
  ChatRoomRoleEnum,
  ChatRoomTypeEnum,
} from '../../../../../../../../../graphql/generated.engine';

describe('ChatRoomMembersListItemDropdownComponent', () => {
  let comp: ChatRoomMembersListItemDropdownComponent;
  let fixture: ComponentFixture<ChatRoomMembersListItemDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ChatRoomMembersListItemDropdownComponent],
      providers: [
        { provide: Router, useValue: MockService(Router) },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: SingleChatRoomService,
          useValue: MockService(TotalChatRoomMembersService, {
            has: ['chatRoom$'],
            props: {
              chatRoom$: {
                get: () => new BehaviorSubject(mockChatRoomEdge),
              },
            },
          }),
        },
        {
          provide: ChatRoomUserActionsService,
          useValue: MockService(ChatRoomUserActionsService),
        },
        {
          provide: ChatRoomMembersService,
          useValue: MockService(ChatRoomMembersService),
        },
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
      ],
    });
  }));

  beforeEach((done: DoneFn) => {
    fixture = TestBed.createComponent(ChatRoomMembersListItemDropdownComponent);
    comp = fixture.componentInstance;

    (comp as any).session.getLoggedInUser.and.returnValue(userMock);
    (comp as any).loggedInUserGuid = userMock.guid;
    (comp as any).memberEdge = mockChatMemberEdge;
    (comp as any).singleChatRoomService.chatRoom$.next(mockChatRoomEdge);

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

  describe('showRemoveFromChatOption$', () => {
    it('should return true when option should show', (done: DoneFn) => {
      let chatRoomEdge: ChatRoomEdge = mockChatRoomEdge;
      chatRoomEdge.node.roomType = ChatRoomTypeEnum.GroupOwned;
      chatRoomEdge.node.isUserRoomOwner = true;
      (comp as any).memberEdge = {
        node: { guid: userMock.guid + '1' },
        role: ChatRoomRoleEnum.Member,
      } as ChatRoomMemberEdge;
      (comp as any).loggedInUserGuid = userMock.guid + '2';
      (comp as any).totalChatRoomMembersService.membersCount$.next(3);
      (comp as any).singleChatRoomService.chatRoom$.next(chatRoomEdge);

      (comp as any).showRemoveFromChatOption$
        .pipe(take(1))
        .subscribe((show: boolean) => {
          expect(show).toBeTrue();
          done();
        });
    });

    it('should return false when option should NOT show because room is one to one', (done: DoneFn) => {
      let chatRoomEdge: ChatRoomEdge = mockChatRoomEdge;
      chatRoomEdge.node.roomType = ChatRoomTypeEnum.OneToOne;
      chatRoomEdge.node.isUserRoomOwner = true;
      (comp as any).memberEdge = {
        node: { guid: userMock.guid + '1' },
        role: ChatRoomRoleEnum.Member,
      } as ChatRoomMemberEdge;
      (comp as any).loggedInUserGuid = userMock.guid + '2';
      (comp as any).totalChatRoomMembersService.membersCount$.next(3);
      (comp as any).singleChatRoomService.chatRoom$.next(chatRoomEdge);

      (comp as any).showRemoveFromChatOption$
        .pipe(take(1))
        .subscribe((show: boolean) => {
          expect(show).toBeFalse();
          done();
        });
    });

    it('should return false when option should NOT show because user is not room owner', (done: DoneFn) => {
      let chatRoomEdge: ChatRoomEdge = mockChatRoomEdge;
      chatRoomEdge.node.roomType = ChatRoomTypeEnum.GroupOwned;
      chatRoomEdge.node.isUserRoomOwner = false;
      (comp as any).memberEdge = {
        node: { guid: userMock.guid + '1' },
        role: ChatRoomRoleEnum.Member,
      } as ChatRoomMemberEdge;
      (comp as any).loggedInUserGuid = userMock.guid + '2';
      (comp as any).totalChatRoomMembersService.membersCount$.next(3);
      (comp as any).singleChatRoomService.chatRoom$.next(chatRoomEdge);

      (comp as any).showRemoveFromChatOption$
        .pipe(take(1))
        .subscribe((show: boolean) => {
          expect(show).toBeFalse();
          done();
        });
    });

    it('should return false when option should NOT show because there are 2 members', (done: DoneFn) => {
      let chatRoomEdge: ChatRoomEdge = mockChatRoomEdge;
      chatRoomEdge.node.roomType = ChatRoomTypeEnum.GroupOwned;
      chatRoomEdge.node.isUserRoomOwner = true;
      (comp as any).memberEdge = {
        node: { guid: userMock.guid + '1' },
        role: ChatRoomRoleEnum.Member,
      } as ChatRoomMemberEdge;
      (comp as any).loggedInUserGuid = userMock.guid + '2';
      (comp as any).totalChatRoomMembersService.membersCount$.next(2);
      (comp as any).singleChatRoomService.chatRoom$.next(chatRoomEdge);

      (comp as any).showRemoveFromChatOption$
        .pipe(take(1))
        .subscribe((show: boolean) => {
          expect(show).toBeFalse();
          done();
        });
    });

    it('should return false when option should NOT show because the member is an owner', (done: DoneFn) => {
      let chatRoomEdge: ChatRoomEdge = mockChatRoomEdge;
      chatRoomEdge.node.roomType = ChatRoomTypeEnum.GroupOwned;
      chatRoomEdge.node.isUserRoomOwner = true;
      (comp as any).memberEdge = {
        node: { guid: userMock.guid + '1' },
        role: ChatRoomRoleEnum.Owner,
      } as ChatRoomMemberEdge;
      (comp as any).loggedInUserGuid = userMock.guid + '2';
      (comp as any).totalChatRoomMembersService.membersCount$.next(3);
      (comp as any).singleChatRoomService.chatRoom$.next(chatRoomEdge);

      (comp as any).showRemoveFromChatOption$
        .pipe(take(1))
        .subscribe((show: boolean) => {
          expect(show).toBeFalse();
          done();
        });
    });

    it('should return true when option should show because the member is the logged in user', (done: DoneFn) => {
      let chatRoomEdge: ChatRoomEdge = mockChatRoomEdge;
      chatRoomEdge.node.roomType = ChatRoomTypeEnum.GroupOwned;
      chatRoomEdge.node.isUserRoomOwner = true;
      (comp as any).memberEdge = {
        node: { guid: userMock.guid },
        role: ChatRoomRoleEnum.Member,
      } as ChatRoomMemberEdge;
      (comp as any).loggedInUserGuid = userMock.guid;
      (comp as any).totalChatRoomMembersService.membersCount$.next(3);
      (comp as any).singleChatRoomService.chatRoom$.next(chatRoomEdge);

      (comp as any).showRemoveFromChatOption$
        .pipe(take(1))
        .subscribe((show: boolean) => {
          expect(show).toBeFalse();
          done();
        });
    });
  });

  it('should set dropdownMenuShown to true', () => {
    (comp as any).dropdownMenuShown = false;
    (comp as any).onFloatUiShown();
    expect((comp as any).dropdownMenuShown).toBeTrue();
  });

  it('should set dropdownMenuShown to false', () => {
    (comp as any).dropdownMenuShown = true;
    (comp as any).onFloatUiHidden();
    expect((comp as any).dropdownMenuShown).toBeFalse();
  });

  it('should handle on view profile click', () => {
    (comp as any).memberEdge = {
      node: { username: 'testaccount' },
      role: ChatRoomRoleEnum.Member,
    } as ChatRoomMemberEdge;
    (comp as any).onViewProfileClick();
    expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
      '/testaccount'
    );
  });

  describe('onRemoveFromChat', () => {
    it('should call to remove user from chat and reinit relevant services', fakeAsync(() => {
      (comp as any).userActions.removeFromChatRoom.and.returnValue(
        Promise.resolve(true)
      );

      (comp as any).onRemoveMemberClick();
      tick();

      expect((comp as any).userActions.removeFromChatRoom).toHaveBeenCalled();
      expect((comp as any).chatRoomMembersService.refetch).toHaveBeenCalled();
      expect((comp as any).singleChatRoomService.refetch).toHaveBeenCalled();
      expect(
        (comp as any).totalChatRoomMembersService.refetch
      ).toHaveBeenCalled();
    }));

    it('should call to remove user from chat and NOT reinit relevant services if not successful', fakeAsync(() => {
      (comp as any).userActions.removeFromChatRoom.and.returnValue(
        Promise.resolve(false)
      );

      (comp as any).onRemoveMemberClick();
      tick();

      expect((comp as any).userActions.removeFromChatRoom).toHaveBeenCalled();
      expect(
        (comp as any).chatRoomMembersService.refetch
      ).not.toHaveBeenCalled();
      expect(
        (comp as any).singleChatRoomService.refetch
      ).not.toHaveBeenCalled();
      expect(
        (comp as any).totalChatRoomMembersService.refetch
      ).not.toHaveBeenCalled();
    }));
  });
});
