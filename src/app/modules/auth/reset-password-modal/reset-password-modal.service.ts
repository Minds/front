import {
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { ModalService } from '../../../services/ux/modal.service';
import { ResetPasswordModalComponent } from './reset-password-modal.component';
import { isPlatformBrowser } from '@angular/common';

import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Router } from '@angular/router';

export type ResetPasswordModalPanel =
  | 'enterUsername'
  | 'invalidUsername'
  | 'emailSent'
  | 'newPassword';

export const MIN_MS_BETWEEN_RESET_PASSWORD_EMAILS: number = 60000;

@Injectable()
export class ResetPasswordModalService implements OnDestroy {
  /**
   * currently active modal panel
   */
  public readonly activePanel$: BehaviorSubject<
    ResetPasswordModalPanel
  > = new BehaviorSubject<ResetPasswordModalPanel>('enterUsername');

  /**
   * False if we've already sent an email too recently
   */
  public readonly canSendEmail$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);
  /**
   * Whether we are waiting for something to load
   */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** Keeps track of whether enough time has passed since last email was sent to re-enable the resend button */
  private emailTimer;

  constructor(
    private injector: Injector,
    private modalService: ModalService,
    private session: Session,
    private router: Router,
    private toaster: ToasterService,
    private api: ApiService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * Request a password reset email to be sent
   * @param username - username object to be checked.
   */
  async request(username: string): Promise<void> {
    if (this.inProgress$.getValue()) {
      return;
    }

    this.inProgress$.next(true);

    try {
      await this.api
        .post('api/v1/forgotpassword/request', {
          username: username,
        })
        .toPromise();

      this.startEmailTimer();
      this.activePanel$.next('emailSent');
    } catch (e) {
      this.activePanel$.next('invalidUsername');
      this.toaster.error(
        e.message ||
          'There was a problem trying to send you a password reset email. Please try again.'
      );
      console.log(e);
    } finally {
      this.inProgress$.next(false);
    }
  }

  /**
   * Request a password reset email to be sent
   * @param password - the new password.
   * @param username - of user who is resetting their password.
   * @param code - the code provided in the reset password email.
   */
  async reset(password: string, username: string, code: string): Promise<void> {
    if (this.inProgress$.getValue()) {
      return;
    }

    this.inProgress$.next(true);

    try {
      const response = await this.api
        .post('api/v1/forgotpassword/reset', {
          password: password,
          username: username,
          code: code,
        })
        .toPromise();

      this.session.login(response.user);
      this.router.navigate(['/newsfeed']);
    } catch (e) {
      this.toaster.error(
        e.message ||
          'There was a problem trying to reset your password. Please try again.'
      );
      console.log(e);
      this.activePanel$.next('enterUsername');
    } finally {
      this.inProgress$.next(false);
    }
  }

  startEmailTimer(): void {
    console.log('ojm SVC starting email timer...');
    this.canSendEmail$.next(false);
    if (isPlatformBrowser(this.platformId)) {
      this.emailTimer = setTimeout(() => {
        this.canSendEmail$.next(true);
        console.log('ojm SVC email timer finished');
      }, MIN_MS_BETWEEN_RESET_PASSWORD_EMAILS);
    }
  }

  async open(
    opts: { username?: string; code?: string } = {}
  ): Promise<MindsUser> {
    if (this.session.isLoggedIn()) {
      return this.session.getLoggedInUser();
    }

    const { ResetPasswordModalModule } = await import(
      './reset-password-modal.module'
    );

    const modal = this.modalService.present(ResetPasswordModalComponent, {
      data: {
        username: opts.username ?? null, // ojm check if elvis works
        code: opts.code ?? null,
        onComplete: async (user: MindsUser) => {
          modal.close(user); // ojm is this what I want? or do I also want to complete the login
        },
      },
      keyboard: false,
      injector: this.injector,
      lazyModule: ResetPasswordModalModule,
    });

    return modal.result;
  }

  ngOnDestroy(): void {
    if (this.emailTimer) {
      clearTimeout(this.emailTimer);
    }
  }
}
