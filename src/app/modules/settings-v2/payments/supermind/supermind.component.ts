import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ToasterService } from '../../../../common/services/toaster.service';
import { SettingsV2SupermindService } from './supermind.component.service';
import {
  SupermindSettings,
  SupermindSettingsGetApiResponse,
  SupermindSettingsPostApiResponse,
} from './supermind.types';

/**
 * Settings page for Supermind.
 */
@Component({
  selector: 'm-settingsV2__supermind',
  templateUrl: './supermind.component.html',
  styleUrls: ['./supermind.component.ng.scss'],
})
export class SettingsV2SupermindComponent implements OnInit, OnDestroy {
  // Form group.
  public form: UntypedFormGroup;

  // When loading is in progress.
  public readonly loadingInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  // When saving/updating is in progress.
  public readonly savingInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // Minimum thresholds for cash and tokens.
  public minThresholds: SupermindSettings;

  // Subscriptions.
  private supermindSettingsSubscription: Subscription;
  private supermindSettingsUpdate: Subscription;

  constructor(
    private supermindService: SettingsV2SupermindService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.minThresholds = this.supermindService.getConfig().min_thresholds;
    this.setupFormGroup();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    if (this.supermindSettingsSubscription) {
      this.supermindSettingsSubscription.unsubscribe();
    }
    if (this.supermindSettingsUpdate) {
      this.supermindSettingsUpdate.unsubscribe();
    }
  }

  /**
   * Whether form can be submitted.
   * @returns { boolean } true if form can be submitted.
   */
  public canSubmit(): boolean {
    return !Boolean(
      this.getFormErrors('min_cash') ||
        this.getFormErrors('min_offchain_tokens')
    );
  }

  /**
   * Get validation errors from form.
   * @param { string } formControlKey - key for form control.
   * @returns { ValidationErrors } collection of validation errors.
   */
  public getFormErrors(formControlKey: string): ValidationErrors {
    return this.form.get(formControlKey).errors;
  }

  /**
   * Save settings.
   * @returns { void }
   */
  public save(): void {
    this.savingInProgress$.next(true);
    this.supermindSettingsUpdate = this.supermindService
      .updateSettings$(this.buildPayload())
      .subscribe((response: SupermindSettingsPostApiResponse) => {
        this.savingInProgress$.next(false);
        if (response) {
          this.toaster.success('Settings saved');
        }
      });
  }

  /**
   * Setup form group.
   * @returns { void }
   */
  private setupFormGroup(): void {
    const decimalPlaceValidator: ValidatorFn =
      Validators.pattern(/^\d+\.?\d{0,2}$/);

    this.form = new UntypedFormGroup({
      min_offchain_tokens: new UntypedFormControl('', {
        validators: [
          Validators.required,
          Validators.min(this.minThresholds.min_offchain_tokens),
          decimalPlaceValidator,
        ],
      }),
      min_cash: new UntypedFormControl('', {
        validators: [
          Validators.required,
          Validators.min(this.minThresholds.min_cash),
          decimalPlaceValidator,
        ],
      }),
    });
  }

  /**
   * Setup subscriptions.
   * @returns { void }
   */
  private setupSubscriptions(): void {
    // Setup supermind settings subscription - update form values and set loading state to false on success.
    this.supermindSettingsSubscription =
      this.supermindService.settings$.subscribe(
        (settings: SupermindSettingsGetApiResponse) => {
          this.form.controls['min_offchain_tokens'].setValue(
            settings['min_offchain_tokens']
          );
          this.form.controls['min_cash'].setValue(settings['min_cash']);
          this.loadingInProgress$.next(false);
        }
      );
  }

  /**
   * Build payload.
   * @returns { SupermindSettings } returns supermind settings payload build from form.
   */
  private buildPayload(): SupermindSettings {
    return {
      min_offchain_tokens: this.form.controls['min_offchain_tokens'].value,
      min_cash: this.form.controls['min_cash'].value,
    };
  }
}
