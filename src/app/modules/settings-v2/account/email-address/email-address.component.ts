import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Session } from '../../../../services/session';

import { FormToastService } from '../../../../common/services/form-toast.service';
import { SettingsV2Service } from '../../settings-v2.service';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'm-settingsV2__emailAddress',
  templateUrl: './email-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2EmailAddressComponent implements OnInit {
  inProgress: boolean = false;
  guid;
  form;

  constructor(
    protected cd: ChangeDetectorRef,
    private formToastService: FormToastService,
    private session: Session,
    protected settingsService: SettingsV2Service,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.guid = this.session.getLoggedInUser().guid;
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    const response: any = await this.settingsService.loadSettings(this.guid);
    const email = response.channel.email;

    this.form = new FormGroup({
      email: new FormControl(email, {
        validators: [Validators.required],
      }),
    });
    this.inProgress = false;
    this.detectChanges();
  }

  async update() {
    if (!this.canSubmit()) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      this.settingsService.loadSettings(this.guid);

      const response: any = await this.settingsService.updateSettings(
        this.guid,
        this.form.value
      );
      if (response.status === 'success') {
        this.formToastService.success('Email address saved');
        this._markFormPristine();
      }
    } catch (e) {
      this.formToastService.error(e);
    } finally {
      this.inProgress = false;

      this.detectChanges();
    }
  }

  private _markFormPristine(): void {
    Object.keys(this.form.controls).forEach(control => {
      this.form.controls[control].markAsPristine();
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.pristine) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  canSubmit(): boolean {
    return this.form.valid && !this.inProgress && !this.form.pristine;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get email() {
    return this.form.get('email');
  }
}
