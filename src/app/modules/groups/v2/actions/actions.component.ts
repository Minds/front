import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { GroupService } from '../group.service';
import { Subscription } from 'rxjs';
import { GroupMembershipChangeOuput } from '../../../../common/components/group-membership-button/group-membership-button.component';
import { ComposerService } from '../../../composer/services/composer.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { ActivityContainer } from '../../../composer/services/audience.service';

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
  constructor(public service: GroupService, private injector: Injector) {}

  /**
   * Fires when membership changes as result of
   * clicking the membership button
   */
  onMembershipChange($event: GroupMembershipChangeOuput): void {
    if ($event.isMember === this.service.isMember$.getValue()) {
      return;
    }
    this.service.isMember$.next($event.isMember);

    // Ensure the composer shows up on top of the feed on join
    const group = this.service.group$.getValue();
    group['is:member'] = $event.isMember;
    this.service.syncLegacyService(group);
  }
}
