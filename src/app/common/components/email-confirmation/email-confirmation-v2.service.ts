import { Injectable } from '@angular/core';
import { Session } from '../../../services/session';
import { FeedNoticeService } from '../../../modules/notices/services/feed-notice.service';
import { ApiResponse, ApiService } from '../../api/api.service';
import { Observable } from 'rxjs';

/**
 * Service handling the sending of new confirmation emails, verification of email addresses
 * and whether a user requires email confirmation at all.
 */
@Injectable({ providedIn: 'root' })
export class EmailConfirmationV2Service {
  constructor(
    private api: ApiService,
    private session: Session,
    private feedNotice: FeedNoticeService
  ) {}

  /**
   * Send a new email containing a confirmation code.
   * @param { string } key - if a previous email has been sent, pass the key
   * that you got in response here so that resend requests generate a new email
   *  with the same code.
   * @returns { Observable<ApiResponse> }
   */
  public sendEmail(key: string = null): Observable<ApiResponse> {
    const options = key
      ? {
          headers: {
            'X-MINDS-EMAIL-2FA-KEY': key,
          },
        }
      : undefined;
    return this.api.post<ApiResponse>('api/v3/email/send', null, options);
  }

  /**
   * Submit a confirmation code.
   * @param { string } code - the code to submit.
   * @param { string } key - the code that was sent back upon the email being sent.
   * @returns { Observable<ApiResponse> }
   */
  public submitCode(code: string, key: string): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('api/v3/email/verify', null, {
      headers: {
        'X-MINDS-2FA-CODE': code,
        'X-MINDS-EMAIL-2FA-KEY': key,
      },
    });
  }

  /**
   * Whether logged-in user requires email confirmation.
   * @returns { boolean } true if email confirmation is required.
   */
  public requiresEmailConfirmation(): boolean {
    const user = this.session.getLoggedInUser();
    return user && user.email_confirmed === false;
  }

  /**
   * Update local session services email confirmation state.
   * @param { boolean } state - state to set to (defaults to true).
   * @returns { void }
   */
  public updateLocalConfirmationState(state: boolean = true): void {
    let updatedUser = this.session.getLoggedInUser();
    updatedUser.email_confirmed = state;
    this.session.inject(updatedUser);
    this.feedNotice.dismiss('verify-email');
  }
}
