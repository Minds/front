import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '../../../../../../../common/common.module';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import { filter, Subscription, take } from 'rxjs';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { HeadElementInjectorService } from '../../../../../../../common/services/head-element-injector.service';
import { MultiTenantConfig } from '../../../../../../../../graphql/generated.engine';
import { MultiTenantCustomScriptInputService } from '../../../../../services/custom-script-input.service';

/**
 * Component that allows admins to add custom scripts / other elements
 * to their network via the document head.
 */
@Component({
  selector: 'm-networkAdminCustomScript',
  styleUrls: [
    './custom-script.component.ng.scss',
    '../../../../stylesheets/console.component.ng.scss',
  ],
  templateUrl: './custom-script.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class NetworkAdminCustomScriptComponent implements OnInit, OnDestroy {
  /** Form group for the custom script textarea. */
  protected formGroup: FormGroup;

  /** Whether saving is in progress. */
  protected inProgress: WritableSignal<boolean> = signal(false);

  /** Subscription to the tenant config. */
  private tenantConfigSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private tenantConfigService: MultiTenantNetworkConfigService,
    private customScriptInputService: MultiTenantCustomScriptInputService,
    private headElementInjectorService: HeadElementInjectorService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      customScript: new FormControl('', [Validators.maxLength(50000)]),
    });

    this.load();
  }

  ngOnDestroy(): void {
    this.tenantConfigSubscription?.unsubscribe();
  }

  /**
   * Loads tenant config and patches any existing custom script
   * value into the textarea.
   * @returns { void }
   */
  protected load(): void {
    this.tenantConfigSubscription = this.tenantConfigService.config$
      .pipe(filter(Boolean), take(1))
      .subscribe((config: MultiTenantConfig): void => {
        if (config?.customScript) {
          this.formGroup.patchValue({
            customScript: config.customScript || '',
          });
        }
      });
  }

  /**
   * Saves the custom script.
   * @returns { Promise<void> }
   */
  protected async save(): Promise<void> {
    if (this.inProgress()) {
      return;
    }

    const customScript: string = this.formGroup.value?.customScript;

    if (!this.formGroup.valid) {
      this.toaster.warn('Please enter a valid custom script');
      return;
    }

    this.inProgress.set(true);

    try {
      const success: boolean =
        await this.customScriptInputService.updateCustomScript(customScript);

      if (!success) {
        throw new Error('Failed to save custom script');
      }

      this.toaster.success('Custom script saved successfully');
      this.formGroup.markAsPristine();
      this.headElementInjectorService.injectFromString(customScript);
    } catch (e) {
      console.error('Error saving custom script', e);
      this.toaster.error('Error saving custom script');
    } finally {
      this.inProgress.set(false);
    }
  }
}
