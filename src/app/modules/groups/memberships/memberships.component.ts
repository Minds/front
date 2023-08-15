import { Component } from '@angular/core';
import { Session } from '../../../services/session';
import isMobile from '../../../helpers/is-mobile';
import { GroupMembershipLevel } from '../v2/group.types';

/**
 * Page with a list of all the groups you belong to
 */
@Component({
  selector: 'm-groupsMemberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.ng.scss'],
})
export class GroupsMembershipsComponent {
  /**
   * If the list load is in progress
   */
  inProgress: boolean = true;

  /**
   * Whether the user is a member of any groups
   */
  hasGroups: boolean;

  /**
   * How many recommendations to show
   */
  recommendationsListSize: number;

  /**
   * Whether the list of groups you manage has loaded yet
   * Used to increase requestLimit after initial load
   */
  managedGroupsLoaded: boolean = false;

  /**
   * Allows us to use enum in the template
   */
  public groupMembershipLevel: typeof GroupMembershipLevel = GroupMembershipLevel;

  constructor(public session: Session) {}

  handleHasGroups($event) {
    if ($event) {
      this.hasGroups = $event;
      this.recommendationsListSize = this.isMobile() ? 1 : 3;
    } else {
      this.recommendationsListSize = 5;
    }
  }

  isMobile() {
    return isMobile();
  }
}
