import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { GroupsSettingsButton } from './groups-settings-button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { MockComponent, MockDirective, MockService } from '../../../utils/mock';
import { GroupsService } from '../groups.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { ModalService } from '../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../tests/modal-service-mock.spec';

let groupConfig = {
  countMembers: Promise.resolve(1),
};

let groupsServiceMock: any = MockService(GroupsService, groupConfig);

describe('GroupsSettingsButton', () => {
  let comp: GroupsSettingsButton;
  let fixture: ComponentFixture<GroupsSettingsButton>;

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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
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

          GroupsSettingsButton,
        ],
        imports: [RouterTestingModule, FormsModule],
        providers: [
          { provide: GroupsService, useValue: groupsServiceMock },
          { provide: Client, useValue: clientMock },
          { provide: Session, useValue: sessionMock },
          { provide: ModalService, useValue: modalServiceMock },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(GroupsSettingsButton);

    comp = fixture.componentInstance;

    comp._group = {
      guid: '1234',
      'is:muted': false,
      'is:creator': true,
      mature: false,
    };

    clientMock.response = {};

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a dropdown component', () => {
    const dropdown = getDropdown();
    expect(dropdown).not.toBeNull();
  });

  xit('should have button that lets you toggle the menu', () => {
    const button = getButton();
    expect(button).not.toBeNull();
    expect(getMenu()).toBeNull();

    // Open the menu
    button.nativeElement.click();
    fixture.detectChanges();

    expect(getMenu()).not.toBeNull();
  });

  xit('should have an option to mute / unmute the group', fakeAsync(() => {
    const mute = getMenuItem(1);
    const unmute = getMenuItem(2);

    expect(mute).not.toBeNull();
    expect(mute.nativeElement.textContent).toContain('Disable notifications');
    expect(mute.nativeElement.hidden).toBeFalsy();

    expect(unmute).not.toBeNull();
    expect(unmute.nativeElement.textContent).toContain('Enable notifications');
    expect(unmute.nativeElement.hidden).toBeTruthy();

    mute.nativeElement.click();

    fixture.detectChanges();
    jasmine.clock().tick(10);

    expect(groupsServiceMock.muteNotifications).toHaveBeenCalled();

    expect(mute.nativeElement.hidden).toBeTruthy();
    expect(unmute.nativeElement.hidden).toBeFalsy();
  }));

  xit('should have an option to feature / unfeature the group', fakeAsync(() => {
    const feature = getMenuItem(3);

    expect(feature).not.toBeNull();
    expect(feature.nativeElement.textContent).toContain('Feature');

    feature.nativeElement.click();
    expect(comp.featureModalOpen).toBeTruthy();

    clientMock.response['api/v1/admin/feature/1234/not-selected'] = {
      status: 'success',
    };

    const modalButton = fixture.debugElement.query(
      By.css('m-modal .m-button-feature-modal button.mdl-button')
    );
    expect(modalButton).not.toBeNull();
    expect(modalButton.nativeElement.textContent).toContain('Feature');
    modalButton.nativeElement.click();

    fixture.detectChanges();
    jasmine.clock().tick(10);

    expect(clientMock.put).toHaveBeenCalled();
    expect(clientMock.put.calls.mostRecent().args[0]).toBe(
      'api/v1/admin/feature/1234/not-selected'
    );

    expect(comp.group.featured).toBeTruthy();

    const unfeature = getMenuItem(3);

    expect(unfeature).not.toBeNull();
    expect(unfeature.nativeElement.textContent).toContain('Unfeature');

    clientMock.response['api/v1/admin/feature/1234'] = { status: 'success' };

    unfeature.nativeElement.click();
    expect(clientMock.delete).toHaveBeenCalled();
    expect(clientMock.delete.calls.mostRecent().args[0]).toBe(
      'api/v1/admin/feature/1234'
    );
  }));

  xit('should have an option to report', () => {
    // Open the menu
    const button = getButton();
    button.nativeElement.click();
    fixture.detectChanges();

    const report = fixture.debugElement.query(
      By.css(`.m-dropdownMenu__menu .m-groups-settings-dropdown__item--report`)
    );
    expect(report).not.toBeNull();

    report.nativeElement.click();
    expect(modalServiceMock.present).toHaveBeenCalled();
  });

  xit('should have an option to delete the group only if the user is a creator', () => {
    const group = {
      guid: '1234',
      'is:muted': false,
      'is:creator': true,
    };

    // Open the menu
    const button = getButton();
    button.nativeElement.click();
    fixture.detectChanges();

    // User is creator
    const deleteGroup = getDeleteGroupItem();
    expect(deleteGroup).not.toBeNull();

    // User is not creator
    group['is:creator'] = false;
    comp._group = group;
    fixture.detectChanges();

    expect(getDeleteGroupItem()).toBeNull();
  });

  xit('should show confirmation modal from group deletion', () => {
    // Open the menu
    const button = getButton();
    button.nativeElement.click();
    fixture.detectChanges();

    getDeleteGroupItem().nativeElement.click();
    expect(modalServiceMock.present).toHaveBeenCalled();
  });

  it('it should call to delete a group', () => {
    (comp as any).service.deleteGroup.and.returnValue(
      new Promise((resolve, reject) => true)
    );
    comp.delete();
    expect((comp as any).service.deleteGroup).toHaveBeenCalled();
  });

  it('it should call to set the group to be explicit', () => {
    (comp as any).service.setExplicit.and.returnValue(
      new Promise((resolve, reject) => true)
    );
    comp.setExplicit(true);
    expect((comp as any).service.setExplicit).toHaveBeenCalled();
  });
});
