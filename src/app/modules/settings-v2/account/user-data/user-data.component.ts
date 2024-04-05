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
  FormGroup,
  FormControl,
} from '@angular/forms';

import { Session } from '../../../../services/session';
import { Subscription, firstValueFrom } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';

import { SettingsV2Service } from '../../settings-v2.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { AnalyticsService } from '../../../../services/analytics';
import { DeletePostHogPersonGQL } from '../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * Setting that controls whether videos in your feed play automatically.
 */
@Component({
  selector: 'm-settingsV2__userData',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2UserDataComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  inProgress: boolean = false;
  user: MindsUser;

  // The form holding the checkbox
  form: FormGroup;

  // Subscription for tracking form changes
  formChangeSubscription: Subscription;

  constructor(
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected settingsService: SettingsV2Service,
    protected configsService: ConfigsService,
    protected analyticsService: AnalyticsService,
    protected toasterServer: ToasterService,
    protected deletePostHogPersonGql: DeletePostHogPersonGQL
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.form = new FormGroup({
      optOut: new FormControl(this.configsService.get('posthog')['opt_out']),
    });

    /**
     * Whenever the form changes, send an update to the server
     */
    this.formChangeSubscription = this.form.valueChanges.subscribe(() => {
      this.submit();
    });

    this.detectChanges();
  }

  /**
   * Submits the change
   */
  async submit() {
    if (this.form.pristine) {
      return;
    }

    try {
      this.inProgress = true;
      this.detectChanges();

      const response: any = await this.settingsService.updateSettings(
        this.user.guid,
        {
          opt_out_analytics: this.optOut.value,
        }
      );

      if (response.status !== 'success') {
        throw response.message;
      }

      this.formSubmitted.emit({ formSubmitted: true });

      if (this.optOut.value) {
        this.analyticsService.setOptOut(this.optOut.value);
        this.session.loggedinEmitter.emit(true); // Triggers analaytics to refresh state
      } else {
        // Refresh the page to reboot analytics
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (e) {
      this.form.reset({
        optOut: !this.optOut.value,
      });
      this.formSubmitted.emit({ formSubmitted: false, error: e });
      this.detectChanges();
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  public async deleteData() {
    try {
      await firstValueFrom(this.deletePostHogPersonGql.mutate());
      this.toasterServer.success(
        'Your data is queued for deletion. Thjis may take up to 7 days.'
      );
    } catch (err) {
      this.toasterServer.warn(
        'We did not find any data for your user to delete.'
      );
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.formChangeSubscription?.unsubscribe();
  }

  get optOut() {
    return this.form.get('optOut');
  }
}
