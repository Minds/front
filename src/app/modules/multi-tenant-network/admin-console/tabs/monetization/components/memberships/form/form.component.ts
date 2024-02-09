import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  GetSiteMembershipGQL,
  GetSiteMembershipQuery,
  GroupNode,
  Role,
  SetSiteMembershipGQL,
  SiteMembership,
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
  UpdateSiteMembershipGQL,
} from '../../../../../../../../../graphql/generated.engine';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  distinctUntilChanged,
  filter,
  lastValueFrom,
  map,
  take,
} from 'rxjs';
import { MultiTenantRolesService } from '../../../../../../services/roles.service';
import { RoleId } from '../../../../roles/roles.types';
import { AutoCompleteEntityTypeEnum } from '../../../../../../../../common/components/forms/autocomplete-entity-input/autocomplete-entity-input.component';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../../../../../common/services/toaster.service';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client';
import { MindsGroup } from '../../../../../../../groups/v2/group.model';
import { MembershipsCountService } from '../../../../../../../memberships/services/membership-count.service';

/**
 * Form for creating and editing membership details.
 */
@Component({
  selector: 'm-networkAdminMonetization__membershipForm',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.ng.scss'],
})
export class NetworkAdminMonetizationMembershipFormComponent
  implements OnInit, OnInit, CanDeactivate<any> {
  /** Enum for use in template. */
  public readonly SiteMembershipPricingModelEnum: typeof SiteMembershipPricingModelEnum = SiteMembershipPricingModelEnum;

  /** Enum for use in template. */
  public readonly SiteMembershipBillingPeriodEnum: typeof SiteMembershipBillingPeriodEnum = SiteMembershipBillingPeriodEnum;

  /** Enum for use in template. */
  public readonly AutoCompleteEntityTypeEnum: typeof AutoCompleteEntityTypeEnum = AutoCompleteEntityTypeEnum;

  /** Whether component can be considered initialized (may still have pending roles loading). */
  public readonly initialized$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** Whether the loading of roles is in progress. */
  public readonly loadingRolesInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Whether submission is in progress. */
  public readonly submitInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Currently selected groups. */
  public readonly selectedGroups$: BehaviorSubject<
    MindsGroup[]
  > = new BehaviorSubject<MindsGroup[]>([]);

  /** All roles to be selectable. */
  public readonly roles$: Observable<Role[]> = this.rolesService.allRoles$.pipe(
    map((roles: Role[]): Role[] => {
      return roles?.length
        ? roles.filter(
            (role: Role) => ![RoleId.OWNER, RoleId.DEFAULT].includes(role.id)
          )
        : [];
    })
  );

  /** Currently selected group guids. */
  public readonly selectedGroupGuids$: Observable<
    string[]
  > = this.selectedGroups$.pipe(
    map((groups: MindsGroup[]): string[] =>
      groups.map((group: MindsGroup): string => group?.guid)
    )
  );

  /** Form group for membership details. */
  public formGroup: FormGroup;

  /** Whether component is in edit mode. */
  public editMode: boolean = false;

  /** Preloaded membership details for edit mode. */
  private preloadedSiteMembership: SiteMembership = null;

  /** Subscriptions array. */
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private rolesService: MultiTenantRolesService,
    private getSiteMembershipGQL: GetSiteMembershipGQL,
    private setSiteMembershipGQL: SetSiteMembershipGQL,
    private updateSiteMembershipGQL: UpdateSiteMembershipGQL,
    private membershipCountService: MembershipsCountService,
    private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    // if in edit mode, preload the existing membership that we are editing.
    if (
      this.route.snapshot.data['editMode'] &&
      this.route.snapshot.params['guid']
    ) {
      this.editMode = true;

      this.preloadedSiteMembership = await this.loadMembershipFromMembershipGuid(
        this.route.snapshot.params['guid']
      );
    }

    this.initFormGroup();

    if (this.preloadedSiteMembership?.groups) {
      this.initGroups();
    }

    this.initialized$.next(true);

    this.initRoles();
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription?.unsubscribe();
    }
  }

  canDeactivate(): boolean | Promise<boolean> {
    return this.formGroup && this.formGroup.touched && this.formGroup.dirty
      ? confirm('Are you sure? Your changes will be lost')
      : true;
  }

  /**
   * Name form control getter.
   * @returns { AbstractControl<string> } - Name form control.
   */
  get nameFormControl(): AbstractControl<string> {
    return this.formGroup.get('name') ?? null;
  }

  /**
   * Description form control getter.
   * @returns { AbstractControl<string> } - Description form control.
   */
  get descriptionFormControl(): AbstractControl<string> {
    return this.formGroup.get('description') ?? null;
  }

  /**
   * Current group selection form control getter.
   * @returns { AbstractControl<MindsGroup> } - Current group selection form control.
   */
  get currentGroupSelectionFormControl(): AbstractControl<MindsGroup> {
    return this.formGroup.get('currentGroupSelection') ?? null;
  }

  /**
   * Price form control getter.
   * @returns { AbstractControl<number> } - Price form control.
   */
  get priceFormControl(): AbstractControl<number> {
    return this.formGroup.get('price') ?? null;
  }

  /**
   * Pricing model form control getter.
   * @returns { AbstractControl<SiteMembershipPricingModelEnum> } - Pricing model form control.
   */
  get pricingModelFormControl(): AbstractControl<
    SiteMembershipPricingModelEnum
  > {
    return this.formGroup.get('pricingModel') ?? null;
  }

  /**
   * Billing period form control getter.
   * @returns { AbstractControl<SiteMembershipBillingPeriodEnum> } - Billing period form control.
   */
  get billingPeriodFormControl(): AbstractControl<
    SiteMembershipBillingPeriodEnum
  > {
    return this.formGroup.get('billingPeriod') ?? null;
  }

  /**
   * Get role label by role id.
   * @param { RoleId } roleId - Role id.
   * @returns { string } - Role label.
   */
  public getRoleLabelByRoleId(roleId: RoleId): string {
    return this.rolesService.getLabelByRoleId(roleId);
  }

  /**
   * Get role icon by role id.
   * @param { RoleId } roleId - Role id.
   * @returns { string } - Role icon.
   */
  public getRoleIconByRoleId(roleId: RoleId): string {
    return this.rolesService.getIconByRoleId(roleId);
  }

  /**
   * Handles toggling of selection of a role by inverting form control value.
   * @param { RoleId } roleId - Role id.
   * @returns { void }
   */
  public onRoleToggle(role: Role): void {
    const formControl: AbstractControl<boolean> = this.formGroup.get(
      'user_role:' + role.name
    );
    formControl.setValue(!formControl.value);
  }

  /**
   * Handles click on radio button container.
   * @param { SiteMembershipPricingModelEnum } pricingModel - Pricing model.
   * @returns { void }
   */
  public onRadioButtonContainerClick(
    pricingModel: SiteMembershipPricingModelEnum
  ): void {
    if (this.editMode) return;
    this.pricingModelFormControl.setValue(pricingModel);
    this.pricingModelFormControl.markAsDirty();
  }

  /**
   * Removes group from selected groups.
   * @param { MindsGroup } group - Group to remove.
   * @returns { void }
   */
  public removeGroup(group: MindsGroup): void {
    if (!group || !group.guid) return;

    const currentlySelectedGroups: MindsGroup[] = this.selectedGroups$.getValue();

    this.selectedGroups$.next(
      currentlySelectedGroups.filter((selectedGroup: MindsGroup): boolean => {
        return selectedGroup.guid !== group.guid;
      })
    );

    this.formGroup.markAsDirty();
    this.formGroup.markAsTouched();
  }

  /**
   * Handles form submission (create or edit).
   * @returns { Promise<void> }
   */
  public async onSubmit(): Promise<void> {
    if (!this.formGroup.valid) {
      this.toasterService.error('You have entered invalid values');
      return;
    }

    if (!this.editMode) {
      await this.createMembership();
    } else {
      await this.editMembership(this.preloadedSiteMembership.membershipGuid);
    }
  }

  /**
   * Handles creation of membership.
   * @returns { Promise<void> }
   */
  private async createMembership(): Promise<void> {
    this.submitInProgress$.next(true);

    try {
      const response = await lastValueFrom(
        this.setSiteMembershipGQL.mutate({
          membershipName: this.nameFormControl.value,
          membershipDescription: this.descriptionFormControl.value,
          membershipPricingModel: this.pricingModelFormControl.value,
          membershipPriceInCents: Math.round(
            (Math.abs(this.priceFormControl.value) / 100) * 10000
          ),
          membershipBillingPeriod: this.billingPeriodFormControl.value,
          groups: this.selectedGroups$
            .getValue()
            .map((group: MindsGroup) => group.guid),
          roles: this.getSelectedRoleIds(),
        })
      );

      if (response?.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (!Boolean(response?.data?.siteMembership)) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }

      this.toasterService.success('Membership successfully saved');
      this.formGroup.markAsUntouched();
      this.formGroup.markAsPristine();
      this.membershipCountService.incrementMembershipCount();
      this.router.navigateByUrl('/network/admin/monetization/memberships');
    } catch (e) {
      this.toasterService.error(e);
    } finally {
      this.submitInProgress$.next(false);
    }
  }

  /**
   * Handles editing of membership.
   * @param { string } membershipGuid - guid of the membership that we are editing.
   * @returns { Promise<void> }
   */
  private async editMembership(membershipGuid: string): Promise<void> {
    this.submitInProgress$.next(true);

    try {
      const response = await lastValueFrom(
        this.updateSiteMembershipGQL.mutate({
          membershipGuid: membershipGuid,
          membershipName: this.nameFormControl.value,
          membershipDescription: this.descriptionFormControl.value,
          groups: this.selectedGroups$
            .getValue()
            .map((group: MindsGroup) => group.guid),
          roles: this.getSelectedRoleIds(),
        })
      );

      if (response.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (!Boolean(response.data?.updateSiteMembership)) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }

      this.toasterService.success('Membership successfully edited');
      this.formGroup.markAsUntouched();
      this.formGroup.markAsPristine();
      this.router.navigateByUrl('/network/admin/monetization/memberships');
    } catch (e) {
      this.toasterService.error(e);
    } finally {
      this.submitInProgress$.next(false);
    }
  }

  /**
   * Loads membership from membership guid.
   * @param { string } membershipGuid - Membership guid.
   * @returns { Promise<SiteMembership> } - Loaded membership.
   */
  private async loadMembershipFromMembershipGuid(
    membershipGuid: string
  ): Promise<SiteMembership> {
    try {
      const response: ApolloQueryResult<GetSiteMembershipQuery> = await lastValueFrom(
        this.getSiteMembershipGQL.fetch({
          membershipGuid: membershipGuid,
        })
      );

      if (!Boolean(response.data?.siteMembership)) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }

      if (response.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      return response.data.siteMembership as SiteMembership;
    } catch (e) {
      console.error(e);
      this.toasterService.error(e);
      this.router.navigateByUrl('/network/admin/monetization/memberships');
      return;
    }
  }

  /**
   * Initializes form group and sets up relevant subscriptions.
   * @returns { void }
   */
  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl<string>(
        this.preloadedSiteMembership?.membershipName ?? '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]
      ),
      description: new FormControl<string>(
        this.preloadedSiteMembership?.membershipDescription ?? '',
        [Validators.minLength(0), Validators.maxLength(5000)]
      ),
      pricingModel: new FormControl<SiteMembershipPricingModelEnum>(
        this.preloadedSiteMembership?.membershipPricingModel ??
          SiteMembershipPricingModelEnum.Recurring,
        [Validators.required]
      ),
      price: new FormControl<number>(
        this.preloadedSiteMembership?.membershipPriceInCents
          ? this.preloadedSiteMembership?.membershipPriceInCents / 100
          : 9.99,
        [Validators.required, Validators.min(0.01), Validators.max(999999)]
      ),
      billingPeriod: new FormControl<SiteMembershipBillingPeriodEnum>(
        this.preloadedSiteMembership?.membershipBillingPeriod ??
          SiteMembershipBillingPeriodEnum.Monthly,
        [Validators.required]
      ),
      currentGroupSelection: new FormControl<MindsGroup>(null),
    });

    if (this.editMode) {
      this.pricingModelFormControl.disable();
      this.priceFormControl.disable();
      this.billingPeriodFormControl.disable();

      this.formGroup.markAsUntouched();
      this.formGroup.markAsPristine();
    }

    this.subscriptions.push(
      this.priceFormControl.valueChanges.subscribe((value: number): void => {
        if (!value && value !== 0) {
          return;
        }

        let splitValue: string[] = value?.toString().split('.') ?? [];

        if ((splitValue?.[1]?.length ?? 0) > 2) {
          this.priceFormControl.setValue(Math.floor(value * 100) / 100);
        }
      }),
      this.currentGroupSelectionFormControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((group: MindsGroup): void => {
          if (!group || !group.name) return;
          this.currentGroupSelectionFormControl.markAsUntouched();
          this.currentGroupSelectionFormControl.markAsPristine();
          this.addGroup(group);
        })
    );
  }

  /**
   * Initializes groups.
   * @returns { void }
   */
  private initGroups(): void {
    let preloadedSiteMembershipGroups: MindsGroup[] = null;

    if (this.preloadedSiteMembership?.groups) {
      preloadedSiteMembershipGroups = this.preloadedSiteMembership?.groups
        .map(
          (group: GroupNode): MindsGroup => {
            try {
              return JSON.parse(group.legacy) ?? null;
            } catch (e) {
              console.error(e);
            }
          }
        )
        .filter(Boolean);
    }

    this.selectedGroups$.next(preloadedSiteMembershipGroups ?? []);
  }

  /**
   * Initializes roles.
   * @returns { void }
   */
  private initRoles(): void {
    if (!this.rolesService.allRoles$.getValue()?.length) {
      this.loadingRolesInProgress$.next(true);
      this.rolesService.fetchRolesAndPermissions();
    }
    this.subscriptions.push(
      this.roles$
        .pipe(
          filter((roles: Role[]): boolean => Boolean(roles?.length)),
          take(1)
        )
        .subscribe((roles: Role[]): void => {
          let preloadedRoleIds: number[] = null;
          if (this.preloadedSiteMembership?.roles) {
            preloadedRoleIds = this.preloadedSiteMembership.roles.map(
              (role: Role) => role.id
            );
          }

          for (let role of roles) {
            const initialValue: boolean =
              (preloadedRoleIds && preloadedRoleIds.includes(role.id)) ?? false;
            this.formGroup.addControl(
              `user_role:${role.name}`,
              new FormControl(initialValue)
            );
          }

          this.loadingRolesInProgress$.next(false);
        })
    );
  }

  /**
   * Gets selected role ids.
   * @returns { RoleId[] } - Selected role ids.
   */
  private getSelectedRoleIds(): RoleId[] {
    let selectedRoleIds: RoleId[] = [];

    for (let controlName of Object.keys(this.formGroup.controls)) {
      if (
        controlName.startsWith('user_role') &&
        this.formGroup.get(controlName).value
      ) {
        selectedRoleIds.push(RoleId[controlName.split(':')[1]]);
      }
    }

    return selectedRoleIds;
  }

  /**
   * Adds group to selected groups.
   * @param { MindsGroup } newGroup - Group to add.
   * @returns { void }
   */
  private addGroup(newGroup: MindsGroup): void {
    const currentlySelectedGroups: MindsGroup[] = this.selectedGroups$.getValue();

    const alreadyAdded: boolean =
      currentlySelectedGroups.filter(
        (group: MindsGroup): boolean => group.guid === newGroup.guid
      )?.length > 0;

    if (alreadyAdded) {
      this.toasterService.warn('You have already added this group');
    } else {
      this.selectedGroups$.next([...currentlySelectedGroups, newGroup]);
      this.formGroup.markAsDirty();
      this.formGroup.markAsTouched();
    }
  }
}
