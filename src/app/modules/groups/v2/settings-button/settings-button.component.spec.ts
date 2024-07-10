import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { GroupSettingsButton } from './settings-button.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { GroupService } from '../group.service';
import { By } from '@angular/platform-browser';
import { GroupEditModalService } from '../edit/edit.modal.service';
import { BoostModalV2LazyService } from '../../../boost/modal-v2/boost-modal-v2-lazy.service';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../services/session-mock';
import { ModalService } from '../../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../../tests/modal-service-mock.spec';
import { BehaviorSubject } from 'rxjs';
import { NsfwEnabledService } from '../../../multi-tenant-network/services/nsfw-enabled.service';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { ConfirmV2Component } from '../../../modals/confirm-v2/confirm.component';
import { GroupChatRoomService } from '../services/group-chat-rooms.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { groupMock } from '../../../../mocks/responses/group.mock';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';
import { PermissionsEnum } from '../../../../../graphql/generated.engine';

describe('GroupSettingsButton', () => {
  let comp: GroupSettingsButton;
  let fixture: ComponentFixture<GroupSettingsButton>;

  function getDropdown(): DebugElement {
    return fixture.debugElement.query(By.css('m-dropdownMenu'));
  }

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'm-modal',
          template: '<ng-content></ng-content>',
          inputs: ['open'],
          outputs: ['closed'],
        }),
        MockComponent({
          selector: 'm-nsfwSelector',
          inputs: ['selected'],
          outputs: ['selected', 'selectedChange'],
        }),
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['menu', 'anchorPosition'],
        }),
        MockComponent({
          selector: 'm-dropdownMenu__item',
          outputs: ['click'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['overlay', 'iconOnly'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-icon',
          inputs: ['iconId', 'sizeFactor'],
        }),
        GroupSettingsButton,
      ],
      providers: [
        {
          provide: GroupService,
          useValue: MockService(GroupService, {
            has: ['group$'],
            props: {
              group$: { get: () => new BehaviorSubject<string>('') },
            },
          }),
        },
        { provide: Session, useValue: sessionMock },
        { provide: ModalService, useValue: modalServiceMock },
        {
          provide: BoostModalV2LazyService,
          useValue: MockService(BoostModalV2LazyService),
        },
        {
          provide: GroupEditModalService,
          useValue: MockService(GroupEditModalService),
        },
        {
          provide: NsfwEnabledService,
          useValue: MockService(NsfwEnabledService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        {
          provide: GroupChatRoomService,
          useValue: MockService(GroupChatRoomService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupSettingsButton);
    comp = fixture.componentInstance;

    comp.group = groupMock;

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

  it('should set canShowEnableChatRoom on init', () => {
    (comp as any).canShowEnableChatRoom = true;

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanCreateChatRoom)
      .and.returnValue(true);
    comp.ngOnInit();
    expect((comp as any).canShowEnableChatRoom).toBeFalse();

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanCreateChatRoom)
      .and.returnValue(false);
    comp.ngOnInit();
    expect((comp as any).canShowEnableChatRoom).toBeTrue();
  });

  describe('hasBoostPermission', () => {
    it('should return true if the user has the boost permission', () => {
      (comp as any).permissionsService.canBoost.and.returnValue(true);
      comp.ngOnInit();
      expect((comp as any).hasBoostPermission).toBe(true);
    });

    it('should return false if the user does not have the boost permission', () => {
      (comp as any).permissionsService.canBoost.and.returnValue(false);
      comp.ngOnInit();
      expect((comp as any).hasBoostPermission).toBe(false);
    });
  });

  it('should have a dropdown component', () => {
    const dropdown = getDropdown();
    expect(dropdown).not.toBeNull();
  });

  it('it should call to set the group to be explicit', () => {
    (comp as any).service.toggleExplicit.and.returnValue(
      new Promise((resolve, reject) => true)
    );
    comp.toggleExplicit(true);
    expect((comp as any).service.toggleExplicit).toHaveBeenCalled();
  });

  describe('onBoostGroupClick', () => {
    it('should open the boost modal on open boost modal click', () => {
      comp.group = groupMock;

      comp.onBoostGroupClick();

      expect((comp as any).boostModal.open).toHaveBeenCalledWith(comp.group);
    });
  });

  describe('deleteChatRoom', () => {
    beforeEach(() => {
      modalServiceMock.present.calls.reset();
      (comp as any).service.setConversationDisabled.calls.reset();
    });

    afterEach(() => {
      modalServiceMock.present.calls.reset();
      (comp as any).service.setConversationDisabled.calls.reset();
    });

    it('should handle chat room deletion', fakeAsync(() => {
      const modalDismissSpy = jasmine.createSpy('dismiss');
      modalServiceMock.present.and.returnValue({
        dismiss: modalDismissSpy,
      });
      (comp as any).groupChatService.deleteGroupChatRooms.and.returnValue(
        Promise.resolve(true)
      );

      comp.deleteChatRooms();
      tick();

      expect(modalServiceMock.present).toHaveBeenCalledOnceWith(
        ConfirmV2Component,
        {
          data: {
            title: 'Disable chat room?',
            body: "Your current group's chat history will be deleted if you disable the chat room. You can always enable the group's chat room after disabling to get a new chat room with all your group members.",
            confirmButtonColor: 'red',
            confirmButtonSolid: false,
            confirmButtonText: 'Disable',
            showCancelButton: false,
            onConfirm: jasmine.any(Function),
          },
          injector: (comp as any).injector,
        }
      );

      // test callback.
      const onConfirm = (comp as any).modalService.present.calls.mostRecent()
        .args[1].data.onConfirm;
      onConfirm();
      tick();

      expect(
        (comp as any).groupChatService.deleteGroupChatRooms
      ).toHaveBeenCalledOnceWith((comp as any).group.guid);
      expect(modalDismissSpy).toHaveBeenCalledTimes(1);
      expect(
        (comp as any).service.setConversationDisabled
      ).toHaveBeenCalledOnceWith(true);
      expect((comp as any).toasterService.success).toHaveBeenCalledOnceWith(
        'Chat room deleted'
      );
    }));

    it('should handle failures during chat room deletion', fakeAsync(() => {
      const modalDismissSpy = jasmine.createSpy('dismiss');
      modalServiceMock.present.and.returnValue({
        dismiss: modalDismissSpy,
      });
      (comp as any).groupChatService.deleteGroupChatRooms.and.returnValue(
        Promise.resolve(false)
      );

      comp.deleteChatRooms();
      tick();

      expect(modalServiceMock.present).toHaveBeenCalledOnceWith(
        ConfirmV2Component,
        {
          data: {
            title: 'Disable chat room?',
            body: "Your current group's chat history will be deleted if you disable the chat room. You can always enable the group's chat room after disabling to get a new chat room with all your group members.",
            confirmButtonColor: 'red',
            confirmButtonSolid: false,
            confirmButtonText: 'Disable',
            showCancelButton: false,
            onConfirm: jasmine.any(Function),
          },
          injector: (comp as any).injector,
        }
      );

      // test callback.
      const onConfirm = (comp as any).modalService.present.calls.mostRecent()
        .args[1].data.onConfirm;
      onConfirm();
      tick();

      expect(
        (comp as any).groupChatService.deleteGroupChatRooms
      ).toHaveBeenCalledOnceWith((comp as any).group.guid);
      expect(modalDismissSpy).toHaveBeenCalledTimes(1);
      expect(
        (comp as any).service.setConversationDisabled
      ).not.toHaveBeenCalled();
      expect((comp as any).toasterService.success).not.toHaveBeenCalled();
    }));
  });

  describe('createChatRoom', () => {
    afterEach(() => {
      (comp as any).service?.setConversationDisabled.calls.reset();
    });

    it('should handle chat room creation', fakeAsync(() => {
      (comp as any).service.setConversationDisabled.calls.reset();
      (comp as any).groupChatService.createGroupChatRoom.and.returnValue(
        Promise.resolve(true)
      );
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanCreateChatRoom)
        .and.returnValue(true);

      comp.createChatRoom();
      tick();

      expect(
        (comp as any).groupChatService.createGroupChatRoom
      ).toHaveBeenCalledOnceWith((comp as any).group.guid);
      expect(
        (comp as any).service.setConversationDisabled
      ).toHaveBeenCalledOnceWith(false);
      expect((comp as any).toasterService.success).toHaveBeenCalledOnceWith(
        'Chat room created'
      );
    }));

    it('should handle failures during chat room creation', fakeAsync(() => {
      (comp as any).service.setConversationDisabled.calls.reset();

      (comp as any).groupChatService.createGroupChatRoom.and.returnValue(
        Promise.resolve(false)
      );
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanCreateChatRoom)
        .and.returnValue(true);

      comp.createChatRoom();
      tick();

      expect(
        (comp as any).groupChatService.createGroupChatRoom
      ).toHaveBeenCalledOnceWith((comp as any).group.guid);
      expect(
        (comp as any).service.setConversationDisabled
      ).not.toHaveBeenCalled();
      expect((comp as any).toasterService.success).not.toHaveBeenCalled();
    }));

    it('should NOT handle chat room creation if a user does not have permission', fakeAsync(() => {
      (comp as any).service.setConversationDisabled.calls.reset();
      (comp as any).groupChatService.createGroupChatRoom.and.returnValue(
        Promise.resolve(true)
      );
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanCreateChatRoom)
        .and.returnValue(false);

      comp.createChatRoom();
      tick();

      expect(
        (comp as any).groupChatService.createGroupChatRoom
      ).not.toHaveBeenCalled();
    }));
  });
});
