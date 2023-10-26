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
import { Subscription } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';

import { SettingsV2Service } from '../../settings-v2.service';

/**
 * Setting that controls whether videos in your feed play automatically.
 */
@Component({
  selector: 'm-settingsV2__autoplayVideos',
  templateUrl: './autoplay-videos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2AutoplayVideosComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  user: MindsUser;
  settingsSubscription: Subscription;
  form;

  constructor(
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected settingsService: SettingsV2Service
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.form = new UntypedFormGroup({
      autoplay_videos: new UntypedFormControl(''),
    });

    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings: any) => {
        this.autoplay_videos.setValue(!settings.disable_autoplay_videos);
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
        disable_autoplay_videos: !this.autoplay_videos.value,
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

  get autoplay_videos() {
    return this.form.get('autoplay_videos');
  }
}
