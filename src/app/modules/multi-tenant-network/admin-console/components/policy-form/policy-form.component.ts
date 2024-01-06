import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { urlValidator } from '../../../../forms/url.validator';
import {
  MultiTenantConfig,
  SetMultiTenantConfigMutationVariables,
} from '../../../../../../graphql/generated.engine';
import {
  CustomPolicyId,
  CustomPolicyImplementation,
} from '../../../../policies/policies.types';
import {
  BehaviorSubject,
  Subscription,
  filter,
  lastValueFrom,
  take,
} from 'rxjs';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MultiTenantNetworkConfigService } from '../../../services/config.service';

/**
 * Allows tenant admins to manage their policies
 * (e.g. privacy, tos, community guidelines)
 *
 * Note: portions of this component are dependant on IDs lining up exactly with their corresponding config fieldnames. If we end up needing to tweak dsisplay names, we'll need to make some extra adjustmens
 */
@Component({
  selector: 'm-policy__form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.ng.scss'],
})
export class NetworkAdminConsolePolicyFormComponent
  implements OnInit, OnDestroy {
  @Input() policyId: CustomPolicyId;

  protected config: MultiTenantConfig;

  protected form: FormGroup;

  protected policyTextMaxLength: number = 65000;

  /** Whether loading is in progress. */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /** Whether saving is in progress. */
  public readonly savingInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /**
   * Allows us to use enum in the template
   */
  public CustomPolicyImplementation: typeof CustomPolicyImplementation = CustomPolicyImplementation;

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private toaster: ToasterService,
    private multiTenantConfigService: MultiTenantNetworkConfigService
  ) {}

  ngOnInit(): void {
    // Get configs from server to populate form
    this.subscriptions.push(
      this.multiTenantConfigService.config$
        .pipe(filter(Boolean), take(1))
        .subscribe((config: MultiTenantConfig): void => {
          this.config = config;
          this.setUpForm();
          this.loading$.next(false);
        })
    );
  }

  setUpForm(): void {
    const policyImplementation = this.getPolicyImplementation();
    const policyTextKey = this.policyId;
    const policyUrlKey = this.policyId + 'Url';

    const policyText =
      this.config[policyTextKey as keyof MultiTenantConfig] ?? '';
    const externalLink =
      this.config[policyUrlKey as keyof MultiTenantConfig] ?? '';

    this.form = this.fb.group({
      policyImplementation: [policyImplementation],
      policyText: [policyText],
      externalLink: [externalLink],
    });

    this.form.get('policyImplementation').valueChanges.subscribe(value => {
      if (value === CustomPolicyImplementation.CUSTOM) {
        this.form
          .get('policyText')
          .setValidators([
            Validators.required,
            Validators.maxLength(this.policyTextMaxLength),
          ]);
        this.form.get('externalLink').clearValidators();
      } else if (value === CustomPolicyImplementation.EXTERNAL) {
        this.form
          .get('externalLink')
          .setValidators([Validators.required, urlValidator()]);
        this.form.get('policyText').clearValidators();
      } else {
        this.form.get('policyText').clearValidators();
        this.form.get('externalLink').clearValidators();
      }

      this.form.get('policyText').updateValueAndValidity();
      this.form.get('externalLink').updateValueAndValidity();
    });
  }

  /**
   *
   * Deduce implementation from incoming configs
   */
  getPolicyImplementation(): CustomPolicyImplementation {
    const policy = this.policyId as keyof MultiTenantConfig;
    const policyUrl = (this.policyId + 'Url') as keyof MultiTenantConfig;

    if (this.config[policy] && !this.config[policyUrl]) {
      return CustomPolicyImplementation.CUSTOM;
    } else if (!this.config[policy] && this.config[policyUrl]) {
      return CustomPolicyImplementation.EXTERNAL;
    }

    return CustomPolicyImplementation.DEFAULT;
  }

  public async onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.savingInProgress$.next(true);

    // Determine what needs to be saved, based on the selected policyImplementation
    // Send a null value for the field(s) that are not related to the chosen implementation
    const policyImplementation = this.form.get('policyImplementation').value;
    const policyText = this.form.get('policyText').value;
    const externalLink = this.form.get('externalLink').value;

    let updatePayload = {};

    if (policyImplementation === CustomPolicyImplementation.CUSTOM) {
      updatePayload[this.policyId] = policyText;
      updatePayload[this.policyId + 'Url'] = null;
    } else if (policyImplementation === CustomPolicyImplementation.EXTERNAL) {
      updatePayload[this.policyId] = null;
      updatePayload[this.policyId + 'Url'] = externalLink;
    } else {
      // DEFAULT
      updatePayload[this.policyId] = null;
      updatePayload[this.policyId + 'Url'] = null;
    }

    try {
      const success: boolean = await lastValueFrom(
        this.multiTenantConfigService.updateConfig(
          updatePayload as SetMultiTenantConfigMutationVariables
        )
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

    this.toaster.success('Changes saved');

    // ojm make the un-used field null
    this.form.markAsPristine();
  }

  get policyName(): string {
    return this.policyId.replace(/([A-Z])/g, ' $1').toLowerCase(); // Convert camelCase to normal text
  }

  get showDefaultLink(): boolean {
    return (
      this.form.get('policyImplementation').value ===
      CustomPolicyImplementation.DEFAULT
    );
  }

  get showPolicyText(): boolean {
    return (
      this.form.get('policyImplementation').value ===
      CustomPolicyImplementation.CUSTOM
    );
  }

  get showExternalLink(): boolean {
    return (
      this.form.get('policyImplementation').value ===
      CustomPolicyImplementation.EXTERNAL
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
