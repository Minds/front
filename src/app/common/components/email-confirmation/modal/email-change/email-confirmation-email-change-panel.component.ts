import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormToastService } from '../../../../services/form-toast.service';
import { EmailConfirmationModalService } from '../email-confirmation-modal.service';

/**
 * Email confirmation panel for a member to change their email address if
 * they entered it incorrectly or need to switch to a different email.
 */
@Component({
  selector: 'm-emailConfirmation__emailChangePanel',
  templateUrl: 'email-confirmation-email-change-panel.component.html',
  styleUrls: ['../email-confirmation-modal.component.ng.scss'],
})
export class EmailConfirmationEmailChangePanelComponent {
  // form group.
  public form: FormGroup;

  // email change in progress.
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    private formBuilder: FormBuilder,
    private toast: FormToastService,
    public service: EmailConfirmationModalService
  ) {}

  ngOnInit(): void {
    // setup form.
    this.form = this.formBuilder.group({
      email: [
        this.service.email$.getValue(),
        [Validators.required, Validators.email],
      ],
    });
  }

  /**
   * Triggered on update button click. If there is errors, will throw a toast and return, else
   * will request that the main service changes the email address.
   * @returns { Promise<void> }
   */
  public async onUpdateClick(): Promise<void> {
    if (this.form.controls.email.errors) {
      this.toast.error('Invalid email');
      return;
    }
    this.inProgress$.next(true);
    await this.service.changeEmail(this.form.value.email);
    this.inProgress$.next(false);
  }

  /**
   * Triggered on "Go Back" click - will return to the code panel with no changes made.
   * @returns { void }
   */
  public goBackClick(): void {
    this.service.activePanel$.next('code');
  }
}
