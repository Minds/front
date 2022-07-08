///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { By } from '@angular/platform-browser';

import { SignupOnActionModalMock } from '../../mocks/modules/modals/signup/signup-on-action.mock';
import { clientMock } from '../../../tests/client-mock.spec';
import { uploadMock } from '../../../tests/upload-mock.spec';

import { GroupsJoinButton } from './groups-join-button';
import { GroupsService } from './groups.service';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { loginReferrerServiceMock } from '../../mocks/services/login-referrer-service-mock.spec';
import { MockService } from '../../utils/mock';
import { ButtonComponent } from '../../common/components/button/button.component';
import { ToasterService } from '../../common/services/toaster.service';

describe('GroupsJoinButton', () => {
  let fixture: ComponentFixture<GroupsJoinButton>;
  let comp: GroupsJoinButton;

  /** Helpers */

  function setGroup(props: any) {
    comp._group = Object.assign(
      {
        guid: 1000,
        'is:banned': false,
        'is:awaiting': false,
        'is:invited': false,
        'is:member': false,
        membership: 2,
      },
      props
    );
  }

  function getJoinButtons(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('.m-groupsJoinButton__join'));
  }

  function getAcceptAndDeclineButtons(): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.css('.m-groupsJoinButton__verdict')
    );
  }

  function getLeaveButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-groupsJoinButton__leave'));
  }

  function getCancelRequestButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-groupsJoinButton__cancel'));
  }

  /** /Helpers */

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          SignupOnActionModalMock,
          GroupsJoinButton,
          ButtonComponent,
        ],
        imports: [RouterTestingModule],
        providers: [
          { provide: Session, useValue: sessionMock },
          { provide: GroupsService, useValue: MockService(GroupsService) },
          { provide: LoginReferrerService, useValue: loginReferrerServiceMock },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(GroupsJoinButton);
    comp = fixture.componentInstance;

    setGroup({});
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

  it('should render a button to join', () => {
    setGroup({
      'is:banned': false,
      'is:awaiting': false,
      'is:invited': false,
      'is:member': false,
    });
    fixture.detectChanges();

    expect(getJoinButtons().length).toBe(1);
  });

  it('should not render a button to join if banned', () => {
    setGroup({
      'is:banned': true,
      'is:awaiting': false,
      'is:invited': false,
      'is:member': false,
    });
    fixture.detectChanges();

    expect(getJoinButtons().length).toBe(0);
  });

  it('should render a button to accept or decline an invitation', () => {
    setGroup({
      'is:banned': false,
      'is:awaiting': false,
      'is:invited': true,
      'is:member': false,
    });
    fixture.detectChanges();

    expect(getAcceptAndDeclineButtons().length).toBe(2);
  });

  it('should render a button to leave', () => {
    setGroup({
      'is:banned': false,
      'is:awaiting': false,
      'is:invited': false,
      'is:member': true,
    });
    fixture.detectChanges();

    expect(getLeaveButton()).toBeTruthy();
  });

  it('should render a button to cancel join request', () => {
    setGroup({
      'is:banned': false,
      'is:awaiting': true,
      'is:invited': false,
      'is:member': false,
    });
    fixture.detectChanges();

    expect(getCancelRequestButton()).toBeTruthy();
  });

  it('should join a public group', fakeAsync(() => {
    expect(comp.inProgress).toBeFalse();
    expect(comp.group['is:member']).toBeFalse();

    (comp as any).service.join.and.returnValue(Promise.resolve(true));

    spyOn(comp.membership, 'next');

    setGroup({
      'is:banned': false,
      'is:awaiting': false,
      'is:invited': false,
      'is:member': false,
    });

    comp.join();
    expect(comp.inProgress).toBeTrue();

    tick();

    expect(comp.inProgress).toBeFalse();
    expect(comp.group['is:member']).toBeTrue();
    expect(comp.membership.next).toHaveBeenCalled();
    expect(comp.membership.next).toHaveBeenCalledWith({ member: true });
  }));

  it('should join a closed group', fakeAsync(() => {
    expect(comp.inProgress).toBeFalse();
    expect(comp.group['is:awaiting']).toBeFalse();

    (comp as any).service.join.and.returnValue(Promise.resolve(true));

    spyOn(comp.membership, 'next');

    setGroup({
      'is:banned': false,
      'is:awaiting': false,
      'is:invited': false,
      'is:member': false,
      membership: 0,
    });

    comp.join();
    expect(comp.inProgress).toBeTrue();

    tick();

    expect(comp.inProgress).toBeFalse();
    expect(comp.group['is:awaiting']).toBeTrue();
    expect(comp.membership.next).toHaveBeenCalled();
    expect(comp.membership.next).toHaveBeenCalledWith({});
  }));

  it('should join a closed group', fakeAsync(() => {
    expect(comp.inProgress).toBeFalse();
    expect(comp.group['is:awaiting']).toBeFalse();

    (comp as any).service.join.and.returnValue(Promise.resolve(true));

    spyOn(comp.membership, 'next');

    setGroup({
      'is:banned': false,
      'is:awaiting': false,
      'is:invited': false,
      'is:member': false,
      membership: 0,
    });

    comp.join();
    expect(comp.inProgress).toBeTrue();

    tick();

    expect(comp.inProgress).toBeFalse();
    expect(comp.group['is:awaiting']).toBeTrue();
    expect(comp.membership.next).toHaveBeenCalled();
    expect(comp.membership.next).toHaveBeenCalledWith({});
  }));

  it('should handle errors joining groups appropriately', fakeAsync(() => {
    const errorText = 'You are banned from this group';

    (comp as any).service.join.and.returnValue(
      Promise.reject({
        error: errorText,
      })
    );

    spyOn(comp.membership, 'next');

    setGroup({
      'is:banned': false,
      'is:awaiting': false,
      'is:invited': false,
      'is:member': false,
    });

    expect(comp.inProgress).toBeFalse();
    comp.join();
    expect(comp.inProgress).toBeTrue();

    tick();

    expect((comp as any).toast.error).toHaveBeenCalledWith(errorText);
    expect(comp.group['is:member']).toBeFalse();
    expect(comp.group['is:awaiting']).toBeFalse();
    expect(comp.membership.next).toHaveBeenCalled();
    expect(comp.membership.next).toHaveBeenCalledWith({ error: 'banned' });
    expect(comp.inProgress).toBeFalse();
  }));
});
