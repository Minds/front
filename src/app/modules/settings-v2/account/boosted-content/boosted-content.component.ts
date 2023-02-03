import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Session } from '../../../../services/session';
import { SettingsV2Service } from '../../settings-v2.service';
import { Observable, Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { Storage } from '../../../../services/storage';

/**
 * Form for setting boost-related preferences
 */
@Component({
  selector: 'm-settingsV2__boostedContent',
  templateUrl: './boosted-content.component.html',
  styleUrls: ['./boosted-content.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2BoostedContentComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  init: boolean = false;
  inProgress: boolean = false;
  user;
  settingsSubscription: Subscription;

  form;
  initForm: any | null = null;
  formChanged: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef,
    public session: Session,
    protected settingsService: SettingsV2Service,
    private dialogService: DialogService,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.user = this.session.getLoggedInUser();

    this.form = new UntypedFormGroup({
      disabled_boost: new UntypedFormControl(''),
      boost_autorotate: new UntypedFormControl(''),
      boost_rating: new UntypedFormControl(''),
      liquidity_spot_opt_out: new UntypedFormControl(''),
    });

    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings: any) => {
        this.disabled_boost.setValue(settings.disabled_boost);
        this.boost_autorotate.setValue(settings.boost_autorotate);
        this.boost_rating.setValue(settings.boost_rating);
        this.liquidity_spot_opt_out.setValue(settings.liquidity_spot_opt_out);

        /**
         * Check that the settings$ have actually been loaded
         */
        if (!this.initForm && settings.guid) {
          this.initForm = JSON.parse(JSON.stringify(this.form.value));
        }

        this.init = true;
        this.detectChanges();
      }
    );

    this.form.valueChanges.subscribe(() => {
      this.formChanged =
        JSON.stringify(this.form.value) !== JSON.stringify(this.initForm);
      this.detectChanges();
    });

    this.detectChanges();
  }

  async submit() {
    if (!this.canSubmit()) {
      return;
    }
    this.inProgress = true;
    this.detectChanges();

    /**
     * Reset boost sidebar offset
     * when rating changes
     */
    if (this.boost_rating.value !== this.initForm.boost_rating) {
      this.storage.destroy('boost:offset:sidebar');
    }

    /**
     * Enable/disable boost goes to a different endpoint
     * than the other settings
     */

    if (this.disabled_boost.value !== this.initForm.disabled_boost) {
      if (this.disabled_boost.value) {
        await this.settingsService.hideBoost();
        this.user.disabled_boost = true;
      } else {
        await this.settingsService.showBoost();
        this.user.disabled_boost = false;
      }
    }

    try {
      const formValue = {
        boost_autorotate: this.boost_autorotate.value,
        boost_rating: this.boost_rating.value,
        liquidity_spot_opt_out: this.liquidity_spot_opt_out.value,
      };

      this.user.boost_autorotate = this.boost_autorotate.value;
      this.user.boost_rating = this.boost_rating.value;

      const response: any = await this.settingsService.updateSettings(
        this.user.guid,
        formValue
      );
      if (response.status === 'success') {
        this.formSubmitted.emit({ formSubmitted: true });
        this.form.markAsPristine();
        this.initForm = null;
      }
    } catch (e) {
      this.formSubmitted.emit({ formSubmitted: false, error: e });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  clickedDisableBoost($event: MouseEvent): void {
    if (!this.plus) {
      $event.stopPropagation();
      $event.preventDefault();
    }
  }

  canSubmit(): boolean {
    return !this.inProgress && !this.form.pristine && this.formChanged;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.pristine || !this.formChanged) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
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

  get disabled_boost() {
    return this.form.get('disabled_boost');
  }

  get boost_autorotate() {
    return this.form.get('boost_autorotate');
  }

  get boost_rating() {
    return this.form.get('boost_rating');
  }

  get liquidity_spot_opt_out() {
    return this.form.get('liquidity_spot_opt_out');
  }

  get plus(): boolean {
    return this.session.getLoggedInUser().plus;
  }
}
