import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { MultiTenantDomainService } from '../../../../services/domain.service';

/**
 * Modal for editing the domain of a tenant site
 */
@Component({
  selector: 'm-networkAdminConsole__editDomainModal',
  templateUrl: './edit-domain-modal.component.html',
  styleUrls: ['./edit-domain-modal.component.ng.scss'],
})
export class NetworkAdminConsoleEditDomainModalComponent {
  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  /** Form group. */
  public formGroup: FormGroup;

  /** Whether saving is in progress. */
  public savingInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * If the changes were saved
   */
  saved: boolean = false;

  constructor(
    protected service: MultiTenantDomainService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService
  ) {
    this.formGroup = this.formBuilder.group({
      hostname: new FormControl<string>('', [
        Validators.required,
        this.urlValidator,
      ]),
    });
  }

  /**
   * Gets hostname form control.
   * @returns { AbstractControl<string, string> } hostname form control.
   */
  get hostnameFormControl(): AbstractControl<string, string> {
    return this.formGroup.get('hostname');
  }

  /**
   * Submits form.
   * @returns { Promise<void> }
   */
  public async onSubmit(): Promise<void> {
    if (!this.formGroup.valid) {
      return;
    }
    const hostname: string = this.hostnameFormControl.value;

    this.savingInProgress$.next(true);

    const success = await lastValueFrom(
      this.service.updateDomain({
        hostname: hostname,
      })
    );

    this.savingInProgress$.next(false);
    if (success) {
      this.saved = true;
    } else {
      this.toaster.error('Unable to submit changes, please try again later.');
      return;
    }

    this.hostnameFormControl.markAsPristine();
  }

  /**
   * Match a valid URL without requiring http or https
   * @param control
   */
  urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      // Return null for empty values (no validation error)
      return null;
    }

    // Regex pattern for domain validation
    const urlPattern = /^(?!.*\.\.)((?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{1,})$/i;

    if (!urlPattern.test(control.value)) {
      return {
        invalidUrl: true,
      };
    }

    // It's valid
    return null;
  }

  /**
   * Modal options
   * @param onDismissIntent
   */
  public setModalData({ onDismissIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
  }
}
