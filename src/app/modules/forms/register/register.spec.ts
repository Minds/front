import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { forwardRef } from '@angular/core';
import { Component } from '@angular/core';

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
  password;
  riskCheckStatus;

  show = jasmine.createSpy('show');
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterForm);
    comp = fixture.componentInstance;

    (comp as any).experiments.hasVariation.and.returnValue(true);
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
      friendly_captcha_enabled: true,
    });
  });

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
});
