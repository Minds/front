import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { LoginForm } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { MockComponent, MockDirective, MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { ButtonComponent } from '../../../common/components/button/button.component';
import { MultiFactorAuthService } from '../../auth/multi-factor-auth/services/multi-factor-auth-service';
import { BehaviorSubject } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { RegexService } from '../../../common/services/regex.service';
import { Router } from '@angular/router';
import { PermissionsService } from '../../../common/services/permissions.service';
import { SiteService } from '../../../common/services/site.service';
import { AnalyticsService } from '../../../services/analytics';

export class RouterStub {
  url = '';
  navigate(commands: any[], extras?: any) {}
}

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

  let session: Session;

  function login(response, _username = 'username') {
    username.nativeElement.value = _username;
    username.nativeElement.dispatchEvent(new Event('input'));
    password.nativeElement.value = 'password';
    password.nativeElement.dispatchEvent(new Event('input'));

    clientMock.post.calls.reset();

    clientMock.response['api/v1/authenticate'] = response;

    tick();
    fixture.detectChanges();

    loginButton.nativeElement.click();
    tick();
    fixture.detectChanges();
  }

  function twoFactorLogin(response) {
    const twoFactorCode = getTwoFactorCode();
    twoFactorCode.nativeElement.value = '123123';
    twoFactorCode.nativeElement.dispatchEvent(new Event('input'));

    clientMock.post.calls.reset();

    clientMock.response['api/v1/twofactor/authenticate'] = response;

    tick();
    fixture.detectChanges();

    getTwoFactorLoginButton().nativeElement.click();

    tick();
    fixture.detectChanges();
  }

  function getTwoFactorForm() {
    return fixture.debugElement.query(By.css('.minds-login-box:last-of-type'));
  }

  function getTwoFactorCode() {
    return fixture.debugElement.query(By.css('#code'));
  }

  function getTwoFactorLoginButton() {
    return fixture.debugElement.query(By.css('.m-login-2fa > m-button button'));
  }

  const onSuccess$ = new BehaviorSubject<MindsUser>(null);

  const activePanel$ = new BehaviorSubject<string>('');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        MockComponent({
          selector: 'm-oidcLoginButtons',
          inputs: ['hasOidcProviders', 'done'],
        }),
        LoginForm,
        ButtonComponent,
      ], // declare the test component
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        {
          provide: AuthModalService,
          useValue: MockService(AuthModalService),
        },
        {
          provide: MultiFactorAuthService,
          useValue: MockService(MultiFactorAuthService, {
            has: ['onSuccess$', 'activePanel$'],
            props: {
              onSuccess$: { get: () => onSuccess$ },
              activePanel$: { get: () => activePanel$ },
            },
            setMFAReqest: (feature) => {
              return true;
            },
          }),
        },
        { provide: Router, useClass: RouterStub },
        RegexService,
        { provide: Router, useClass: RouterStub },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: SiteService,
          useValue: MockService(SiteService),
        },
        {
          provide: AnalyticsService,
          useValue: MockService(AnalyticsService),
        },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginForm);

    comp = fixture.componentInstance; // LoginForm test instance
    (comp as any).loadingOidcProviders = false;

    fixture.detectChanges();

    loginForm = fixture.debugElement.query(By.css('form.m-login-box'));
    username = fixture.debugElement.query(By.css('#username'));
    password = fixture.debugElement.query(By.css('#password'));
    loginButton = fixture.debugElement.query(
      By.css('.m-login__button--login button')
    );
    errorMessage = fixture.debugElement.query(By.css('.m-login__formError'));

    session = comp.session;

    clientMock.response = [];
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

  it("should have 'migrate from facebook' button", () => {
    expect(
      fixture.debugElement.query(By.css('.m-fb-login-button button'))
    ).toBeDefined();
  });

  it('error message should be hidden by default', () => {
    expect(errorMessage.nativeElement.hidden).toBeTruthy();
  });

  it('should spawn error message on incorrect credentials', fakeAsync(() => {
    login({
      status: 'error',
      error: {
        status: 'failed',
        message: 'FAIL',
      },
    });

    tick();
    fixture.detectChanges();

    expect(errorMessage.nativeElement.hidden).toBeFalsy();
  }));

  it('should authenticate on correct credentials', fakeAsync(() => {
    spyOn(comp, 'login').and.callThrough();
    login({
      status: 'success',
      user: {
        guid: '714452562123689992',
        type: 'user',
        subtype: false,
        time_created: '1495714764',
        time_updated: false,
        container_guid: '0',
        owner_guid: '0',
        site_guid: false,
        access_id: '2',
        name: 'minds',
        username: 'minds',
        language: 'en',
        icontime: '1496687850',
        legacy_guid: false,
        featured_id: false,
        banned: 'no',
        website: false,
        briefdescription: false,
        dob: false,
        gender: false,
        city: false,
        merchant: false,
        boostProPlus: false,
        fb: false,
        mature: 0,
        monetized: false,
        signup_method: false,
        social_profiles: [],
        feature_flags: false,
        chat: true,
        subscribed: false,
        subscriber: false,
        subscriptions_count: 1,
        impressions: 0,
        boost_rating: '2',
      },
    });
    expect(comp.login).toHaveBeenCalled();
  }));

  it("should've called api/v1/authenticate with correct arguments", fakeAsync(() => {
    login({
      status: 'success',
      user: {
        guid: '714452562123689992',
        type: 'user',
        subtype: false,
        time_created: '1495714764',
        time_updated: false,
        container_guid: '0',
        owner_guid: '0',
        site_guid: false,
        access_id: '2',
        name: 'minds',
        username: 'minds',
        language: 'en',
        icontime: '1496687850',
        legacy_guid: false,
        featured_id: false,
        banned: 'no',
        website: false,
        briefdescription: false,
        dob: false,
        gender: false,
        city: false,
        merchant: false,
        boostProPlus: false,
        fb: false,
        mature: 0,
        monetized: false,
        signup_method: false,
        social_profiles: [],
        feature_flags: false,
        chat: true,
        subscribed: false,
        subscriber: false,
        subscriptions_count: 1,
        impressions: 0,
        boost_rating: '2',
      },
    });
    const calls = clientMock.post['calls'];
    expect(calls.count()).toEqual(1);
    expect(calls.mostRecent().args[0]).toEqual('api/v1/authenticate');
    expect(calls.mostRecent().args[1]).toEqual({
      username: 'username',
      password: 'password',
    });
  }));

  it('should spawn error message when an email is entered as a username', fakeAsync(() => {
    username.nativeElement.value = 'test@minds.com';
    login({ status: 'error' }, 'test@minds.com');
    expect(comp.usernameError).toBe('LoginException::EmailAddress');
  }));

  it('should emit done and navigate on forgot password click', () => {
    spyOn(comp.done, 'emit');
    comp.onForgotPasswordClick();
    expect(comp.done.emit).toHaveBeenCalledWith(true);
  });

  describe('loading state / oidc buttons', () => {
    it('should set hasOidcProviders', () => {
      comp.setHasOidcProviders(true);
      expect(comp.hasOidcProviders).toBeTruthy();
      expect(comp.hideLogin).toBeTrue();
      expect((comp as any).loadingOidcProviders).toBeFalse();
    });

    it('should set hasOidcProviders to false', () => {
      comp.setHasOidcProviders(false);
      expect(comp.hasOidcProviders).toBeFalsy();
      expect(comp.hideLogin).toBeFalse();
      expect((comp as any).loadingOidcProviders).toBeFalse();
    });
  });
});
