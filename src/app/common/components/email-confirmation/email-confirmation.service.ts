import { Injectable } from '@angular/core';
import { Client } from '../../../services/api/client';

/**
 * API implementation service for Email Confirmation component
 * @see EmailConfirmationComponent
 */
@Injectable()
export class EmailConfirmationService {
  constructor(protected client: Client) {}

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
