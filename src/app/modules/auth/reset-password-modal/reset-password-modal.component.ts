import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../../services/session';
import { ToasterService } from '../../../common/services/toaster.service';
import { ResetPasswordModalService } from './reset-password-modal.service';

/**
 * Container for a flow of forms that users
 * go through to reset passwords that have been forgotten
 */
@Component({
  selector: 'm-resetPasswordModal',
  templateUrl: 'reset-password-modal.component.html',
  styleUrls: ['reset-password-modal.component.ng.scss'],
})
export class ResetPasswordModalComponent {
  /**
   * Username of user who forgot their password
   */
  username: string;

  /**
   * Code from the email that was sent to that user
   * (we get it from the url of the link in the email)
   */
  code: string;

  /**
   * Completion intent
   */
  onComplete: (any) => any = () => {};

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public session: Session,
    public toaster: ToasterService,
    protected service: ResetPasswordModalService
  ) {}

  ngOnInit(): void {
    if (this.code && this.username) {
      this.service.activePanel$.next('newPassword');
    }
  }

  /**
   * Modal options
   *
   * @param username the username of the user who forgot their password
   * @param code the code that was emailed to them for verification
   * @param onComplete
   * @param onDismissIntent
   * @param defaults
   */
  setModalData({ username, code, onComplete, onDismissIntent }) {
    this.username = username;
    this.code = code;
    this.onComplete = onComplete || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }
}
