import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ToasterService } from '../../../../../common/services/toaster.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  MIN_MS_BETWEEN_RESET_PASSWORD_EMAILS,
  ResetPasswordModalPanel,
  ResetPasswordModalService,
} from '../../reset-password-modal.service';
import { SITE_NAME } from '../../../../../common/injection-tokens/common-injection-tokens';

/**
 * Form for the user to submit a request for a
 * reset password email to be sent to the email associated with their
 * username.
 */
@Component({
  selector: 'm-resetPasswordModal__form--request',
  templateUrl: './request.component.html',
  styleUrls: ['../../reset-password-modal.component.ng.scss'],
})
export class ResetPasswordModalRequestFormComponent
  implements OnInit, OnDestroy
{
  protected form: FormGroup;

  private subscriptions: Subscription[] = [];
  protected activePanel: ResetPasswordModalPanel = 'enterUsername';
  protected inProgress: boolean = false;
  protected canSendEmail: boolean = true;

  protected secondsBetweenResends: number;
  protected readonly loginToText: string;

  constructor(
    protected toaster: ToasterService,
    private formBuilder: FormBuilder,
    protected service: ResetPasswordModalService,
    @Inject(SITE_NAME) protected siteName: string
  ) {
    this.loginToText = $localize`:@@RESET_PASSWORD__EMAIL_SENT_PANEL__LOGIN_LINK__TO_SITE:to ${this.siteName || 'Minds'}:site name:`;
  }

  ngOnInit(): void {
    // Always show the first panel on load
    this.service.activePanel$.next('enterUsername');

    this.subscriptions.push(
      this.service.activePanel$.subscribe((activePanel) => {
        this.activePanel = activePanel;
      }),
      this.service.inProgress$.subscribe((inProgress) => {
        this.inProgress = inProgress;
      }),
      this.service.canSendEmail$.subscribe((canSendEmail) => {
        this.canSendEmail = canSendEmail;
      })
    );

    this.secondsBetweenResends = MIN_MS_BETWEEN_RESET_PASSWORD_EMAILS / 1000;

    this.buildForm();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      username: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  /**
   * Request a reset password email to be sent.
   */
  async request(): Promise<void> {
    if (!this.canSubmit) {
      return;
    }

    // strip @ character from start if entered.
    let usernameValue = this.form.controls.username.value;
    if (usernameValue.charAt(0) === '@') {
      usernameValue = usernameValue.substr(1);
    }

    this.service.request(usernameValue);
  }

  openAuthModal($event): void {
    this.service.openAuthModal();
  }

  get canSubmit(): boolean {
    return !this.inProgress && this.canSendEmail && this.form.valid;
  }
}
