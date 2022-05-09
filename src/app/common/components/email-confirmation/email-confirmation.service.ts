import { Injectable } from '@angular/core';
import { Client } from '../../../services/api/client';
import { FormToastService } from '../../services/form-toast.service';
import { ConfigsService } from '../../services/configs.service';
import { Session } from '../../../services/session';
import { ModalService } from '../../../services/ux/modal.service';
import { EmailConfirmationModalComponent } from './modal/email-confirmation-modal.component';
import { BehaviorSubject } from 'rxjs';

/**
 * Service handling the sending of new confirmation emails and whether a user
 * requires email confirmation at all.
 */
@Injectable({ providedIn: 'root' })
export class EmailConfirmationService {
  // whether config identifies email as unconfirmed.
  private readonly fromEmailConfirmation: boolean = false;

  // called on email confirmation success.
  public readonly success$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    protected client: Client,
    private toasterService: FormToastService,
    private session: Session,
    private modal: ModalService,
    configs: ConfigsService
  ) {
    this.fromEmailConfirmation = configs.get('from_email_confirmation');
  }

  /**
   * Open email confirmation modal.
   * @returns { void }
   */
  public openModal(): void {
    this.modal.present(EmailConfirmationModalComponent, {
      beforeDismiss: () => !this.requiresEmailConfirmation(),
      data: {
        onSuccess: (success: any) => {
          this.modal.dismissAll(); // TODO: should it be dismiss all?
        },
      },
    });
  }

  /**
   * Shows error to alert user that they must confirm their email address.
   * @returns { void }
   */
  public showError(): void {
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
   * Verify email code - will trigger MFA modal.
   * On success will set email confirmation to verified.
   * @returns { Promise<boolean> } - true if success
   */
  async verify(): Promise<boolean> {
    try {
      const response = (await this.client.post(
        'api/v3/two-factor/confirm-email'
      )) as any;
      this.success$.next(true);
      return response.status === 'success';
    } catch (e) {
      console.warn(e);
      return false;
    }
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
