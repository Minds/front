import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ComponentOnboardingV5VerifyEmailStep } from '../../../../../../../graphql/generated.strapi';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { OnboardingStepContentInterface } from '../../step-content.interface';
import { BehaviorSubject } from 'rxjs';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Session } from '../../../../../../services/session';
import { SettingsV2Service } from '../../../../../settings-v2/settings-v2.service';

/**
 * Change email sub-panel for onboarding v5 modal's verify email step.
 * Allows a user to change their email address and get a new code if they mis-type it.
 */
@Component({
  selector: 'm-onboardingV5__changeEmailContent',
  templateUrl: './change-email.component.html',
  styleUrls: [
    'change-email.component.ng.scss',
    '../../../../stylesheets/onboarding-v5-common.ng.scss',
  ],
})
export class OnboardingV5ChangeEmailContentComponent
  implements OnInit, AfterViewInit, OnboardingStepContentInterface {
  /** CMS data. */
  @Input() public data: ComponentOnboardingV5VerifyEmailStep;

  /** Go back click event */
  @Output() public readonly goBackClick: EventEmitter<void> = new EventEmitter<
    void
  >();

  /** Email changed event */
  @Output() public readonly emailChanged: EventEmitter<void> = new EventEmitter<
    void
  >();

  /** Whether email change request is in progress. */
  public readonly emailChangeInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Form group. */
  public formGroup: FormGroup;

  /** View-child for when email change is in progress. */
  @ViewChild('newEmailInput') public newEmailInput: ElementRef<
    HTMLInputElement
  >;

  constructor(
    private session: Session,
    private settingsService: SettingsV2Service,
    private toast: ToasterService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      newEmail: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  ngAfterViewInit(): void {
    this.newEmailInput.nativeElement.focus();
  }

  /**
   * Gets new email input form control.
   * @returns { AbstractControl<string> } form control.
   */
  get newEmailFormControl(): AbstractControl<string> {
    return this.formGroup.get('newEmail');
  }

  /**
   * Step content must handle on skip button behaviour, in this case it is a no-op but could
   * be extended in the future to support a skip or go back button.
   * @returns { void }
   */
  public onSkipButtonClick(): void {
    // no-op.
    console.warn('Skip button click function triggered for change email form');
  }

  /**
   * On click, submit an email change and emit event, to send the user back to the
   * code input sub-panel on success.
   * @returns { Promise<void> }
   */
  public async onActionButtonClick(): Promise<void> {
    try {
      this.emailChangeInProgress$.next(true);
      const response: any = await this.settingsService.updateSettings(
        this.session.getLoggedInUser().guid,
        { email: this.newEmailFormControl.value }
      );
      if (!response || response.status !== 'success') {
        throw response?.message ?? 'An error has occurred';
      }
      this.emailChanged.emit();
    } catch (e) {
      console.error(e);
      this.toast.error('An unknown error has occurred');
    } finally {
      this.emailChangeInProgress$.next(false);
    }
  }
}
