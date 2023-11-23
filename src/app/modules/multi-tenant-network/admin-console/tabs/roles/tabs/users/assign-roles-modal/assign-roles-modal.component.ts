import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import {
  Role,
  UserRoleEdge,
} from '../../../../../../../../../graphql/generated.engine';
import { MultiTenantRolesService } from '../../../../../../services/roles.service';
import { Subscription } from 'rxjs';
import { RoleId } from '../../../roles.types';
import { ToasterService } from '../../../../../../../../common/services/toaster.service';
import { Session } from '../../../../../../../../services/session';
import { ModalService } from '../../../../../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../../../../../modals/confirm-v2/confirm.component';

export type AssignRolesModalInputParams = {
  userWithRoles: UserRoleEdge;
  onRoleChange: (updatedUserWithRoles: UserRoleEdge) => void;
};

/**
 * Modal for assigning roles to a user
 */
@Component({
  selector: 'm-networkAdminConsole__assignRolesModal',
  templateUrl: './assign-roles-modal.component.html',
  styleUrls: ['./assign-roles-modal.component.ng.scss'],
})
export class AssignRolesModalComponent implements OnInit, OnDestroy {
  public userWithRoles: UserRoleEdge;

  /**
   * All the available roles
   */
  protected allRoles: Role[];

  /**
   * The logged in user's roles
   */
  protected loggedInUserRoles: Role[];

  private subscriptions: Subscription[] = [];

  /**
   * Role Change function
   * @param { UserRoleEdge } updatedUserWithRoles - user whose roles changed
   * @returns { void }
   */
  onRoleChange: (updatedUserWithRoles: UserRoleEdge) => void = () => {};

  /**
   * Query reference for checking owner count
   * so we know whether an owner is allowed
   * to remove their own ownership
   */

  protected owners: UserRoleEdge[] = [];

  constructor(
    protected service: MultiTenantRolesService,
    private toaster: ToasterService,
    private session: Session,
    private modalService: ModalService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.allRoles$.subscribe(allRoles => {
        this.allRoles = allRoles;
      }),
      this.service.loggedInUserRoles$.subscribe(roles => {
        this.loggedInUserRoles = roles;
      }),
      this.service.owners$.subscribe(owners => {
        this.owners = owners;
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * If you're revoking your own ownership, confirm before toggling.
   * For everything else, toggle the role
   * @param roleId
   */
  confirmCheckboxClick(roleId: RoleId) {
    if (
      roleId === RoleId.OWNER &&
      this.userWithRoles.node.guid === this.session.getLoggedInUser().guid &&
      this.userHasRole(roleId)
    ) {
      // ojm this doesn't work - the checkbox un-checks even when you click the cancel button
      const modal = this.modalService.present(ConfirmV2Component, {
        data: {
          title: 'Are you sure',
          body:
            'Are you sure you want to revoke your owner role on this network? This action is irreversible, unless another owner grants you ownership again. Are you certain you want to proceed?',
          confirmButtonColor: 'red',
          onConfirm: () => {
            this.toggleRole(roleId);
            modal.dismiss();
          },
        },
        injector: this.injector,
      });
    } else {
      this.toggleRole(roleId);
    }
  }

  /**
   * Toggle a role on or off
   * @param roleId
   */
  async toggleRole(roleId: RoleId): Promise<void> {
    if (this.userHasRole(roleId)) {
      this.subscriptions.push(
        await this.service
          .unassignUserFromRole(this.userWithRoles, roleId)
          .subscribe(success => {
            if (success) {
              const updatedRoles = this.userWithRoles.roles.filter(
                role => role.id !== roleId
              );

              this.userWithRoles = {
                ...this.userWithRoles,
                roles: updatedRoles,
              };
              this.onRoleChange(this.userWithRoles);
            }
          })
      );
    } else {
      this.subscriptions.push(
        await this.service
          .assignUserToRole(this.userWithRoles, roleId)
          .subscribe(success => {
            if (success) {
              const addedRole = this.allRoles.find(role => role.id === roleId);

              if (!addedRole) {
                return;
              }

              // ojm sometimes this isn't working "Cannot add property x, object is not extensible"
              this.userWithRoles.roles.push(addedRole);
              // Keep the roles in decreasing order of id
              this.userWithRoles.roles.sort((a, b) => b.id - a.id);
              this.onRoleChange(this.userWithRoles);
            }
          })
      );
    }

    /**
     * Refresh list of owners
     */
    if (roleId === RoleId.OWNER) {
      this.service.fetchOwners();
    }
  }

  /**
   * Called when a checkbox is clicked
   * If the checkbox was disabled, show a toaster
   */
  clickedCheckbox(roleId: RoleId, enabled: boolean): void {
    if (enabled) {
      return;
    }

    /**
     * Show different toasts explaining why they can't click an owner checkbox
     */
    if (roleId === RoleId.OWNER) {
      if (!this.loggedInUserRoles.some(role => role.id === RoleId.OWNER)) {
        this.toaster.error(
          'Your user role is not permitted to edit the owner role'
        );
        return;
      } else if (this.owners.length < 2) {
        this.toaster.error(
          'You must grant the owner role to at least one other user before you can disable your ownership'
        );
      }
    }
  }

  /**
   * Gets checkbox value for role
   */
  userHasRole(roleId: RoleId): boolean {
    return this.userWithRoles.roles.some(role => role.id === roleId);
  }

  /**
   * Should the logged in user be able to click the checkbox?
   * @param checkboxRoleId
   */
  isCheckboxEnabled(checkboxRoleId: RoleId) {
    if (checkboxRoleId === RoleId.OWNER) {
      // We have to check some things first to see if they can toggle owner role
      if (!this.loggedInUserRoles.some(role => role.id === RoleId.OWNER)) {
        // Only owners can toggle owner roles
        return false;
      }

      if (
        this.userWithRoles.node.guid === this.session.getLoggedInUser().guid &&
        this.userHasRole(checkboxRoleId) &&
        this.owners.length < 2
      ) {
        // The network needs at least one owner
        return false;
      }
    }
    return true;
  }

  /**
   * Set modal data.
   * @param { AssignRolesModalInputParams } data - data for modal.
   * @returns { void }
   */
  public setModalData({
    userWithRoles,
    onRoleChange,
  }: AssignRolesModalInputParams): void {
    this.userWithRoles = userWithRoles;
    this.onRoleChange =
      onRoleChange ?? ((updatedUserWithRoles: UserRoleEdge) => {});
  }
}
