import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GroupService } from '../group.service';
import { Subscription } from 'rxjs';

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
   * Button gets stuck loading without it
   */
  onMembershipChange($event): void {
    if ($event.member) {
      this.service.isMember$.next($event.member);
    }
  }

  /**
   * Fired when option is selected from actions menu
   */
  onSettingsChange($event): void {
    if ($event.editing) {
      this.service.editing$.next($event.editing);
    }
  }
}
