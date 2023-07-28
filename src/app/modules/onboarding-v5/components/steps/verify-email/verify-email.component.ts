import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ComponentOnboardingV5OnboardingStep } from '../../../../../../graphql/generated.strapi';
import { OnboardingV5Service } from '../../../services/onboarding-v5.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { EmailConfirmationV2Service } from '../../../../../common/components/email-confirmation/email-confirmation-v2.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  firstValueFrom,
  map,
  takeWhile,
  timer,
} from 'rxjs';
import { OnboardingStepContentInterface } from '../step-content.interface';
import { SettingsV2Service } from '../../../../settings-v2/settings-v2.service';
import { Session } from '../../../../../services/session';
import { OnboardingV5VerifyEmailSubPanel } from '../../../types/onboarding-v5.types';

// Messages to be displayed in toaster when a user has sent a new email.
export enum EmailSendSuccessMessage {
  RESENT = 'Confirmation email has been resent; please be sure to check your junk folder.',
  EMAIL_CHANGED = 'Confirmation email has been resent to your new email address; please be sure to check your junk folder.',
}

/**
 * Verify email content panel for onboarding v5
 * Allows a user to verify their email address via code, and request additional emails
 * containing the code incase the email did not arrive. Also provides access to the
 * change email sub-panel.
 */
@Component({
  selector: 'm-onboardingV5__verifyEmailContent',
  templateUrl: './verify-email.component.html',
  styleUrls: [
    'verify-email.component.ng.scss',
    '../../../stylesheets/onboarding-v5-common.ng.scss',
  ],
})
export class OnboardingV5VerifyEmailContentComponent
  implements OnInit, OnDestroy, AfterViewInit, OnboardingStepContentInterface {
  /** Content title. */
  @Input() public title: string;

  /** Content description. */
  @Input() public description: string;

  /** CMS data. */
  @Input() public data: ComponentOnboardingV5OnboardingStep;

  /** Form group. */
  public formGroup: FormGroup;

  /** Confirmation key to be passed with code submission. */
  public confirmationKey: string;

  /** When email sending is in progress */
  public readonly emailSendInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** When code submission is in progress */
  public readonly codeSubmissionInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Seconds remaining before a user can try to request a new email again. */
  public retrySecondsRemaining = 0;

  /** Allow enum to be used in template by pulling it into the controller. */
  public readonly OnboardingV5VerifyEmailSubPanel: typeof OnboardingV5VerifyEmailSubPanel = OnboardingV5VerifyEmailSubPanel;

  /** Verify email component has a sub-panel for changing email address. */
  public readonly activeSubPanel$: BehaviorSubject<
    OnboardingV5VerifyEmailSubPanel
  > = new BehaviorSubject<OnboardingV5VerifyEmailSubPanel>(
    OnboardingV5VerifyEmailSubPanel.CODE_INPUT
  );

  /** Code input element ViewChild. */
  @ViewChild('codeInput') public codeInput: ElementRef<HTMLInputElement>;

  /** Subscription to retry timer. */
  private retryTimerSubscription: Subscription;

  constructor(
    private service: OnboardingV5Service,
    private emailConfirmation: EmailConfirmationV2Service,
    private toast: ToasterService,
    private settingsService: SettingsV2Service,
    private session: Session
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      code: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
    this.sendEmail();
    this.settingsService.loadSettings(this.session.getLoggedInUser().guid);
  }

  ngAfterViewInit(): void {
    this.codeInput.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.retryTimerSubscription?.unsubscribe();
  }

  /**
   * String for resending code, with interpolated anchor tag for link.
   * @returns { string } - string for resending code.
   */
  get resendCodeString(): string {
    return this.data?.verifyEmailForm?.resendCodeText?.replace(
      '{action}',
      '<a class="m-onboardingV5VerifyEmail__resendCodeAction" tabindex="2">' +
        (this.data?.verifyEmailForm?.resendCodeActionText ?? 'resend code') +
        '</a>'
    );
  }

  /**
   * Gets code input form control.
   * @returns { AbstractControl<string> } form control.
   */
  get codeInputFormControl(): AbstractControl<string> {
    return this.formGroup.get('code');
  }

  /**
   * Gets description text - will interpolate email address with {email} text in the CMS
   * provided description when the email is loaded, else it will show `...` during loading.
   * @returns { Observable<string> } description text.
   */
  get description$(): Observable<string> {
    return this.settingsService.settings$.pipe(
      map((settings: { email?: string }): string => settings?.email),
      map((email: string): string =>
        this.data?.description?.replace('{email}', email ?? '..')
      )
    );
  }

  /**
   * Called on code resend click.
   * @param { MouseEvent } $event - mouse event that triggered the click.
   * @returns { Promise<void> }
   */
  public async onResendCodeTextClick($event: MouseEvent): Promise<void> {
    // we cannot bind a click binding to innerHtml, thus we check what element was clicked on
    // to determine if it was the action text.
    if (
      ($event.target as HTMLElement).className ===
      'm-onboardingV5VerifyEmail__resendCodeAction'
    ) {
      if (this.retrySecondsRemaining > 0) {
        this.toast.warn(
          `Please wait ${this.retrySecondsRemaining} seconds before retrying.`
        );
        return;
      }
      this.sendEmail(EmailSendSuccessMessage.RESENT);
    }
  }

  /**
   * Submit code on action button click.
   * @returns { void }
   */
  public onActionButtonClick(): void {
    this.submitCode();
  }

  /**
   * Fires on skip button click, if a skip button is made present.
   * @returns { void }
   */
  public onSkipButtonClick(): void {
    this.service.continue();
  }

  /**
   * On paste, submit code providing trimmed pasted data is correct length.
   * @param { KeyboardEvent } $event - event.
   * @returns { void }
   */
  public onPaste($event: KeyboardEvent): void {
    // bounce to back of event queue as this fires
    // BEFORE the form value is updated.
    setTimeout(() => {
      if (this.codeInputFormControl.value.trim().length === 6) {
        this.submitCode();
      }
    }, 0);
  }

  /**
   * Send confirmation email.
   * @param { ConfirmationSuccessMessage } successMessage - message to show on success.
   * If no message is provided no toast will be shown.
   * @returns { Promise<void> }
   */
  private async sendEmail(
    successMessage: EmailSendSuccessMessage = null
  ): Promise<void> {
    this.emailSendInProgress$.next(true);
    this.startRetryTimer();

    try {
      const response = await firstValueFrom(
        this.emailConfirmation.sendEmail(this.confirmationKey)
      );

      if (!response?.key) {
        throw new Error('No email confirmation key provided in response');
      }

      if (successMessage) {
        this.toast.success(successMessage);
      }

      this.confirmationKey = response.key;
    } catch (e) {
      console.error(e);
      this.toast.error('An unknown error has occurred.');
    } finally {
      this.emailSendInProgress$.next(false);
    }
  }

  /**
   * Submit code for confirmation.
   * @returns { Promise<void> }
   */
  private async submitCode(): Promise<void> {
    const errors: ValidationErrors = this.codeInputFormControl.errors;

    if (errors) {
      if (errors.required) {
        this.toast.error('You must enter your email verification code.');
      }
      if (errors.minlength) {
        this.toast.error(
          `Code must be exactly ${errors.minlength.requiredLength} characters long.`
        );
      }
      if (errors.maxlength) {
        this.toast.error(
          `Code must be exactly ${errors.maxlength.requiredLength} characters long.`
        );
      }
      return;
    }

    this.codeSubmissionInProgress$.next(true);

    try {
      await firstValueFrom(
        this.emailConfirmation.submitCode(
          this.codeInputFormControl.value.trim(),
          this.confirmationKey
        )
      );
      this.emailConfirmation.updateLocalConfirmationState();
      this.service.continue();
    } catch (e) {
      console.error(e);
      if (
        e?.error?.errorId ===
        'Minds::Core::Email::Confirmation::Exceptions::EmailConfirmationInvalidCodeException'
      ) {
        this.toast.error(e?.error?.message ?? 'The provided code is invalid.');
        return;
      }
      this.toast.error('An unknown error has occurred.');
    } finally {
      this.codeSubmissionInProgress$.next(false);
    }
  }

  /**
   * Starts retry timer for when another confirmation code can be sent.
   * @returns { void }
   */
  private startRetryTimer(seconds: number = 30): void {
    this.retrySecondsRemaining = seconds;
    this.retryTimerSubscription?.unsubscribe();

    this.retryTimerSubscription = timer(0, 1000)
      .pipe(takeWhile((val: number): boolean => val < seconds))
      .subscribe((val: number): void => {
        --this.retrySecondsRemaining;
      });
  }

  /**
   * Called on change email address click - changes active panel
   * to the CHANGE_EMAIL sub-panel.
   * @returns { void }
   */
  public onChangeEmailAddressClick(): void {
    this.activeSubPanel$.next(OnboardingV5VerifyEmailSubPanel.CHANGE_EMAIL);
  }

  /**
   * Called on navigation back from the CHANGE_EMAIL sub-panel.
   * changes active panel to CODE_INPUT.
   * @returns { void }
   */
  public onChangeEmailBackNavigation(): void {
    this.activeSubPanel$.next(OnboardingV5VerifyEmailSubPanel.CODE_INPUT);

    // push to back of event queue so that the component has time to re-render.
    setTimeout(() => {
      this.codeInput?.nativeElement?.focus();
    }, 0);
  }

  /**
   * Called on email changed event from the CHANGE_EMAIL sub-panel.
   * Sets panel back to CODE_INPUT and sends a new email.
   * @returns { void }
   */
  public onEmailChanged(): void {
    this.activeSubPanel$.next(OnboardingV5VerifyEmailSubPanel.CODE_INPUT);
    this.sendEmail(EmailSendSuccessMessage.EMAIL_CHANGED); // async.

    // push to back of event queue so that the component has time to re-render.
    setTimeout(() => {
      this.codeInput?.nativeElement?.focus();
    }, 0);
  }
}
