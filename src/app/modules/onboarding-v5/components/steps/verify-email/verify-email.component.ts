import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'm-onboardingV5__verifyEmailContent',
  templateUrl: './verify-email.component.html',
  styleUrls: [
    'verify-email.component.ng.scss',
    '../../../stylesheets/onboarding-v5-common.ng.scss',
  ],
})
export class OnboardingV5VerifyEmailContentComponent implements OnInit {
  @Input() public readonly title: string;
  @Input() public readonly description: string;
  @Input() public readonly data: ComponentOnboardingV5OnboardingStep;

  public formGroup: FormGroup;

  constructor(
    private service: OnboardingV5Service,
    private emailConfirmation: EmailConfirmationV2Service,
    private toast: ToasterService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      code: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  get resendCodeString(): string {
    return this.data?.verifyEmailForm?.resendCodeText?.replace(
      '{action}',
      '<a class="m-onboardingV5VerifyEmail__resendCodeAction" style="cursor: pointer">' +
        this.data?.verifyEmailForm?.resendCodeActionText ??
        'resend code' + '</a>'
    );
  }

  public async onResendCodeTextClick($event: MouseEvent): Promise<void> {
    if (
      ($event.target as HTMLElement).className ===
      'm-onboardingV5VerifyEmail__resendCodeAction'
    ) {
      console.log('anchor clicked');
      // try {
      //   const response = await this.emailConfirmation.sendEmail();
      //   console.log('headers', response.headers)
      //   console.log('headers', response.headers.get('X-MINDS-EMAIL-2FA-KEY'))
      // } catch(e: unknown) {
      //   // TODO: Form toast?
      //   console.error(e);
      //   return;
      // }
    }
  }

  public async onActionButtonClick(): Promise<void> {
    const formControl: AbstractControl<string> = this.formGroup.get('code');
    const errors: ValidationErrors = formControl.errors;

    if (errors) {
      if (errors.required) {
        this.toast.error('You must enter your email verification code.');
      }
      if (errors.maxlength || errors.minlength) {
        this.toast.error(
          `Code must be exactly ${errors.maxlength.requiredLength} characters long.`
        );
      }
      return;
    }

    // try {
    //   await this.emailConfirmation.submitCode(this.formGroup.get('code').value);
    // } catch(e: unknown) {
    //   // TODO: Form toast?
    //   console.error(e);
    //   return;
    // }

    this.service.continue();
  }

  public onSkipButtonClick(): void {
    this.service.continue();
  }
}
