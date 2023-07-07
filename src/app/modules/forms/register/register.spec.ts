import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
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
import { MockService, MockComponent } from '../../../utils/mock';
import { FormInputCheckboxComponent } from '../../../common/components/forms/checkbox/checkbox.component';
import { Input, forwardRef } from '@angular/core';
import { Component } from '@angular/core';
import { OnboardingV5ExperimentService } from '../../experiments/sub-services/onboarding-v5-experiment.service';
import { OnboardingV5Service } from '../../onboarding-v5/services/onboarding-v5.service';

@Component({
  selector: 'm-friendlyCaptcha',
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
  template: `
    <ng-content></ng-content>
  `,
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
        FormInputCheckboxComponent,
        FriendlyCaptchaComponentMock,
        PopoverComponentMock,
        MockComponent({
          selector: 'm-button',
          inputs: ['disabled', 'saving'],
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
          provide: OnboardingV5ExperimentService,
          useValue: MockService(OnboardingV5ExperimentService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterForm);
    comp = fixture.componentInstance;

    (comp as any).experiments.hasVariation.and.returnValue(true);
    (comp as any).passwordInputHasFocus = true;
    (comp as any).usernameValidator.existingUsernameValidator.and.returnValue(
      () => Promise.resolve(true)
    );
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(() =>
      Promise.resolve(true)
    );
    (comp as any).onboardingV5ExperimentService.isGlobalOnSwitchActive.and.returnValue(
      false
    );
    (comp as any).onboardingV5ExperimentService.isEnrollmentActive.and.returnValue(
      false
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
  });

  it('should register successfully a new user', () => {
    (comp as any).client.post.and.returnValue(
      Promise.resolve({ user: { guid: '1234' } })
    );

    comp.form.get('username').setValue('testuser');
    comp.form.get('email').setValue('testuser@example.com');
    comp.form.get('password').setValue('TestPass123!');
    comp.form.get('password2').setValue('TestPass123!');
    comp.form.get('tos').setValue(true);
    comp.form.get('captcha').setValue('test_captcha');

    spyOn(comp.done, 'emit');

    comp.register(new MouseEvent('click'));

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
    });
  });

  it('should register successfully a new user and set onboarding state to true if experiments are on', fakeAsync(() => {
    const user = { guid: '1234' };
    (comp as any).onboardingV5ExperimentService.isGlobalOnSwitchActive.and.returnValue(
      true
    );
    (comp as any).onboardingV5ExperimentService.isEnrollmentActive.and.returnValue(
      true
    );

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
});
