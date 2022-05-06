import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Exception } from 'sass';
import { EmailResendService } from '../../../../services/email-resend.service';
import { FormToastService } from '../../../../services/form-toast.service';
import { AbstractSubscriberComponent } from '../../../abstract-subscriber/abstract-subscriber.component';
import {
  EmailAddress,
  EmailConfirmationModalService,
} from '../email-confirmation-modal.service';

/**
 * Email confirmation panel for inputting a code sent via email
 * and submitting it, for new members to confirm their email.
 */
@Component({
  selector: 'm-emailConfirmation__codePanel',
  templateUrl: 'email-confirmation-code-panel.component.html',
  styleUrls: ['../email-confirmation-modal.component.ng.scss'],
})
export class EmailConfirmationCodePanelComponent
  extends AbstractSubscriberComponent
  implements OnInit {
  // form group.
  public form: FormGroup;

  // Fires on success.
  @Output() onSuccess: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  // Subject of the members email, from the shared service.
  public readonly email$: BehaviorSubject<EmailAddress> = this.service.email$;

  constructor(
    private formBuilder: FormBuilder,
    private service: EmailConfirmationModalService,
    private emailResend: EmailResendService,
    private toast: FormToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern('^\\d{6}$'),
        ],
      ],
    });
  }

  /**
   * Triggered on verify button click. Will fire off request to validate
   * a code and dismiss the modal.
   * @returns { void }
   */
  public onVerifyClick(): void {
    if (this.form.controls.code.errors) {
      this.toast.error('Invalid code entered');
      this.form.reset();
      return;
    }

    this.subscriptions.push(
      this.service
        .submitCode(this.form.value.code)
        .pipe(
          map(response => {
            if (!response || response.status !== 'success') {
              throw response;
            }
            this.onSuccess.emit(true);
          }),
          catchError(e => {
            this.toast.error(e.error?.message ?? 'Unable to verify code');
            this.form.reset();
            return EMPTY;
          })
        )
        .subscribe()
    );
  }

  /**
   * Triggered when change email is clicked. Switches
   * panels to allow the member to change their email address.
   * @returns { void }
   */
  public onEmailChangeClick(): void {
    this.service.activePanel$.next('change-email');
  }

  /**
   * Triggered on email resend click. Resends an email or
   * will show a toast if the user hasn't waited long enough
   * between resend requests.
   * @returns { void }
   */
  public onEmailResendClick(): void {
    this.emailResend.send();
  }
}
