import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement, NgZone } from '@angular/core';

import { RegisterForm } from './register';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { ReCaptchaComponentMock } from '../../../../tests/re-captcha-mock.spec';

describe('RegisterForm', () => {

  let comp: RegisterForm;
  let fixture: ComponentFixture<RegisterForm>;
  let session: Session;

  function getSignUpWithFacebook(): DebugElement {
    return fixture.debugElement.query(By.css('button.m-fb-register-button'));
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MaterialMock, ReCaptchaComponentMock, RegisterForm], // declare the test component
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Client, useValue: clientMock },
        // { provide: NgZone, useValue: NgZoneMock },
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    clientMock.response = {};

    fixture = TestBed.createComponent(RegisterForm);

    comp = fixture.componentInstance; // RegisterForm test instance

    fixture.detectChanges();

    session = comp.session;

    window.Minds.site_url = 'http://dev.minds.io/';

    spyOn(comp.zone, 'run').and.callFake((fn: Function) => {
      fn();
    });

    // so the actual login function doesn't get called
    spyOn(window, 'open').and.callFake(() => {
      console.log('window.open() called');
      return;
    });
  });
  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('clicking on signup with facebook button should call window.open', () => {
    getSignUpWithFacebook().nativeElement.click();

    fixture.detectChanges();

    expect(window.open).toHaveBeenCalled();

    const call = (<any>window.open).calls.mostRecent();
    expect(call.args.length).toBe(3);
    expect(call.args[0]).toBe('http://dev.minds.io/api/v1/thirdpartynetworks/facebook/login');
    expect(call.args[1]).toBe('Login with Facebook');
    expect(call.args[2]).toBe('toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no, width=800, height=600, top=100, left=100');
  });

  it('successful response from the modal should show fb register form', () => {
    comp.showFbForm = true;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('form.m-fb-form'))).not.toBeNull();
  });

  it('successful response from the modal should show fb register form', () => {
    comp.showFbForm = true;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('form.m-fb-form'))).not.toBeNull();
  });

  it('fb form should have username field', () => {
    comp.showFbForm = true;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('form.m-fb-form input#fb-username'))).not.toBeNull();
  });

  it('fb form should have password field', () => {
    comp.showFbForm = true;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('form.m-fb-form input#fb-password'))).not.toBeNull();
  });

  it('fb form should have password field', () => {
    comp.showFbForm = true;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('form.m-fb-form input#fb-password'))).not.toBeNull();
  });

  it('fb form should have a repeat password field', () => {
    comp.showFbForm = true;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('form.m-fb-form input#fb-password2'))).not.toBeNull();
  });

  it('fb form should have a signup with facebook button', () => {
    comp.showFbForm = true;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('form.m-fb-form button.m-fb-register-button'))).not.toBeNull();
  });

  it('signup with facebook button should call api/v1/thirdpartynetworks/facebook/register', () => {
    comp.showFbForm = true;

    fixture.detectChanges();

    clientMock.response['api/v1/thirdpartynetworks/facebook/register'] = {
      "guid": "732337264197111809",
      "type": "user",
      "username": "mindstest",
    };

    fixture.debugElement.query(By.css('form.m-fb-form button.m-fb-register-button')).nativeElement.click();

    fixture.detectChanges();

    expect(clientMock.post).toHaveBeenCalled();
  });
});
