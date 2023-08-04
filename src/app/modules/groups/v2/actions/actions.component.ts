import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GroupService } from '../group.service';
import { Subscription } from 'rxjs';
import { GroupMembershipChangeOuput } from '../../../../common/components/group-membership-button/group-membership-button.component';

/**
 * Toolbar at top of group banner, with options that change
 * depending on user context/permissions
 */
@Component({
  selector: 'm-group__actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'actions.component.html',
  styleUrls: ['actions.component.ng.scss'],
})
export class GroupActionsComponent {
  subscriptions: Subscription[];

  /**
   * Constructor
   * @param service
   */
  constructor(public service: GroupService) {}

  /**
   * Fires when membership changes as result of
   * clicking the membership button
   *
   */
  onMembershipChange($event: GroupMembershipChangeOuput): void {
    this.service.isMember$.next($event.isMember);
  }

  /**
   * Fired when option is selected from actions menu
   */
  onSettingsChange($event): void {
    // ojm remove this?
  }
}
