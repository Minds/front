import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { PostMenuService } from '../../../../common/components/post-menu/post-menu.service';
import { ActivityService } from '../../../../common/services/activity.service';

/**
 * Subscribe button (non-owner) - action button shown to channel visitors.
 * Clicking it subscribes to the channel if the user is logged in,
 * and opens the auth modal if they are logged out
 */
@Component({
  selector: 'm-channelActions__subscribe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'subscribe.component.html',
  providers: [PostMenuService, ActivityService],
})
export class ChannelActionsSubscribeComponent {
  /**
   * Constructor
   * @param service
   * @param postMenu
   * @param activity
   */
  constructor(
    public service: ChannelsV2Service,
    protected postMenu: PostMenuService,
    activity: ActivityService
  ) {}

  /**
   * Subscribe to the user
   * @todo Create a generic service along with post menu things
   */
  async subscribe(): Promise<void> {
    // Shallow clone current user
    const user = { ...this.service.channel$.getValue() };

    // Optimistic mutation
    this.service.setChannel({ ...user, subscribed: true });

    // Let Post Menu service handle subscription
    await this.postMenu.setEntityOwner(user).subscribe();

    // Post menu service mutates passed object
    this.service.setChannel({ ...user });

    this.service.onSubscriptionChanged.emit(true);
  }
}
