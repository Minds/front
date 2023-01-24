import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';

import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { Observable, Subscription } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';

import { SettingsV2Service } from '../../settings-v2.service';

import { ConfigsService } from '../../../../common/services/configs.service';
import { LanguageService } from '../../../language/language.service';

/**
 * Settings form for changing language preferences.
 */
@Component({
  selector: 'm-settingsV2__displayLanguage',
  templateUrl: './language.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2LanguageComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  user: MindsUser;
  settingsSubscription: Subscription;
  form;

  constructor(
    public service: LanguageService,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected settingsService: SettingsV2Service
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();

    this.form = new UntypedFormGroup({
      language: new UntypedFormControl(''),
    });

    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings: any) => {
        this.language.setValue(settings.language || 'en');
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

      const response: any = await this.settingsService.updateSettings(
        this.user.guid,
        this.form.value
      );
      if (response.status === 'success') {
        this.formSubmitted.emit({ formSubmitted: true });
        window.location.href = window.location.href;
      }
    } catch (e) {
      this.formSubmitted.emit({ formSubmitted: false, error: e });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  canSubmit(): boolean {
    return this.form.valid && !this.inProgress && this.form.dirty;
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

  get language() {
    return this.form.get('language');
  }
}
