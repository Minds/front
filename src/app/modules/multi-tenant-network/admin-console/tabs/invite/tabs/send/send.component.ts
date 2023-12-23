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
import { BehaviorSubject, Observable, Subscription, filter, take } from 'rxjs';
import { RoleId } from '../../../roles/roles.types';
import { MultiTenantRolesService } from '../../../../../services/roles.service';
import { Role } from '../../../../../../../../graphql/generated.engine';

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

  // subscriptions
  private subscriptions: Subscription[] = [];

  private initialFormValues = {
    emails: '',
    bespokeMessage: '',
  };

  private initialRolesArray: boolean[];

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

          this.initialRolesArray = this.allRoles.map(role => {
            // Check if the role's id is equal to RoleId.DEFAULT
            return role.id === RoleId.DEFAULT;
          });

          this.formGroup = this.formBuilder.group({
            emails: new FormControl<string>(this.initialFormValues.emails, [
              Validators.required,
              Validators.minLength(5),
            ]),
            roles: this.formBuilder.array(
              this.initialRolesArray.map(value => new FormControl(value)),
              this.atLeastOneRoleSelectedValidator
            ),
            bespokeMessage: new FormControl<string>(
              this.initialFormValues.bespokeMessage,
              [Validators.maxLength(500)]
            ),
          });

          this.loading$.next(false);
        })
    );
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
  private resetForm(): void {
    this.formGroup.reset(this.initialFormValues);

    // After resetting the form, manually update the roles checkboxes
    const rolesFormArray = this.formGroup.get('roles') as FormArray;
    for (let i = 0; i < this.initialRolesArray.length; i++) {
      rolesFormArray.at(i).setValue(this.initialRolesArray[i]);
    }
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
   * Form control for bespoke message.
   * @returns { AbstractControl<string> } form control for bespoke message.
   */
  get bespokeMessage(): AbstractControl<string> {
    return this.formGroup.get('bespokeMessage');
  }
}
