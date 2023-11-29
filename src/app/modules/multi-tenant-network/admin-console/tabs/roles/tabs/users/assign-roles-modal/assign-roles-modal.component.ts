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
import { Router } from '@angular/router';

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

  constructor(
    protected service: MultiTenantRolesService,
    private toaster: ToasterService,
    private session: Session,
    private modalService: ModalService,
    private injector: Injector,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.allRoles$.subscribe(allRoles => {
        this.allRoles = allRoles;
      }),
      this.service.loggedInUserRoles$.subscribe(roles => {
        this.loggedInUserRoles = roles;
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Toggle a role on or off
   *
   * Anyone who is an owner/admin automatically gets Minds admin capabilities
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

              const updatedUserWithRoles: UserRoleEdge = {
                ...this.userWithRoles,
                roles: [...this.userWithRoles.roles, addedRole],
              };

              // Keep the roles in decreasing order of id
              // This ensures the highest ranking role is displayed
              updatedUserWithRoles.roles.sort((a, b) => b.id - a.id);

              this.userWithRoles = updatedUserWithRoles;

              this.onRoleChange(this.userWithRoles);
            }
          })
      );
    }
  }

  /**
   * When a checkbox is clicked:
   * If the checkbox was disabled, show a toaster
   * If the user is disabling their own ownership, show a confirmation modal
   */
  clickedCheckbox(roleId: RoleId): void {
    if (this.isCheckboxClickable(roleId) && this.isCheckboxEnabled(roleId)) {
      return;
    }

    if (this.isOwnActiveOwnership(roleId)) {
      this.openOwnerConfirmationModal();
    }
    if (roleId === RoleId.OWNER) {
      /**
       * Explain why they can't click an owner checkbox
       */
      if (!this.loggedInUserRoles.some(role => role.id === RoleId.OWNER)) {
        this.toaster.error(
          'Your user role is not permitted to edit the owner role'
        );
        return;
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
   * Should the checkbox be presented as disabled?
   * @param roleId
   */
  isCheckboxEnabled(roleId: RoleId) {
    if (roleId === RoleId.OWNER) {
      // Are they allowed to toggle the owner role?
      if (!this.loggedInUserRoles.some(role => role.id === RoleId.OWNER)) {
        // Only owners can toggle owner roles
        return false;
      }
    }
    return true;
  }

  /**
   * False if clicking the checkbox should open a confirmation modal
   * So it looks enabled, but isn't actually clickable until confirmed
   * @param roleId
   */
  isCheckboxClickable(roleId: RoleId) {
    // Are they trying to disable their own ownership?
    if (this.isOwnActiveOwnership(roleId)) {
      return false;
    }

    return true;
  }

  isOwnActiveOwnership(roleId: RoleId) {
    return (
      roleId === RoleId.OWNER &&
      this.userWithRoles.node.guid === this.session.getLoggedInUser().guid &&
      this.userHasRole(roleId)
    );
  }

  /**
   * If you're revoking your own ownership, confirm before toggling.
   * (If you try to do this but you're the network creator, it's not going to stick)
   * @param roleId
   */
  openOwnerConfirmationModal() {
    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Are you sure',
        body:
          "Are you sure you want to revoke your owner role on this network? You can't undo this action. Do you want to proceed?",
        confirmButtonColor: 'red',
        onConfirm: () => {
          this.toggleRole(RoleId.OWNER);
          this.router.navigate(['/newsfeed']);
          this.modalService.dismissAll();
        },
      },
      injector: this.injector,
    });
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
