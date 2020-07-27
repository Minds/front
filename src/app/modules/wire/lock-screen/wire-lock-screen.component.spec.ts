///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { WireLockScreenComponent } from '../lock-screen/wire-lock-screen.component';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { SignupModalService } from '../../modals/signup/service';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { signupModalServiceMock } from '../../../mocks/modules/modals/signup/signup-modal-service.mock';
import { ConfigsService } from '../../../common/services/configs.service';
import { MockService } from '../../../utils/mock';
import { WireModalService } from '../wire-modal.service';
import { of } from 'rxjs';
import { FeaturesService } from '../../../services/features.service';
import { featuresServiceMock } from '../../../../tests/features-service-mock.spec';

describe('WireLockScreenComponent', () => {
  let comp: WireLockScreenComponent;
  let fixture: ComponentFixture<WireLockScreenComponent>;
  const defaultActivity = {
    ownerObj: {
      username: 'minds',
      guid: 123,
    },
    wire_threshold: {
      type: 'tokens',
      min: 10,
    },
  };

  function setLoggedIn(loggedIn: boolean) {
    sessionMock.loggedIn = loggedIn;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialMock, WireLockScreenComponent], // declare the test component
      imports: [],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Session, useValue: sessionMock },
        {
          provide: WireModalService,
          useValue: MockService(WireModalService, {
            present: () => of({}),
          }),
        },
        { provide: SignupModalService, useValue: signupModalServiceMock },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService, {
            get: () => {
              return {
                support_tier_urn: 'plus_support_tier',
              };
            },
          }),
        },
        { provide: FeaturesService, useValue: featuresServiceMock },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    featuresServiceMock.mock('paywall-2020', false);

    fixture = TestBed.createComponent(WireLockScreenComponent);

    comp = fixture.componentInstance; // LoginForm test instance

    comp.entity = defaultActivity;

    clientMock.response = { status: 'success' };

    spyOn(comp.update, 'next').and.callThrough();

    spyOn(comp.session, 'getLoggedInUser').and.callFake(() => {
      return { guid: 456 };
    });
  });

  it('should have an unlock button', () => {
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.m-unlock-button'))
    ).not.toBeNull();
  });
  it('clicking on the unlock button should call unlock function', () => {
    spyOn(comp, 'unlock').and.callThrough();
    fixture.detectChanges();
    const button: DebugElement = fixture.debugElement.query(
      By.css('.m-unlock-button')
    );
    button.nativeElement.click();

    expect(comp.unlock).toHaveBeenCalled();
  });
  it('should have message', () => {
    fixture.detectChanges();
    const message: DebugElement = fixture.debugElement.query(
      By.css('.m-wireLockScreen__message')
    );
    expect(message).toBeDefined();
  });
  it("shouldn't update the entity if wire/threshold doesn't return an activity", fakeAsync(() => {
    comp.preview = true;
    fixture.detectChanges();
    comp.unlock();

    fixture.detectChanges();
    tick();

    expect(comp.update.next).not.toHaveBeenCalled();
  }));
  it('should update the entity if wire/threshold returns an activity', fakeAsync(() => {
    setLoggedIn(true);
    clientMock.response = { status: 'success', activity: defaultActivity };

    comp.unlock();

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toContain(
      'api/v1/wire/threshold'
    );
    expect(comp.update.next).toHaveBeenCalled();
    expect(comp.update.next['calls'].mostRecent().args[0]).toBe(
      defaultActivity
    );
  }));

  it('should open signup modal if not loggedin and the user clicks on unlock', fakeAsync(() => {
    setLoggedIn(false);

    fixture.detectChanges();

    comp.unlock();
    expect(signupModalServiceMock.open).toHaveBeenCalled();
  }));
});
