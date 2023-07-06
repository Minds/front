import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Session } from '../../../../../services/session';
import { ToasterService } from '../../../../../common/services/toaster.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResetPasswordModalService } from '../../reset-password-modal.service';
import { PASSWORD_VALIDATOR } from '../../../../forms/password.validator';
import { PasswordRiskValidator } from '../../../../forms/password-risk.validator';
import { PopoverComponent } from '../../../../forms/popover-validation/popover.component';

/**
 * Allows a user to set a new password
 * without knowing their current password.
 *
 * This is the form that a user will see when they click the button
 * from their reset password email
 */
@Component({
  selector: 'm-resetPasswordModal__form--reset',
  templateUrl: './reset.component.html',
  styleUrls: ['../../reset-password-modal.component.ng.scss'],
})
export class ResetPasswordModalResetFormComponent implements OnInit, OnDestroy {
  // The username of the user who is resetting their password
  @Input() username: string;

  // The code (from the reset password email url)
  // That we'll use to make sure this user is the owner of the account
  @Input() code: string;

  // Password requirements popover
  @ViewChild('popover') popover: PopoverComponent;

  protected form: FormGroup;

  private subscriptions: Subscription[] = [];
  protected inProgress: boolean = false;

  protected passwordRiskCheckStatus: string;

  constructor(
    public session: Session,
    public toaster: ToasterService,
    private formBuilder: FormBuilder,
    protected service: ResetPasswordModalService,
    private passwordRiskValidator: PasswordRiskValidator
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.inProgress$.subscribe(inProgress => {
        this.inProgress = inProgress;
      })
    );

    this.buildForm();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  buildForm(): void {
    this.form = this.formBuilder.group(
      {
        password: [
          '',
          // sync
          [Validators.required, PASSWORD_VALIDATOR],
          // async
          [this.passwordRiskValidator.riskValidator()],
        ],
        password2: ['', [Validators.required]],
      },
      { validators: [this.passwordsMatchValidator] }
    );

    this.subscriptions.push(
      this.form.get('password').valueChanges.subscribe(str => {
        this.popover.show();
      }),

      this.form.get('password').statusChanges.subscribe((status: any) => {
        this.passwordRiskCheckStatus = status;
      })
    );
  }

  /**
   * Confirm the two passwords match each other
   */
  passwordsMatchValidator(c: AbstractControl): ValidationErrors | null {
    if (c.get('password').value !== c.get('password2').value) {
      return { passwordsMatch: true };
    }
  }

  /**
   * Reset the password with the new one
   */
  async reset(): Promise<void> {
    if (!this.canSubmit) {
      return;
    }

    this.service.reset(
      this.form.controls.password.value,
      this.username,
      this.code
    );
  }

  onPasswordFocus() {
    if (this.form.value.password.length > 0) {
      this.popover.show();
    }
  }

  onPasswordBlur() {
    this.popover.hide();
  }

  get canSubmit(): boolean {
    return !this.inProgress && this.form.valid;
  }
}
