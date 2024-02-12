import { Component } from '@angular/core';
import { InviteService } from '../../../../../services/invite.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  distinctUntilChanged,
  filter,
  take,
} from 'rxjs';
import { RoleId } from '../../../roles/roles.types';
import { MultiTenantRolesService } from '../../../../../services/roles.service';
import { Role } from '../../../../../../../../graphql/generated.engine';
import { AutoCompleteEntityTypeEnum } from '../../../../../../../common/components/forms/autocomplete-entity-input/autocomplete-entity-input.component';
import { MindsGroup } from '../../../../../../groups/v2/group.model';

@Component({
  selector: 'm-networkAdminConsoleInvite__send',
  templateUrl: './send.component.html',
  styleUrls: [
    './send.component.ng.scss',
    '../../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleInviteSendComponent {
  /** Whether loading is in progress. */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /** Form group. */
  public formGroup: FormGroup;

  /** Role id enum for access in template.  */
  public readonly RoleId: typeof RoleId = RoleId;

  /** Whether saving is in progress. */
  public readonly savingInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /**
   * All of the user roles on the network
   */
  protected allRoles$: Observable<Role[]>;

  protected allRoles: Role[] = [];

  /** Enum of auto-completable entities to use in the template */
  public readonly AutoCompleteEntityTypeEnum: typeof AutoCompleteEntityTypeEnum = AutoCompleteEntityTypeEnum;

  // subscriptions
  private subscriptions: Subscription[] = [];

  private initialFormValues = {
    emails: '',
    bespokeMessage: '',
  };

  public initialRolesArray: boolean[];

  /**
   * The guids of the groups that are selected
   */
  selectedGroupGuids: string[] = [];

  constructor(
    protected service: InviteService,
    private rolesService: MultiTenantRolesService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.rolesService.allRoles$
        .pipe(
          filter(roles => roles && roles.length > 0),
          take(1)
        )
        .subscribe(roles => {
          this.allRoles = roles;
          this.initializeForm();

          this.loading$.next(false);
        })
    );
  }

  private initializeForm(): void {
    this.initialRolesArray = this.allRoles.map(
      role => role.id === RoleId.DEFAULT
    );

    this.formGroup = this.formBuilder.group({
      emails: new FormControl<string>(this.initialFormValues.emails, [
        Validators.required,
        Validators.minLength(5),
      ]),
      roles: this.formBuilder.array(
        this.initialRolesArray.map(value => new FormControl(value)),
        this.atLeastOneRoleSelectedValidator
      ),
      groupSelector: new FormControl<any>(''),
      groups: new FormControl<MindsGroup[]>([]),
      bespokeMessage: new FormControl<string>(
        this.initialFormValues.bespokeMessage,
        [Validators.maxLength(500)]
      ),
    });

    this.subscriptions.push(
      this.groupSelector.valueChanges
        .pipe(
          distinctUntilChanged(),
          filter(value => value !== null)
        )
        .subscribe(group => {
          // Clear the groupSelector after a group is selected
          if (group && typeof group !== 'string') {
            this.addGroupSelection(group);
          }
        }),
      this.groups.valueChanges.subscribe(groups => {
        this.selectedGroupGuids = groups.map(group => group.guid);
      })
    );
  }

  /**
   *Add a group to the array of groups when it's selected
   * @param group
   */
  addGroupSelection(group: MindsGroup): void {
    let currentGroups = this.groups.value;
    if (!currentGroups.some(g => g.guid === group.guid)) {
      currentGroups.push(group);
      this.groups.setValue(currentGroups);
    }
  }

  /**
   * Remove the group at this index from the selected groups array
   * @param index
   */
  removeGroup(index: number): void {
    const currentGroups = this.groups.value;
    currentGroups.splice(index, 1);
    this.groups.setValue([...currentGroups]);
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Submits changes to server.
   * @returns { void }
   */
  public async onSubmit(): Promise<void> {
    if (this.savingInProgress$.getValue()) {
      console.warn(
        'Attempted to submit invitation but saving already in progress'
      );
      return;
    }
    this.savingInProgress$.next(true);

    const formVals = this.formGroup.value;

    // Convert the FormArray roles into an array of checked role.ids
    formVals['roles'] = formVals['roles']
      .map((isChecked, index) => (isChecked ? this.allRoles[index]?.id : null))
      .filter(roleId => roleId !== null);

    // Provide an array of group guids
    formVals['groups'] = formVals['groups'].map(group => group.guid);

    delete formVals['groupSelector'];

    // Call the createInvite method and subscribe to the observable
    this.service.createInvite(formVals).subscribe(
      result => {
        if (result) {
          this.savingInProgress$.next(false);
          this.resetForm();
        }
      },
      error => {
        if (error?.errors?.[0] && error.errors[0].message) {
          this.toaster.error(error.errors[0].message);
        }
        console.error(error);
        this.savingInProgress$.next(false);
      }
    );
  }

  /**
   * Reset the form to initial values
   */
  resetForm(): void {
    this.formGroup.reset(this.initialFormValues);

    // After resetting the form, manually update the roles checkboxes
    const rolesFormArray = this.formGroup.get('roles') as FormArray;
    for (let i = 0; i < this.initialRolesArray.length; i++) {
      rolesFormArray.at(i).setValue(this.initialRolesArray[i]);
    }

    this.formGroup.get('groups').reset([]);
    this.formGroup.get('groupSelector').reset();
  }

  protected atLeastOneRoleSelectedValidator(
    control: FormArray
  ): { [key: string]: boolean } | null {
    const selectedRoles = control.controls.filter(
      (roleControl: FormControl) => roleControl.value === true
    );
    return selectedRoles.length === 0 ? { atLeastOneRoleSelected: true } : null;
  }

  /**
   * Form control for emails.
   * @returns { AbstractControl<string> } form control for emails.
   */
  get emails(): AbstractControl<string> {
    return this.formGroup.get('emails');
  }

  /**
   * Form control for roles.
   * @returns { AbstractControl<RoleId[]> } form control for roles.
   */
  get roles(): AbstractControl<RoleId[]> {
    return this.formGroup.get('roles');
  }

  /**
   * Form control for group selector
   * @returns { AbstractControl<MindsGroup> } form control for group selector
   */
  get groupSelector(): AbstractControl<MindsGroup> {
    return this.formGroup.get('groupSelector');
  }

  /**
   * Form control for groups
   * @returns { AbstractControl<MindsGroup[]> } form control for groups.
   */
  get groups(): AbstractControl<MindsGroup[]> {
    return this.formGroup.get('groups');
  }

  /**
   * Form control for bespoke message.
   * @returns { AbstractControl<string> } form control for bespoke message.
   */
  get bespokeMessage(): AbstractControl<string> {
    return this.formGroup.get('bespokeMessage');
  }
}
