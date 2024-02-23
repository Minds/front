import { Component, OnInit } from '@angular/core';
import { MultiTenantRolesService } from '../../../../../services/roles.service';
import { Subscription } from 'rxjs';
import { RoleId } from '../../roles.types';
import {
  PermissionsEnum,
  Role,
} from '../../../../../../../../graphql/generated.engine';

export type RolePermissionToggleValue = 'off' | 'on';

@Component({
  selector: 'm-networkAdminConsoleRoles__permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.ng.scss'],
})
export class NetworkAdminConsoleRolesPermissionsComponent implements OnInit {
  /**
   * Allows us to use roleId enums in the template
   */
  public roleId: typeof RoleId = RoleId;
  /**
   * Allows us to use permissionsEnum in the template
   */
  public permissionsEnum: typeof PermissionsEnum = PermissionsEnum;

  private subscriptions: Subscription[] = [];

  allRoles: Role[];

  constructor(protected service: MultiTenantRolesService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.allRoles$.subscribe(roles => {
        this.allRoles = roles;
      })
    );
  }

  /**
   * Gets specific toggle value for role
   */
  getPermission(
    roleId: number,
    permission: PermissionsEnum
  ): RolePermissionToggleValue {
    const role = this.allRoles.find(r => r.id === roleId);

    if (role && role.permissions) {
      return role.permissions.includes(permission) ? 'on' : 'off';
    }

    return 'off';
  }

  /**
   * Toggle a permission on or off
   * @param roleId
   * @param permission
   */
  async setPermission(
    roleId: number,
    permission: PermissionsEnum
  ): Promise<void> {
    const currentValue =
      this.getPermission(roleId, permission) === 'on' ? true : false;

    this.subscriptions.push(
      await this.service
        .setRolePermission({
          permission: permission,
          roleId: roleId,
          enabled: !currentValue,
        })
        .subscribe()
    );
  }

  trackByRoleId(index: number, role: any): any {
    return role.id;
  }
}
