import { Injectable } from '@angular/core';
import { Client } from '../../../services/api/client';
import { EmailConfirmationComponent } from './email-confirmation.component';

/**
 * API implementation service for Email Confirmation component
 * @see EmailConfirmationComponent
 */
@Injectable({ providedIn: 'root' })
export class EmailConfirmationService {
  private container: EmailConfirmationComponent;

  setContainer(container: EmailConfirmationComponent) {
    this.container = container;
  }

  constructor(protected client: Client) {}

  show() {
    this.container.show();
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
}
