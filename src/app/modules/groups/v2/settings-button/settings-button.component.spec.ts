import {
  ComponentFixture,
  fakeAsync,
  TestBed,
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
import { ConfirmV2Component } from '../../../modals/confirm-v2/confirm.component';

let groupServiceMock: any = MockService(GroupService, {
  has: ['group$'],
  props: {
    group$: { get: () => new BehaviorSubject<string>('') },
  },
});

describe('GroupSettingsButton', () => {
  let comp: GroupSettingsButton;
  let fixture: ComponentFixture<GroupSettingsButton>;

  function getDropdown(): DebugElement {
    return fixture.debugElement.query(By.css('m-dropdownMenu'));
  }

  function getButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-dropdownMenu__trigger'));
  }

  function getMenu(): DebugElement {
    return fixture.debugElement.query(By.css(`.m-dropdownMenu__menu`));
  }

  function getMenuItem(i: number): DebugElement {
    return fixture.debugElement.query(
      By.css(`.m-dropdownMenu__menu ul:nth-child(${i})`)
    );
  }

  function getDeleteGroupItem(): DebugElement | null {
    return fixture.debugElement.query(
      By.css(`.m-groups-settings-dropdown__item--deleteGroup`)
    );
  }

  beforeEach(waitForAsync(() => {
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
        { provide: GroupService, useValue: groupServiceMock },
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
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(GroupSettingsButton);

    comp = fixture.componentInstance;

    comp.group = {
      guid: '1234',
      'is:muted': false,
      'is:creator': true,
      mature: false,
    };

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
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
      comp.group = {
        guid: '1234',
        type: 'group',
        'is:muted': false,
        'is:creator': true,
      };

      comp.onBoostGroupClick();

      expect((comp as any).boostModal.open).toHaveBeenCalledWith(comp.group);
    });
  });

  describe('setGroupChatRoomsDisabled', () => {
    beforeAll(() => {
      (comp as any).service.setGroupChatRoomsDisabled.calls.reset();
      modalServiceMock.present.calls.reset();
    });

    afterEach(() => {
      (comp as any).service.setGroupChatRoomsDisabled.calls.reset();
      modalServiceMock.present.calls.reset();
    });

    it('should show confirmation modal when setting a chat room to disabled', fakeAsync(() => {
      const modalDismissSpy = jasmine.createSpy('dismiss');
      modalServiceMock.present.and.returnValue({
        dismiss: modalDismissSpy,
      });
      comp.setGroupChatRoomsDisabled(true);
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

      expect(modalDismissSpy).toHaveBeenCalledTimes(1);
      expect(
        (comp as any).service.setGroupChatRoomsDisabled
      ).toHaveBeenCalledOnceWith(true);
    }));

    it('should set group chat rooms to enabled', fakeAsync(() => {
      (comp as any).service.setGroupChatRoomsDisabled.and.returnValue(
        Promise.resolve(true)
      );
      comp.setGroupChatRoomsDisabled(false);
      tick();

      expect(
        (comp as any).service.setGroupChatRoomsDisabled
      ).toHaveBeenCalledOnceWith(false);
    }));
  });
});
