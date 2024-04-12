import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, Input } from '@angular/core';
import { Component } from '@angular/core';
import { SettingsV2Service } from '../../settings-v2.service';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { SettingsV2PasswordComponent } from './password.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { PasswordRiskValidator } from '../../../forms/password-risk.validator';
import { Router } from '@angular/router';
import userMock from '../../../../mocks/responses/user.mock';

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

describe('SettingsV2PasswordComponent', () => {
  let comp: SettingsV2PasswordComponent;
  let fixture: ComponentFixture<SettingsV2PasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        SettingsV2PasswordComponent,
        PopoverComponentMock,
        MockComponent({
          selector: 'm-button',
          inputs: ['disabled', 'saving'],
        }),
      ],
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: SettingsV2Service,
          useValue: MockService(SettingsV2Service),
        },
        { provide: DialogService, useValue: MockService(DialogService) },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: PasswordRiskValidator,
          useValue: MockService(PasswordRiskValidator),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsV2PasswordComponent);
    comp = fixture.componentInstance;

    (comp as any).newPasswordInputHasFocus = true;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(() =>
      Promise.resolve(true)
    );
    comp.user = userMock;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should have the correct form controls', () => {
    expect(comp.form.contains('password')).toBeTruthy();
    expect(comp.form.contains('newPassword')).toBeTruthy();
    expect(comp.form.contains('confirmNewPassword')).toBeTruthy();
  });

  it('should show popover on password change when length > 1 and password input has focus', fakeAsync(() => {
    (comp as any).newPasswordInputHasFocus = true;
    comp.form.patchValue({
      newPassword: 'TestPass123!',
    });

    tick(400);

    expect(comp.popover.hide).not.toHaveBeenCalled();
    expect(comp.popover.show).toHaveBeenCalled();
  }));

  it('should NOT show popover on password change when password input does NOT have focus', fakeAsync(() => {
    (comp as any).newPasswordInputHasFocus = false;
    comp.form.patchValue({
      newPassword: 'TestPass123!',
    });

    tick(400);

    expect(comp.popover.hide).not.toHaveBeenCalled();
    expect(comp.popover.show).not.toHaveBeenCalled();
  }));

  it('should NOT show popover on password change when password is empty and should hide', fakeAsync(() => {
    (comp as any).newPasswordInputHasFocus = true;
    comp.form.patchValue({
      newPassword: '',
    });

    tick(400);

    expect(comp.popover.hide).toHaveBeenCalled();
    expect(comp.popover.show).not.toHaveBeenCalled();
  }));

  it('should hide with delay on password check status change VALID', fakeAsync(() => {
    (comp as any).newPasswordInputHasFocus = true;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(
      Promise.resolve(true)
    );
    comp.form.get('newPassword').setValue('ValidPw1!');

    tick(400);

    expect(comp.popover.hideWithDelay).toHaveBeenCalled();
    flush();
  }));

  it('should NOT hide with delay on password check status change INVALID', fakeAsync(() => {
    (comp as any).newPasswordInputHasFocus = true;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(
      Promise.resolve(true)
    );
    comp.form.get('newPassword').setValue('ValidPw1');

    tick(400);

    expect(comp.popover.hideWithDelay).not.toHaveBeenCalled();
    flush();
  }));

  it('should set focus state but NOT show popover on password focus function call when password is valid', () => {
    (comp as any).newPasswordInputHasFocus = false;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(
      Promise.resolve(true)
    );
    comp.form.get('newPassword').setValue('ValidPw1@');
    comp.newPasswordRiskCheckStatus = 'VALID';

    comp.onNewPasswordFocus();

    expect((comp as any).newPasswordInputHasFocus).toBeTrue();
    expect(comp.popover.show).not.toHaveBeenCalled();
  });

  it('should set focus state but NOT show popover on password focus function call when password is empty', () => {
    (comp as any).newPasswordInputHasFocus = false;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(
      Promise.resolve(true)
    );
    comp.form.get('newPassword').setValue('');
    comp.newPasswordRiskCheckStatus = 'INVALID';

    comp.onNewPasswordFocus();

    expect((comp as any).newPasswordInputHasFocus).toBeTrue();
    expect(comp.popover.show).not.toHaveBeenCalled();
  });

  it('should set focus state and show popover on password focus function call when password is NOT valid and has password', () => {
    (comp as any).newPasswordInputHasFocus = false;
    (comp as any).passwordRiskValidator.riskValidator.and.returnValue(
      Promise.resolve(true)
    );
    comp.form.get('newPassword').setValue('ValidPw1@');
    comp.newPasswordRiskCheckStatus = 'INVALID';

    comp.onNewPasswordFocus();

    expect((comp as any).newPasswordInputHasFocus).toBeTrue();
    expect(comp.popover.show).toHaveBeenCalled();
  });

  it('should set focus state to false and hide on password blur function call', () => {
    (comp as any).newPasswordInputHasFocus = true;
    comp.onNewPasswordBlur();

    expect((comp as any).newPasswordInputHasFocus).toBeFalse();
    expect(comp.popover.hide).toHaveBeenCalled();
  });
});
