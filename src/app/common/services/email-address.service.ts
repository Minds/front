import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Session } from '../../services/session';

/** Response from the email address endpoint. */
type EmailSettingsResponse = { status: string; email: string };

@Injectable({ providedIn: 'root' })
export class EmailAddressService {
  constructor(
    private api: ApiService,
    private session: Session
  ) {}

  /**
   * Fetches the email address of the logged in user from the server.
   * @returns { Promise<void> } The email address of the logged in user.
   */
  public async getEmailAddress(): Promise<string> {
    if (!this.session.isLoggedIn()) {
      console.warn('User is not logged in');
      return null;
    }

    try {
      const response: EmailSettingsResponse = await lastValueFrom(
        this.api.get<EmailSettingsResponse>('/api/v3/email/address')
      );

      if (response.status !== 'success') {
        throw new Error('Failed to fetch email address');
      }

      return response.email;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
