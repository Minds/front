import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { RouterHistoryService } from '../../../common/services/router-history.service';
import { ExperimentsService } from '../../experiments/experiments.service';
import { UsernameValidator } from '../username.validator';
import { PasswordRiskValidator } from '../password-risk.validator';
import { AnalyticsService } from './../../../services/analytics';
import { RegisterForm } from './register';
import { MockComponent, MockDirective, MockService } from '../../../utils/mock';
import { Component, forwardRef, Input } from '@angular/core';
import { OnboardingV5Service } from '../../onboarding-v5/services/onboarding-v5.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { SiteService } from '../../../common/services/site.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { IfTenantDirective } from '../../../common/directives/if-tenant.directive';
import { By } from '@angular/platform-browser';
import { UserAvatarService } from '../../../common/services/user-avatar.service';
import userMock from '../../../mocks/responses/user.mock';

@Component({
  selector: 'm-captcha',
  template: `
    <input ([ngModel])="(value)" (ngModelChange)="onChange($event)" />
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FriendlyCaptchaComponentMock),
      multi: true,
    },
  ],
})
class FriendlyCaptchaComponentMock implements ControlValueAccessor {
  value: any;
  onChange: (value: any) => void;
  onTouched: () => void;

  constructor() {}

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  reset(): void {}
}

@Component({
  selector: 'm-popover',
  template: ` <ng-content></ng-content> `,
})
class PopoverComponentMock {
  @Input() password;
  @Input() riskCheckStatus;

  public show = jasmine.createSpy('show');
  public hide = jasmine.createSpy('hide');
  public hideWithDelay = jasmine.createSpy('hideWithDelay');
}

describe('RegisterForm', () => {
  let comp: RegisterForm;
  let fixture: ComponentFixture<RegisterForm>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [
        RegisterForm,
        FriendlyCaptchaComponentMock,
        PopoverComponentMock,
        IfTenantDirective,
        MockComponent({
          selector: 'm-button',
          inputs: ['disabled', 'saving', 'solid'],
        }),
        MockComponent({
          selector: 'm-oidcLoginButtons',
          outputs: ['done', 'hasOidcProviders'],
        }),
        MockComponent({
          selector: 'm-formInput__checkbox',
          template: `<ng-content></ng-content>`,
          providers: [
            {
              provide: NG_VALUE_ACCESSOR,
              useValue: {
                writeValue: () => {},
                registerOnChange: () => {},
                registerOnTouched: () => {},
              },
              multi: true,
            },
          ],
        }),
        MockDirective({
          selector: '[mIfTenant]',
        }),
      ],
      providers: [
        { provide: Client, useValue: MockService(Client) },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: RouterHistoryService,
          useValue: MockService(RouterHistoryService),
        },
        {
          provide: UsernameValidator,
          useValue: MockService(UsernameValidator),
        },
        {
          provide: PasswordRiskValidator,
          useValue: MockService(PasswordRiskValidator),
        },
        { provide: AnalyticsService, useValue: MockService(AnalyticsService) },
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: SiteService,
          useValue: MockService(SiteService),
        },
        {
          provide: IsTenantService,
          useValue: MockService(IsTenantService),
        },
        {
          // used by mIfTenant directive.
          provide: IsTenantService,
          useValue: MockService(IsTenantService),
        },
        {
          provide: UserAvatarService,
          useValue: MockService(UserAvatarService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterForm);
    comp = fixture.componentInstance;

    (comp as any).loadingOidcProviders = false;
    (comp as any).experiments.hasVariation.and.returnValue(true);
    (comp as any).passwordInputHasFocus = true;
    (comp as any).usernameValidator.existingUsernameValidator.and.returnValue(
      () => Promise.resolve(true)
    );
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(() =>
      Promise.resolve(true)
    );

    fixture.detectChanges();

    (comp as any).popover.hideWithDelay = jasmine.createSpy('hideWithDelay');
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should have the correct form controls', () => {
    expect(comp.form.contains('username')).toBeTruthy();
    expect(comp.form.contains('email')).toBeTruthy();
    expect(comp.form.contains('password')).toBeTruthy();
    expect(comp.form.contains('password2')).toBeTruthy();
    expect(comp.form.contains('tos')).toBeTruthy();
    expect(comp.form.contains('exclusive_promotions')).toBeTruthy();
    expect(comp.form.contains('captcha')).toBeTruthy();
    expect(comp.form.contains('previousUrl')).toBeTruthy();
    expect(comp.form.contains('policies')).toBeTruthy();
  });

  it('should register successfully a new user', fakeAsync(() => {
    (comp as any).client.post.and.returnValue(
      Promise.resolve({ user: userMock })
    );

    comp.form.get('username').setValue('testuser');
    comp.form.get('email').setValue('testuser@example.com');
    comp.form.get('password').setValue('TestPass123!');
    comp.form.get('password2').setValue('TestPass123!');
    comp.form.get('tos').setValue(true);
    comp.form.get('captcha').setValue('test_captcha');

    spyOn(comp.done, 'emit');

    comp.register(new MouseEvent('click'));
    tick();

    expect((comp as any).client.post).toHaveBeenCalledWith('api/v1/register', {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'TestPass123!',
      password2: 'TestPass123!',
      tos: true,
      exclusive_promotions: true,
      captcha: 'test_captcha',
      previousUrl: null,
      referrer: undefined,
      parentId: '',
      policies: false,
      invite_token: undefined,
    });

    expect((comp as any).session.login).toHaveBeenCalledWith(userMock);
    expect((comp as any).userAvatarService.init).toHaveBeenCalled();
    flush();
    discardPeriodicTasks();
  }));

  it('should register successfully a new user and set onboarding state to true', fakeAsync(() => {
    const user = { guid: '1234' };

    (comp as any).client.post.and.returnValue(Promise.resolve({ user: user }));

    comp.form.get('username').setValue('testuser');
    comp.form.get('email').setValue('testuser@example.com');
    comp.form.get('password').setValue('TestPass123!');
    comp.form.get('password2').setValue('TestPass123!');
    comp.form.get('tos').setValue(true);
    comp.form.get('captcha').setValue('test_captcha');

    spyOn(comp.done, 'emit');

    comp.register(new MouseEvent('click'));

    tick();
    expect((comp as any).client.post).toHaveBeenCalledWith('api/v1/register', {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'TestPass123!',
      password2: 'TestPass123!',
      tos: true,
      exclusive_promotions: true,
      captcha: 'test_captcha',
      previousUrl: null,
      referrer: undefined,
      parentId: '',
      policies: false,
      invite_token: undefined,
    });
    discardPeriodicTasks();
    flush();
    expect(
      (comp as any).onboardingV5Service.setOnboardingCompletedState
    ).toHaveBeenCalledWith(false, user);
  }));

  it('should display an error message when the form is invalid', () => {
    comp.form.patchValue({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'TestPass123!',
      password2: 'TestPass123!',
      tos: false,
      captcha: 'test_captcha',
    });

    comp.register(new MouseEvent('click'));

    expect(comp.errorMessage).toEqual(
      'To create an account you need to accept terms and conditions.'
    );
  });

  it('should display an error message when the passwords do not match', () => {
    comp.form.patchValue({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'TestPass123!',
      password2: 'TestPass456!',
      tos: true,
      captcha: 'test_captcha',
    });

    comp.register(new MouseEvent('click'));

    expect(comp.errorMessage).toEqual('Passwords must match.');
  });

  it('should show popover on password change when length > 1 and password input has focus', fakeAsync(() => {
    (comp as any).passwordInputHasFocus = true;
    comp.form.patchValue({
      password: 'TestPass123!',
    });

    tick(400);

    expect(comp.popover.hide).not.toHaveBeenCalled();
    expect(comp.popover.show).toHaveBeenCalled();
  }));

  it('should NOT show popover on password change when password input does NOT have focus', fakeAsync(() => {
    (comp as any).passwordInputHasFocus = false;
    comp.form.patchValue({
      password: 'TestPass123!',
    });

    tick(400);

    expect(comp.popover.hide).not.toHaveBeenCalled();
    expect(comp.popover.show).not.toHaveBeenCalled();
  }));

  it('should NOT show popover on password change when password is empty and should hide', fakeAsync(() => {
    (comp as any).passwordInputHasFocus = true;
    comp.form.patchValue({
      password: '',
    });

    tick(400);

    expect(comp.popover.hide).toHaveBeenCalled();
    expect(comp.popover.show).not.toHaveBeenCalled();
  }));

  it('should hide with delay on password check status change VALID', fakeAsync(() => {
    (comp as any).passwordInputHasFocus = true;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(
      Promise.resolve(true)
    );
    comp.form.get('password').setValue('ValidPw1!');

    tick(400);

    expect(comp.popover.hideWithDelay).toHaveBeenCalled();
    flush();
  }));

  it('should NOT hide with delay on password check status change INVALID', fakeAsync(() => {
    (comp as any).passwordInputHasFocus = true;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(
      Promise.resolve(true)
    );
    comp.form.get('password').setValue('ValidPw1');

    tick(400);

    expect(comp.popover.hideWithDelay).not.toHaveBeenCalled();
    flush();
  }));

  it('should set focus state but NOT show popover on password focus function call when password is valid', () => {
    (comp as any).passwordInputHasFocus = false;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(
      Promise.resolve(true)
    );
    comp.form.get('password').setValue('ValidPw1@');
    comp.passwordRiskCheckStatus = 'VALID';

    comp.onPasswordFocus();

    expect((comp as any).passwordInputHasFocus).toBeTrue();
    expect(comp.popover.show).not.toHaveBeenCalled();
  });

  it('should set focus state but NOT show popover on password focus function call when password is empty', () => {
    (comp as any).passwordInputHasFocus = false;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(
      Promise.resolve(true)
    );
    comp.form.get('password').setValue('');
    comp.passwordRiskCheckStatus = 'INVALID';

    comp.onPasswordFocus();

    expect((comp as any).passwordInputHasFocus).toBeTrue();
    expect(comp.popover.show).not.toHaveBeenCalled();
  });

  it('should set focus state and show popover on password focus function call when password is NOT valid and has password', () => {
    (comp as any).passwordInputHasFocus = false;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(
      Promise.resolve(true)
    );
    comp.form.get('password').setValue('ValidPw1@');
    comp.passwordRiskCheckStatus = 'INVALID';

    comp.onPasswordFocus();

    expect((comp as any).passwordInputHasFocus).toBeTrue();
    expect(comp.popover.show).toHaveBeenCalled();
  });

  it('should set focus state to false and hide on password blur function call', () => {
    (comp as any).passwordInputHasFocus = true;
    comp.onPasswordBlur();

    expect((comp as any).passwordInputHasFocus).toBeFalse();
    expect(comp.popover.hide).toHaveBeenCalled();
  });

  it('should emit doneLogin when oidc login is done', () => {
    comp.doneLogin.emit = jasmine.createSpy();
    const oidcLoginButtons = fixture.debugElement.query(
      By.css('m-oidcLoginButtons')
    );

    oidcLoginButtons.componentInstance.done.emit();

    expect(comp.doneLogin.emit).toHaveBeenCalled();
  });

  describe('loading state / oidc buttons', () => {
    it('should set hasOidcProviders', () => {
      comp.setHasOidcProviders(true);
      expect(comp.hideLogin).toBeTrue();
      expect((comp as any).loadingOidcProviders).toBeFalse();
    });

    it('should set hasOidcProviders to false', () => {
      comp.setHasOidcProviders(false);
      expect(comp.hideLogin).toBeFalse();
      expect((comp as any).loadingOidcProviders).toBeFalse();
    });
  });
});
