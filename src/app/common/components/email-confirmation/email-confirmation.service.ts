import { Injectable } from '@angular/core';
import { Client } from '../../../services/api/client';
import { FormToastService } from '../../services/form-toast.service';
import { ConfigsService } from '../../services/configs.service';
import { Session } from '../../../services/session';

/**
 * Service handling the sending of new confirmation emails and whether a user
 * requires email confirmation at all.
 */
@Injectable({ providedIn: 'root' })
export class EmailConfirmationService {
  // whether config identifies email as unconfirmed.
  private readonly fromEmailConfirmation: boolean = false;

  constructor(
    protected client: Client,
    private toasterService: FormToastService,
    private session: Session,
    configs: ConfigsService
  ) {
    this.fromEmailConfirmation = configs.get('from_email_confirmation');
  }

  show() {
    this.toasterService.error('You must confirm your email address.');
  }

  /**
   * Attempts to re-send the confirmation email to the current logged in user
   */
  async send(): Promise<boolean> {
    const response = (await this.client.post(
      'api/v2/email/confirmation/resend',
      {}
    )) as any;

    return Boolean(response && response.sent);
  }

  /**
   * Whether logged-in user requires email confirmation.
   * @returns { boolean } true if email confirmation is required.
   */
  public requiresEmailConfirmation(): boolean {
    const user = this.session.getLoggedInUser();
    return (
      !this.fromEmailConfirmation && user && user.email_confirmed === false
    );
  }
}
