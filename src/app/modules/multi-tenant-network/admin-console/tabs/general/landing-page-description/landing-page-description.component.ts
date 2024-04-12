import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MultiTenantNetworkConfigService } from '../../../../services/config.service';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import {
  BehaviorSubject,
  Subscription,
  filter,
  firstValueFrom,
  lastValueFrom,
  take,
} from 'rxjs';
import { MultiTenantConfig } from '../../../../../../../graphql/generated.engine';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

/**
 * Landing page description input area component. Allows an admin to
 * set their landing page description.
 */
@Component({
  selector: 'm-networkAdminConsole__landingPageDescription',
  templateUrl: './landing-page-description.component.html',
  styleUrls: ['./landing-page-description.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkAdminConsoleLandingPageDescriptionComponent
  implements OnInit, OnDestroy
{
  /** Form group. */
  protected formGroup: FormGroup;

  /** Whether saving is in progress. */
  protected savingInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Subscriptions to config load. */
  private configLoadSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      description: new FormControl<string>('', [Validators.maxLength(160)]),
    });

    this.configLoadSubscription = this.multiTenantConfigService.config$
      .pipe(filter(Boolean), take(1))
      .subscribe((config: MultiTenantConfig): void => {
        if (config.customHomePageDescription) {
          this.getDescriptionFormControl().setValue(
            config.customHomePageDescription
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.configLoadSubscription?.unsubscribe();
  }

  /**
   * Submit the form.
   * @returns { Promise<void> }
   */
  protected async onSubmit(): Promise<void> {
    this.savingInProgress$.next(true);
    const success: boolean = await lastValueFrom(
      this.multiTenantConfigService.updateConfig({
        customHomePageDescription: this.getDescriptionFormControl().value ?? '',
      })
    );
    this.savingInProgress$.next(false);

    if (success) {
      this.toaster.success('Landing page description updated successfully');
    } else {
      this.toaster.error('Failed to update landing page description');
    }
  }

  /**
   * Get the description form control.
   * @returns { AbstractControl<string> } The description form control.
   */
  protected getDescriptionFormControl(): AbstractControl<string> {
    return this.formGroup.get('description');
  }
}
