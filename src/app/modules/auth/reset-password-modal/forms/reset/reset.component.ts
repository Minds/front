import { Component, Input } from '@angular/core';
import { Client } from '../../../../../services/api';
import { Router } from '@angular/router';
import { Session } from '../../../../../services/session';
import { ToasterService } from '../../../../../common/services/toaster.service';

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
  styleUrls: ['./reset.component.scss'],
})
export class ResetPasswordModalResetFormComponent {
  // The username of the user who is resetting their password
  @Input() username: string;

  // The code (from the reset password email url)
  // That we'll use to make sure this user is the owner of the account
  @Input() code: string;

  inProgress: boolean;

  constructor(
    public client: Client,
    public session: Session,
    public toaster: ToasterService
  ) {}

  reset(password) {
    if (!this.inProgress) {
      this.inProgress = true;
      this.client
        .post('api/v1/forgotpassword/reset', {
          password: password.value,
          code: this.code,
          username: this.username,
        })
        .then((response: any) => {
          this.inProgress = false;
          this.session.login(response.user);
          // ojm go to newsfeed?
        })
        .catch(e => {
          this.inProgress = false;
          this.toaster.error(e.message);
        });
    }
  }
}
