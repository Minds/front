import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MultiTenantNetworkConfigService } from '../../../services/config.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import {
  BehaviorSubject,
  Subscription,
  filter,
  lastValueFrom,
  take,
} from 'rxjs';
import { MultiTenantConfig } from '../../../../../../graphql/generated.engine';
import { MetaService } from '../../../../../common/services/meta.service';
import { ConfigsService } from '../../../../../common/services/configs.service';

/**
 * General settings tab for network admin console.
 */
@Component({
  selector: 'm-networkAdminConsole__general',
  templateUrl: './general.component.html',
  styleUrls: [
    './general.component.ng.scss',
    '../../stylesheets/console.component.ng.scss',
  ],
  host: { class: 'm-networkAdminConsole__container--noHorizontalPadding' },
})
export class NetworkAdminConsoleGeneralComponent implements OnInit, OnDestroy {
  /** Whether config is being loaded. */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /** Whether saving is in progress. */
  public savingInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Form group. */
  public formGroup: FormGroup;

  // subscriptions.
  private configLoadSubscription: Subscription;

  public tenantId: number;

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService,
    private metaService: MetaService,
    private configs: ConfigsService
  ) {
    this.formGroup = this.formBuilder.group({
      networkName: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
    });
    this.tenantId = this.configs.get('tenant_id');
  }

  ngOnInit(): void {
    // get config from service and update local state.
    this.configLoadSubscription = this.multiTenantConfigService.config$
      .pipe(filter(Boolean), take(1))
      .subscribe((config: MultiTenantConfig): void => {
        this.networkNameFormControl.setValue(config?.siteName ?? '');
        this.loading$.next(false);
      });
  }

  ngOnDestroy(): void {
    this.configLoadSubscription?.unsubscribe();
  }

  /**
   * Gets networkName form control.
   * @returns { AbstractControl<string, string> } networkName form control.
   */
  get networkNameFormControl(): AbstractControl<string, string> {
    return this.formGroup.get('networkName');
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

    const siteName: string = this.networkNameFormControl.value;

    this.savingInProgress$.next(true);
    const success = await lastValueFrom(
      this.multiTenantConfigService.updateConfig({
        siteName: siteName,
      })
    );

    this.savingInProgress$.next(false);
    if (!success) {
      this.toaster.error('Unable to submit changes, please try again later.');
      return;
    }

    // update local configs then reset meta-service so that
    // it can appropriately update.
    this.configs.set('site_name', siteName);
    this.metaService.reset();

    this.toaster.success('Successfully updated settings.');
    this.networkNameFormControl.markAsPristine();
  }
}
