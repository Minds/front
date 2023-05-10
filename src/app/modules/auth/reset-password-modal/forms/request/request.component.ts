import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Client } from '../../../../../services/api';
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
  implements OnInit, OnDestroy {
  protected form: FormGroup;

  private subscriptions: Subscription[] = [];
  protected activePanel: ResetPasswordModalPanel = 'enterUsername';
  protected inProgress: boolean = false;
  protected canSendEmail: boolean = true;

  protected secondsBetweenResends: number;

  constructor(
    protected client: Client,
    protected toaster: ToasterService,
    private formBuilder: FormBuilder,
    protected service: ResetPasswordModalService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.activePanel$.subscribe(activePanel => {
        this.activePanel = activePanel;
      }),
      this.service.inProgress$.subscribe(inProgress => {
        this.inProgress = inProgress;
      }),
      this.service.canSendEmail$.subscribe(canSendEmail => {
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

    this.form.controls.username.valueChanges.subscribe(changes => {
      console.log('ojm REQ valueChanges', changes);
    });
  }

  /**
   * Request password reset for an email.
   * @param username - username to be checked.
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

  get canSubmit(): boolean {
    return !this.inProgress && this.canSendEmail && this.form.valid;
  }
}
