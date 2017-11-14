///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule as NgCommonModule } from '@angular/common';

import { Hovercard } from '../../../common/directives/hovercard';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { HovercardService } from '../../../services/hovercard';
import { hovercardServiceMock } from '../../../mocks/services/hovercard-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';

import { GroupsMembersModuleComponent } from './members';

describe('GroupsMembersModuleComponent', () => {
  let fixture: ComponentFixture<GroupsMembersModuleComponent>;
  let membersComponent: GroupsMembersModuleComponent;

  const group = {
    'guid': '11111'
  };

  const successfulGroupResponse = {
    'load-next': '77792',
    'status': 'success',
    'members': [
      { 'guid': '77771', 'username': 'testuser1' },
      { 'guid': '77772', 'username': 'testuser2' },
      { 'guid': '77773', 'username': 'testuser3' },
      { 'guid': '77774', 'username': 'testuser4' },
      { 'guid': '77775', 'username': 'testuser5' },
      { 'guid': '77776', 'username': 'testuser6' },
      { 'guid': '77777', 'username': 'testuser7' },
      { 'guid': '77778', 'username': 'testuser8' },
      { 'guid': '77779', 'username': 'testuser9' },
      { 'guid': '77780', 'username': 'testuser10' },
      { 'guid': '77781', 'username': 'testuser11' },
      { 'guid': '77782', 'username': 'testuser12' },
      { 'guid': '77783', 'username': 'testuser13' },
      { 'guid': '77784', 'username': 'testuser14' },
      { 'guid': '77785', 'username': 'testuser15' },
      { 'guid': '77786', 'username': 'testuser16' },
      { 'guid': '77787', 'username': 'testuser17' },
      { 'guid': '77788', 'username': 'testuser18' },
      { 'guid': '77789', 'username': 'testuser19' },
      { 'guid': '77790', 'username': 'testuser20' },
      { 'guid': '77791', 'username': 'testuser21' }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        Hovercard,
        GroupsMembersModuleComponent
      ],
      imports: [
        NgCommonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: HovercardService, useValue: hovercardServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(GroupsMembersModuleComponent);
    membersComponent = fixture.componentInstance;

    clientMock.response = {};
    clientMock.response[`api/v1/groups/membership/11111`] = successfulGroupResponse;

    membersComponent._group = group;
    membersComponent.linksTo = 

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  afterEach(() => {

    jasmine.clock().uninstall();
  });

  it('should have a title', () => {
    const title = fixture.debugElement.query(By.css('.m-group--members .mdl-card__title-text'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Members');
  });

  it('should link to the group members list page', () => {
    const inviteLink = fixture.debugElement.query(By.css('.m-group--members .mdl-card__title a'));
    expect(inviteLink).not.toBeNull();
    expect(inviteLink.nativeElement.textContent).toContain('Invite');
    expect(inviteLink.nativeElement.href).toContain(`groups/profile/${group.guid}/members`);
  });

  it('should fetch a list of group members', fakeAsync(() => {
    spyOn(membersComponent, 'load').and.callThrough();

    clientMock.get.calls.reset();
    membersComponent._group = group;

    fixture.detectChanges();
    tick();
    
    expect(membersComponent.load).toHaveBeenCalled();
    expect(clientMock.get).toHaveBeenCalledWith('api/v1/groups/membership/11111', { limit: 21 });

    expect(membersComponent.members).toEqual(successfulGroupResponse.members);
  }));
});
