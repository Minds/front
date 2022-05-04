import { Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmailResendService } from '../../../../services/email-resend.service';
import {
  EmailAddress,
  EmailConfirmationModalService,
} from '../email-confirmation-modal.service';

/**
 * Email confirmation panel for inputting a code sent via email
 * and submitting it, for new members to confirm their email.
 */
@Component({
  selector: 'm-emailConfirmation__codePanel',
  templateUrl: 'email-confirmation-code-panel.component.html',
  styleUrls: ['../email-confirmation-modal.component.ng.scss'],
})
export class EmailConfirmationCodePanelComponent {
  /**
   * Fires on success.
   */
  @Output() onSuccess: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor(
    public service: EmailConfirmationModalService,
    public emailResend: EmailResendService
  ) {}

  // Subject of the members email, from the shared service.
  public readonly email$: BehaviorSubject<EmailAddress> = this.service.email$;

  /**
   * Triggered on verify button click. Will fire off request to validate
   * a code and dismiss the modal.
   * @returns { void }
   */
  public onVerifyClick(): void {
    // TODO: Implement when backend is ready.
    alert('CLICK');
    this.onSuccess.emit(true);
  }

  /**
   * Triggered when change email is clicked. Switches
   * panels to allow the member to change their email address.
   * @returns { void }
   */
  public onEmailChangeClick(): void {
    this.service.activePanel$.next('change-email');
  }

  /**
   * Triggered on email resend click. Resends an email or
   * will show a toast if the user hasn't waited long enough
   * between resend requests.
   * @returns { void }
   */
  public onEmailResendClick(): void {
    this.emailResend.send();
  }
}
