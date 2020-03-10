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
import { MindsUser } from '../../../../interfaces/entities';
@Component({
  selector: 'm-settingsV2__displayName',
  templateUrl: './display-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2DisplayNameComponent implements OnInit {
  inProgress: boolean = false;
  user: MindsUser;
  form;

  constructor(
    protected cd: ChangeDetectorRef,
    private formToastService: FormToastService,
    private session: Session,
    protected settingsService: SettingsV2Service,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    this.form = new FormGroup({
      name: new FormControl(this.session.getLoggedInUser().name, {
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

      this.settingsService.loadSettings(this.user.guid);

      const response: any = await this.settingsService.updateSettings(
        this.user.guid,
        this.form.value
      );
      if (response.status === 'success') {
        this.formToastService.success('Display name saved');
        this._markFormPristine();
        this.user.name = this.name;
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

  get name() {
    return this.form.get('name');
  }
}
