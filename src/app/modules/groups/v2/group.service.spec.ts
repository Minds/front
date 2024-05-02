import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GroupService } from './group.service';
import { MockService } from '../../../utils/mock';
import { ApiService } from '../../../common/api/api.service';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupsService } from '../groups.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { ChatRoomUserActionsService } from '../../chat/services/chat-room-user-actions.service';
import { CreateChatRoomService } from '../../chat/services/create-chat-room.service';
import { EventEmitter } from '@angular/core';
import { groupMock } from '../../../mocks/responses/group.mock';
import { ChatRoomTypeEnum } from '../../../../graphql/generated.engine';

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: MockService(ApiService) },
        {
          provide: Session,
          useValue: MockService(Session, {
            has: ['loggedinEmitter'],
            props: {
              loggedinEmitter: {
                get: () => new EventEmitter<boolean>(),
              },
            },
          }),
        },
        { provide: ActivatedRoute, useValue: MockService(ActivatedRoute) },
        { provide: GroupsService, useValue: MockService(GroupsService) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: Router, useValue: MockService(Router) },
        { provide: IsTenantService, useValue: MockService(IsTenantService) },
        { provide: AuthModalService, useValue: MockService(AuthModalService) },
        {
          provide: ChatRoomUserActionsService,
          useValue: MockService(ChatRoomUserActionsService),
        },
        {
          provide: CreateChatRoomService,
          useValue: MockService(CreateChatRoomService),
        },
        GroupService,
      ],
    });

    service = TestBed.inject(GroupService);
    service.load(groupMock);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('setGroupChatRoomsDisabled', () => {
    it('should set group chat rooms to disabled', fakeAsync(() => {
      (service as any).chatRoomUserActions.deleteGroupChatRooms.and.returnValue(
        Promise.resolve(true)
      );

      service.setGroupChatRoomsDisabled(true);
      tick();

      expect(
        (service as any).chatRoomUserActions.deleteGroupChatRooms
      ).toHaveBeenCalledOnceWith(service.guid$.getValue());
      expect(service.isCoversationDisabled$.getValue()).toBeTrue();
    }));

    it('should set group chat rooms to enabled', fakeAsync(() => {
      (service as any).createChatRoomService.createChatRoom.and.returnValue(
        Promise.resolve(true)
      );

      service.setGroupChatRoomsDisabled(false);
      tick();

      expect(
        (service as any).createChatRoomService.createChatRoom
      ).toHaveBeenCalledOnceWith(
        [],
        ChatRoomTypeEnum.GroupOwned,
        service.guid$.getValue()
      );
      expect((service as any).toaster.success).toHaveBeenCalledOnceWith(
        'Group chat room created'
      );
      expect(service.isCoversationDisabled$.getValue()).toBeFalse();
    }));
  });
});
