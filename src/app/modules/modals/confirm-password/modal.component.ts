import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { ToasterService } from '../../../common/services/toaster.service';
import { ModalService } from '../../../services/ux/modal.service';

@Component({
  moduleId: module.id,
  selector: 'm-confirm-password--modal',
  templateUrl: 'modal.component.html',
})
export class ConfirmPasswordModalComponent {
  success: boolean = false;
  criticalError: boolean = false;
  error: string = '';
  inProgress: boolean = false;
  done: any;
  form: FormGroup;

  protected submitted: boolean;

  onComplete?: ({ password: string }) => void;

  constructor(
    public session: Session,
    private cd: ChangeDetectorRef,
    public modalService: ModalService,
    private client: Client,
    public fb: FormBuilder,
    protected toasterService: ToasterService
  ) {
    this.form = fb.group({
      password: ['', Validators.required],
    });
  }

  setModalData(opts: { onComplete: ({ password: string }) => void }) {
    this.onComplete = opts.onComplete;
  }

  validate() {
    if (!this.form.value.password) {
      throw new Error('Password should be set.');
    }
  }

  canSubmit() {
    try {
      this.validate();
      return true;
    } catch (e) {}

    return false;
  }

  showErrors() {
    if (!this.submitted) {
      this.error = '';
    }

    try {
      this.validate();
    } catch (e) {
      if (e.visible) {
        this.error = e.message;
        this.toasterService.error("There's been an error. Please try again.");
      }
    }
  }

  async submit() {
    if (this.inProgress) {
      return;
    }

    if (!this.canSubmit()) {
      this.showErrors();
      return;
    }

    try {
      this.inProgress = true;
      this.submitted = true;
      this.error = '';

      await this.client.post('api/v2/settings/password/validate', {
        password: this.form.value.password,
      });

      if (this.onComplete) {
        this.onComplete({
          password: this.form.value.password,
        });
        this.modalService.dismissAll();
      }
    } catch (e) {
      this.inProgress = false;
      if (e.status === 'failed') {
        this.error = 'LoginException::AuthenticationFailed';
        this.toasterService.error('Incorrect password. Please try again.');
      }
    }
  }
}
