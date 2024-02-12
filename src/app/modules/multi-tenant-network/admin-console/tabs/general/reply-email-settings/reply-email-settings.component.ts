import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MultiTenantNetworkConfigService } from '../../../../services/config.service';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import {
  BehaviorSubject,
  Subscription,
  filter,
  lastValueFrom,
  take,
} from 'rxjs';
import { MultiTenantConfig } from '../../../../../../../graphql/generated.engine';

/**
 * Allows tenant admins to save a custom reply-to email address
 */
@Component({
  selector: 'm-networkAdminConsole__replyEmailSettings',
  templateUrl: './reply-email-settings.component.html',
  styleUrls: [
    './reply-email-settings.component.ng.scss',
    '../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleReplyEmailSettingsComponent
  implements OnInit, OnDestroy {
  /** Whether config is being loaded. */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /** Whether saving is in progress. */
  public savingInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** Form group. */
  public formGroup: FormGroup;

  // subscriptions.
  private configLoadSubscription: Subscription;

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService
  ) {
    this.formGroup = this.formBuilder.group({
      replyEmail: new FormControl('', [Validators.email]),
    });
  }

  ngOnInit(): void {
    // get config from service and update local state.
    this.configLoadSubscription = this.multiTenantConfigService.config$
      .pipe(filter(Boolean), take(1))
      .subscribe((config: MultiTenantConfig): void => {
        this.replyEmailFormControl.setValue(config?.replyEmail ?? '');
        this.loading$.next(false);
      });
  }

  ngOnDestroy(): void {
    this.configLoadSubscription?.unsubscribe();
  }

  /**
   * Gets replyEmail form control.
   * @returns { AbstractControl<string, string> } replyEmail form control.
   */
  get replyEmailFormControl(): AbstractControl<string, string> {
    return this.formGroup.get('replyEmail');
  }

  /**
   * Submits form.
   * @returns { Promise<void> }
   */
  public async onSubmit(): Promise<void> {
    if (!this.formGroup.valid) {
      this.toaster.error('Unable to submit changes, form is invalid');
      return;
    }

    const replyEmail: string = this.replyEmailFormControl.value;

    this.savingInProgress$.next(true);
    const success = await lastValueFrom(
      this.multiTenantConfigService.updateConfig({
        replyEmail: replyEmail,
      })
    );

    this.savingInProgress$.next(false);
    if (!success) {
      this.toaster.error('Unable to submit changes, please try again later.');
      return;
    }

    this.toaster.success('Updated reply-to email.');
    this.replyEmailFormControl.markAsPristine();
  }
}
