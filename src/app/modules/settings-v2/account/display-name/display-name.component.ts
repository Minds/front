import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Client } from '../../../../services/api/client';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { Session } from '../../../../services/session';
@Component({
  selector: 'm-settingsV2__displayName',
  templateUrl: './display-name.component.html',
})
export class SettingsV2DisplayNameComponent implements OnInit {
  inProgress: boolean = false;
  currentName: string = '';
  form;
  error: string;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    private formToastService: FormToastService,
    private session: Session
  ) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.currentName = this.session.getLoggedInUser().name;

    // this.inProgress = true;
    // try {
    //   this.client.get('api/v1/settings/' + this.guid).then((response: any) => {
    //   // Get current name
    //   // const { name } = <any>await this.client.get('api/v2/wallet/btc/address');
    //   // if (name) {
    //   // }
    // } catch (e) {
    //   console.error(e);
    // }
    // this.inProgress = false;
    this.form = new FormGroup({
      displayName: new FormControl(this.currentName, {
        validators: [Validators.required],
      }),
    });
    this.detectChanges();
  }

  async update() {
    if (this.form.invalid || this.inProgress) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      await this.client.post('api/v2/wallet/btc/address', {
        address: this.displayName.value,
      });
      this.currentName = this.displayName.value;
      this.formToastService.success('Save success');
    } catch (e) {
      this.formToastService.error(e);
      console.error(e);
    } finally {
      this.inProgress = false;

      this.detectChanges();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get displayName() {
    return this.form.get('displayName');
  }
}
