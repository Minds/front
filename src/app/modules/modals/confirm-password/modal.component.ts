import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

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

  _opts: any;
  set opts(opts: any) {
    this._opts = opts;
  }

  constructor(
    public session: Session,
    private cd: ChangeDetectorRef,
    public overlayModal: OverlayModalService,
    private client: Client,
    public fb: FormBuilder
  ) {
    this.form = fb.group({
      password: ['', Validators.required],
    });
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

      if (this._opts && this._opts.onComplete) {
        this._opts.onComplete({
          password: this.form.value.password,
        });
        this.overlayModal.dismiss();
      }
    } catch (e) {
      this.inProgress = false;
      if (e.status === 'failed') {
        this.error = 'LoginException::AuthenticationFailed';
      }
    }
  }
}
