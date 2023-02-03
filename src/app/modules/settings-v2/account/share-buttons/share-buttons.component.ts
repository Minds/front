import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

import { Session } from '../../../../services/session';
import { Subscription } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';

import { SettingsV2Service } from '../../settings-v2.service';

/**
 * Settings form for controlling whether the share buttons overlay appears at the bottom of relevant pages (e.g. a single activity page)
 */
@Component({
  selector: 'm-settingsV2__shareButtons',
  templateUrl: './share-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ShareButtonsComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  user: MindsUser;
  settingsSubscription: Subscription;
  form;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected settingsService: SettingsV2Service
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.form = new UntypedFormGroup({
      showButtons: new UntypedFormControl(''),
    });

    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings: any) => {
        this.showButtons.setValue(!settings.hide_share_buttons);
        this.detectChanges();
      }
    );

    this.init = true;
    this.detectChanges();
  }

  async submit() {
    if (!this.canSubmit()) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      const formValue = {
        hide_share_buttons: !this.showButtons.value,
      };

      const response: any = await this.settingsService.updateSettings(
        this.user.guid,
        formValue
      );
      if (response.status === 'success') {
        this.formSubmitted.emit({ formSubmitted: true });
        this.form.markAsPristine();
      }
    } catch (e) {
      this.formSubmitted.emit({ formSubmitted: false, error: e });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  canSubmit(): boolean {
    return this.form.valid && !this.inProgress && !this.form.pristine;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  get showButtons() {
    return this.form.get('showButtons');
  }
}
