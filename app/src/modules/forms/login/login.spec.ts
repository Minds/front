import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { LoginForm } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';

describe('LoginForm', () => {

  let comp: LoginForm;
  let fixture: ComponentFixture<LoginForm>;
  let de: DebugElement;
  let el: HTMLElement;
  let loginForm: DebugElement;
  let username: DebugElement;
  let password: DebugElement;
  let loginButton: DebugElement;
  let errorMessage: DebugElement;

  let twoFactorForm: DebugElement;
  let twoFactorCode: DebugElement;
  let twoFactorLoginButton: DebugElement;
  let session: Session;

  function login(response) {
    username.nativeElement.value = 'username';
    username.nativeElement.dispatchEvent(new Event('input'));
    password.nativeElement.value = 'password';
    password.nativeElement.dispatchEvent(new Event('input'));

    clientMock.post.calls.reset();

    clientMock.response = response;

    tick();
    fixture.detectChanges();

    loginButton.nativeElement.click();
    tick();
    fixture.detectChanges();
  }
  function twoFactorLogin(response) {
    twoFactorCode.nativeElement.value = '123123';
    twoFactorCode.nativeElement.dispatchEvent(new Event('input'));

    clientMock.post.calls.reset();

    clientMock.response = response;

    tick();
    fixture.detectChanges();

    twoFactorLoginButton.nativeElement.click();

    tick();
    fixture.detectChanges();
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MaterialMock, LoginForm], // declare the test component
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Client, useValue: clientMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginForm);

    comp = fixture.componentInstance; // LoginForm test instance

    fixture.detectChanges();

    loginForm = fixture.debugElement.query(By.css('form.m-login-box'));
    username = fixture.debugElement.query(By.css('#username'));
    password = fixture.debugElement.query(By.css('#password'));
    loginButton = fixture.debugElement.query(By.css('.mdl-card__actions > .mdl-button'));
    errorMessage = fixture.debugElement.query(By.css('.m-error-box'));
    twoFactorForm = fixture.debugElement.query(By.css('.minds-login-box:last-of-type'));
    twoFactorCode = fixture.debugElement.query(By.css('#code'));
    twoFactorLoginButton = fixture.debugElement.query(By.css('.mdl-card > button'));

    session = comp.session;

    // so the actual login function doesn't get called
    spyOn(session, 'login').and.callFake(() => {
      return;
    });
  });

  it('should have username input field', () => {
    expect(username).toBeDefined();
  });

  it('should have password input field', () => {
    expect(password).toBeDefined();
  });

  it('should have login button', () => {
    expect(loginButton).toBeDefined();
  });

  it('should have \'forgot password\' link', () => {
    expect(fixture.debugElement.query(By.css('.m-reset-password-link'))).toBeDefined();
  });

  it('should have \'migrate from facebook\' button', () => {
    expect(fixture.debugElement.query(By.css('.m-fb-login-button'))).toBeDefined();
  });

  it('error message should be hidden by default', () => {
    expect(errorMessage.nativeElement.hidden).toBeTruthy();
  });

  it('should spawn error message on incorrect credentials', fakeAsync(() => {
    login({ 'status': 'failed' });

    tick();
    fixture.detectChanges();

    expect(errorMessage.nativeElement.hidden).toBeFalsy();
  }));

  it('should authenticate on correct credentials', fakeAsync(() => {
    spyOn(comp, 'login').and.callThrough();
    login({
      'status': 'success',
      'user': {
        'guid': '714452562123689992',
        'type': 'user',
        'subtype': false,
        'time_created': '1495714764',
        'time_updated': false,
        'container_guid': '0',
        'owner_guid': '0',
        'site_guid': false,
        'access_id': '2',
        'name': 'minds',
        'username': 'minds',
        'language': 'en',
        'icontime': '1496687850',
        'legacy_guid': false,
        'featured_id': false,
        'banned': 'no',
        'website': false,
        'briefdescription': false,
        'dob': false,
        'gender': false,
        'city': false,
        'merchant': false,
        'boostProPlus': false,
        'fb': false,
        'mature': 0,
        'monetized': false,
        'signup_method': false,
        'social_profiles': [],
        'feature_flags': false,
        'chat': true,
        'subscribed': false,
        'subscriber': false,
        'subscriptions_count': 1,
        'impressions': 0,
        'boost_rating': '2'
      }
    });
    expect(comp.login).toHaveBeenCalled();
  }));

  it('should\'ve called api/v1/authenticate with correct arguments', () => {
    const calls = clientMock.post['calls'];
    expect(calls.count()).toEqual(1);
    expect(calls.mostRecent().args[0]).toEqual('api/v1/authenticate');
    expect(calls.mostRecent().args[1]).toEqual({ 'username': 'username', 'password': 'password' });
  });

  it('login form should hide and two-factor form should appear', fakeAsync(() => {
    login({ 'status': 'error', 'code': '403', 'message': 'imaprettymessage' });

    expect(loginForm.nativeElement.hidden).toBeTruthy();
    expect(twoFactorForm.nativeElement.hidden).toBeFalsy();
  }));
  it('should spawn error message when incorrect code is written', fakeAsync(() => {
    login({ 'status': 'error', 'code': '403', 'message': 'imaprettymessage' });

    twoFactorLogin({ 'status': 'error', 'message': 'Could not verify.' });

    expect(errorMessage.nativeElement.hidden).toBeFalsy();
  }));

  it('should login successfully', fakeAsync(() => {
    login({ 'status': 'error', 'code': '403', 'message': 'imaprettymessage' });

    session.login['calls'].reset();

    twoFactorLogin({
      'status': 'success',
      'user': {
        'guid': '726889378877546822',
        'type': 'user',
        'subtype': false,
        'time_created': '1498679876',
        'time_updated': false,
        'container_guid': '0',
        'owner_guid': '0',
        'site_guid': false,
        'access_id': '2',
        'name': 'name',
        'username': 'username',
        'language': 'en',
        'icontime': false,
        'legacy_guid': false,
        'featured_id': false,
        'banned': 'no',
        'website': false,
        'briefdescription': false,
        'dob': false,
        'gender': false,
        'city': false,
        'merchant': false,
        'boostProPlus': false,
        'fb': false,
        'mature': 0,
        'monetized': false,
        'signup_method': false,
        'social_profiles': [],
        'feature_flags': false,
        'subscribed': false,
        'subscriber': false,
        'subscribers_count': 3,
        'subscriptions_count': 1,
        'impressions': 0,
        'boost_rating': '2'
      }
    });

    expect(session.login).toHaveBeenCalled();
  }));

});
