import { Injectable } from '@angular/core';
import { Client } from '../../../services/api/client';
import { FormToastService } from '../../services/form-toast.service';

/**
 * API implementation service for Email Confirmation component
 * @see EmailConfirmationComponent
 */
@Injectable({ providedIn: 'root' })
export class EmailConfirmationService {
  constructor(
    protected client: Client,
    private toasterService: FormToastService
  ) {}

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
}
