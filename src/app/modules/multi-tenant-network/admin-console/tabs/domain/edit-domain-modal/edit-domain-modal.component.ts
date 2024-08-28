import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  lastValueFrom,
  map,
} from 'rxjs';
import { MultiTenantDomainService } from '../../../../services/domain.service';
import { GrowShrinkFast } from '../../../../../../animations';

/**
 * Modal for editing the domain of a tenant site
 */
@Component({
  selector: 'm-networkAdminConsole__editDomainModal',
  templateUrl: './edit-domain-modal.component.html',
  styleUrls: ['./edit-domain-modal.component.ng.scss'],
  animations: [GrowShrinkFast],
})
export class NetworkAdminConsoleEditDomainModalComponent {
  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  /** Form group. */
  public formGroup: FormGroup;

  /** Whether saving is in progress. */
  public savingInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Error text for hostname form control. */
  protected hostNameErrorText$: Observable<string>;

  /**
   * If the changes were saved
   */
  saved: boolean = false;

  constructor(
    protected service: MultiTenantDomainService,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      hostname: new FormControl<string>('', [
        Validators.required,
        this.notMindsDomainValidator,
        this.includesSubdomainValidator,
        this.urlValidator,
      ]),
    });

    /** Error text, debounced to be set when no events have been fired for the specified timespan. */
    this.hostNameErrorText$ =
      this.formGroup.controls.hostname.valueChanges.pipe(
        debounceTime(400),
        map((val: any): string => this.getFirstFormErrorText())
      );
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
      this.hostnameFormControl.markAsPristine();
    }
  }

  /**
   * Match a valid URL without requiring http or https
   * @param { AbstractControl } control - The control to validate.
   * @returns { ValidationErrors | null } - The validation error or null if valid.
   */
  private urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      // Return null for empty values (no validation error)
      return null;
    }

    // Regex pattern for domain validation
    const urlPattern =
      /^(?!.*\.\.)((?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{1,})$/i;

    if (!urlPattern.test(control.value)) {
      return {
        invalidUrl: true,
      };
    }

    // It's valid
    return null;
  }

  /**
   * Validates that a URL is 3 parts, seperated by periods.
   * @param { AbstractControl } control - The control to validate.
   * @returns { ValidationErrors | null } - The validation error or null if valid.
   */
  private includesSubdomainValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) {
      // Return null for empty values (no validation error)
      return null;
    }

    if (!/^([a-z0-9-]+\.){2,}\w+$/i.test(control.value)) {
      return {
        invalidSubdomain: true,
      };
    }

    // It's valid
    return null;
  }

  /**
   * Validates that a URL is not a Minds domain.
   * @param { ValidationErrors } control - The control to validate.
   * @returns { ValidationErrors | null } - The validation error or null if valid.
   */
  private notMindsDomainValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) {
      // Return null for empty values (no validation error)
      return null;
    }

    if (/(^|(\w+\.|^(http|https):\/\/))minds\.com/i.test(control.value)) {
      return {
        mindsDomain: true,
      };
    }

    // It's valid
    return null;
  }

  /**
   * Gets the first form error's text. This exists because we only want to show one error at a time.
   * @returns { string } - The error text.
   */
  private getFirstFormErrorText(): string {
    const errors: ValidationErrors = this.formGroup.controls.hostname.errors;

    if (errors) {
      if (errors.invalidUrl) {
        return $localize`:@@NETWORK_ADMIN_CONSOLE__EDIT_DOMAIN_MODAL__INVALID_DOMAIN:This is an invalid domain name.`;
      } else if (errors.mindsDomain) {
        return $localize`:@@NETWORK_ADMIN_CONSOLE__EDIT_DOMAIN_MODAL__USE_OWN_DOMAIN:Please use your own domain.`;
      } else if (errors.invalidSubdomain) {
        return $localize`:@@NETWORK_ADMIN_CONSOLE__EDIT_DOMAIN_MODAL__PLEASE_USE_SUBDOMAIN:Root (Apex) domains require a business plan and custom configuration. Please use a subdomain at this time.`;
      }
    }

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
