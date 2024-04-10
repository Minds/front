import { Component, Input, OnInit } from '@angular/core';
import { Role } from '../../../../../../graphql/generated.engine';

/**
 * Displays a 'summary' of a users roles
 * i.e. a single role chip
 * along with a count of additional roles
 *
 * Optional: content projected action button
 */
@Component({
  selector: 'm-role__aggregator',
  templateUrl: './role-aggregator.component.html',
  styleUrls: ['./role-aggregator.component.ng.scss'],
})
export class RoleAggregatorComponent implements OnInit {
  @Input() roles: Role[];

  protected featuredRole: Role;

  protected aggregatedRoles: Role[];

  protected aggregatedRoleHoverText: string = '';

  ngOnInit(): void {
    this.sortRolesAscending(this.roles);

    this.featuredRole = this.roles[0];
    this.aggregatedRoles = this.roles.slice(1);

    this.getAggregatedRoleHoverText();
  }
  /**
   * Sort the roles so the highest ranking role is featured
   * (aka explicitly named)
   */
  private sortRolesAscending(roles: Role[]): Role[] {
    return roles.sort((a, b) => a.id - b.id);
  }

  /**
   * Show this text when user hovers over additional role aggregation
   */
  private getAggregatedRoleHoverText(): void {
    if (this.aggregatedRoles.length === 0) {
      return;
    }

    const roleNames = this.roles.slice(1).map((role) => role.name);

    this.aggregatedRoleHoverText = roleNames.join(', ');
  }
}
