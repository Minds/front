import { Component, Input, OnInit } from '@angular/core';
import { MultiTenantRolesService } from '../../../services/roles.service';
import { RoleId } from '../../tabs/roles/roles.types';

@Component({
  selector: 'm-networkAdminConsoleRole__icon',
  templateUrl: './role-icon.component.html',
  styleUrls: ['./role-icon.component.ng.scss'],
})
export class NetworkAdminConsoleRoleIconComponent {
  @Input() roleId: RoleId;

  /**
   * How big the icon should be, compared to the default 20px
   */
  @Input() scale: number = 1;

  /**
   * Allows us to use roleId enums in the template
   */
  public RoleId: typeof RoleId = RoleId;
  constructor(protected rolesService: MultiTenantRolesService) {}

  /**
   * Gets transform:scale() css.
   * @returns {{transform: string}} - ngStyle CSS object to set scale transformation.
   */
  protected getScaleCss(): { transform: string } {
    return {
      transform: `scale(${this.scale})`,
    };
  }
}
