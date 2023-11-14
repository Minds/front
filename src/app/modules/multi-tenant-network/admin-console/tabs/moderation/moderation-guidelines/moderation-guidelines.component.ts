import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import {
  BehaviorSubject,
  Subscription,
  filter,
  lastValueFrom,
  take,
} from 'rxjs';
import { MultiTenantNetworkConfigService } from '../../../../services/config.service';
import { MultiTenantConfig } from '../../../../../../../graphql/generated.engine';

/**
 * Network admin console  guidelines subsection.
 * Allows a user to configure the community guidelines for a network.
 */
@Component({
  selector: 'm-networkAdminConsole__moderationGuidelines',
  templateUrl: './moderation-guidelines.component.html',
  styleUrls: [
    './moderation-guidelines.component.ng.scss',
    '../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleModerationGuidelinesComponent
  implements OnInit, OnDestroy {
  /** Whether loading is in progress. */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /** Whether saving is in progress. */
  public readonly savingInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Form group. */
  public formGroup: FormGroup;

  // subscriptions
  private submitDataSubscription: Subscription;
  private configLoadSubscription: Subscription;

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService
  ) {
    this.formGroup = this.formBuilder.group({
      communityGuidelines: new FormControl<string>('', [
        Validators.maxLength(65000),
      ]),
    });
  }

  ngOnInit(): void {
    // setup initial form values based on server response / defaults.
    this.configLoadSubscription = this.multiTenantConfigService.config$
      .pipe(filter(Boolean), take(1))
      .subscribe((config: MultiTenantConfig): void => {
        this.communityGuidelinesFormControl.setValue(
          config?.communityGuidelines ?? ''
        );
        this.loading$.next(false);
      });
  }

  ngOnDestroy(): void {
    this.submitDataSubscription?.unsubscribe();
    this.configLoadSubscription?.unsubscribe();
  }

  /**
   * Form control for communityGuidelines.
   * @returns { AbstractControl<string> } form control for communityGuidelines.
   */
  get communityGuidelinesFormControl(): AbstractControl<string> {
    return this.formGroup.get('communityGuidelines');
  }

  /**
   * Submits changes to server.
   * @returns { Promise<void> }
   */
  public async onSubmit(): Promise<void> {
    if (!this.communityGuidelinesFormControl.dirty) {
      this.toaster.error('There are no changes to save');
      return;
    }

    this.savingInProgress$.next(true);

    try {
      const success: boolean = await lastValueFrom(
        this.multiTenantConfigService.updateConfig({
          communityGuidelines: this.communityGuidelinesFormControl.value,
        })
      );

      if (!success) {
        throw new Error('An error occurred whilst saving');
      }
    } catch (e) {
      console.error(e);
      this.toaster.error(e?.message ?? 'An unknown error has occurred');
      this.savingInProgress$.next(false);
      return;
    }

    this.savingInProgress$.next(false);

    this.toaster.success(
      this.communityGuidelinesFormControl.value === ''
        ? 'Network community guidelines removed'
        : 'Network community guidelines updated'
    );

    this.formGroup.markAsPristine();
  }
}
