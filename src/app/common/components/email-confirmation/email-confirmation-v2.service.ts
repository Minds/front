import { Injectable } from '@angular/core';
import { Session } from '../../../services/session';
import { FeedNoticeService } from '../../../modules/notices/services/feed-notice.service';
import { ApiResponse, ApiService } from '../../api/api.service';
import { Observable, firstValueFrom } from 'rxjs';

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

  public sendEmail(): Promise<ApiResponse> {
    return firstValueFrom(this.api.post<ApiResponse>('api/v3/email/send'));
  }

  public submitCode(code: string): Promise<ApiResponse> {
    return firstValueFrom(
      this.api.post<ApiResponse>(
        'api/v3/email/verify',
        {},
        {
          // headers: {
          //   'X-MINDS-2FA-CODE': code
          // },
        }
      )
    );

    // 'X-MINDS-EMAIL-2FA-KEY'
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
  private updateLocalConfirmationState(state: boolean = true): void {
    let updatedUser = this.session.getLoggedInUser();
    updatedUser.email_confirmed = state;
    this.session.inject(updatedUser);
    this.feedNotice.dismiss('verify-email');
  }
}
