import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SettingsTwoFactorV2Service } from '../two-factor-v2.service';

/**
 * Password confirm component - force a user to verify their password before enabling or removing 2fa
 *
 * TODO: TRY USE MODAL PASSWORD FORM
 * TODO: Remove 2FA logic - may need to pass in an intent to decide what the next panel is.
 */
@Component({
  selector: 'm-twoFactor__passwordConfirm',
  template: `
    <form class="m-twoFactor_passwordConfirmationForm" [formGroup]="form">
      <label>Password</label>
      <input
        type="password"
        name="password"
        formControlName="password"
        [ngModel]="password$ | async"
        (ngModelChange)="passwordValueChanged($event)"
      />

      <m-button [color]="'blue'" (onAction)="onConfirmClick()">
        <ng-container>Confirm</ng-container>
      </m-button>
    </form>
  `,
  styleUrls: ['./confirm-password.component.ng.scss'],
})
export class SettingsTwoFactorPasswordComponent implements OnInit {
  // amount input form
  public form: FormGroup;

  // password string from user
  public password$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private service: SettingsTwoFactorV2Service) {}

  ngOnInit(): void {
    // init form group.
    this.form = new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required],
      }),
    });
  }

  /**
   * Called on confirm click.
   * @returns { void }
   */
  public onConfirmClick(): void {
    this.service.activePanel$.next('recovery-code');
  }

  /**
   * Called on password change - updates password value.
   * @param { string } $event - new password value.
   */
  passwordValueChanged($event: string) {
    this.password$.next($event);
  }
}
