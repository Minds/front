import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SettingsV2Service } from '../../../../modules/settings-v2/settings-v2.service';
import { Session } from '../../../../services/session';
import { EmailResendService } from '../../../services/email-resend.service';

// different panels of modal.
export type EmailConfirmationPanel = 'code' | 'change-email';

// email address.
export type EmailAddress = string;

/**
 * Service holding common variables and functions for email confirmation modal.
 */
@Injectable({ providedIn: 'root' })
export class EmailConfirmationModalService {
  // initial loading state.
  public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  // members email - can be changed.
  public readonly email$: BehaviorSubject<EmailAddress> = new BehaviorSubject<
    EmailAddress
  >(null);

  // currently active panel.
  public readonly activePanel$: BehaviorSubject<
    EmailConfirmationPanel
  > = new BehaviorSubject<EmailConfirmationPanel>('code');

  constructor(
    private settings: SettingsV2Service,
    private session: Session,
    private emailResend: EmailResendService
  ) {
    this.setInitialEmail();
  }

  /**
   * Sets the email initially on load. First loads settings, then
   * updates class variable email$ - once complete initial load is done and
   * component can be shown.
   * @returns { Promise<void> }
   */
  public async setInitialEmail(): Promise<void> {
    this.loading$.next(true);
    await this.settings.loadSettings(this.session.getLoggedInUser().guid);
    this.email$.next(this.settings.settings.email);
    this.loading$.next(false);
  }

  /**
   * Change the users email. If it is NOT different from the current email
   * No changes are made. Will attempt to resend after changing - if this fails,
   * for example, because the user has sent too many emails in a short timespan,
   * Will stay on this panel, such that a user has to wait to re-request and resend the email.
   * @param newEmail
   * @returns
   */
  public async changeEmail(newEmail: string = null): Promise<void> {
    if (newEmail && newEmail !== this.email$.getValue()) {
      await this.settings.updateSettings(this.session.getLoggedInUser().guid, {
        email: newEmail,
      });

      const success = await this.emailResend.send();

      if (!success) {
        return;
      }

      this.email$.next(newEmail);
    }
    this.activePanel$.next('code');
  }
}
