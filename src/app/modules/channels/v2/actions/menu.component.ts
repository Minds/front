import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { PostMenuService } from '../../../../common/components/post-menu/post-menu.service';
import { ActivityService } from '../../../../common/services/activity.service';
import { Router } from '@angular/router';
import { Client } from '../../../../services/api/client';
import { ChannelAdminConfirmationService } from './admin-confirmation/admin-confirmation.service';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';

export interface ProToggleResponse {
  status?: string;
}

/**
 * Extra actions dropdown menu - not visible to channel owners
 * For channel-related actions that change depending on context (user, admin).
 * E.g. (un)subscribe, report, (un)ban globally, view ledger, make pro
 */
@Component({
  selector: 'm-channelActions__menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'menu.component.html',
  providers: [PostMenuService, ActivityService],
})
export class ChannelActionsMenuComponent extends AbstractSubscriberComponent
  implements OnInit {
  /**
   * Constructor
   * @param service
   * @param postMenu
   * @param router
   * @param activity
   */
  constructor(
    public service: ChannelsV2Service,
    protected postMenu: PostMenuService,
    protected router: Router,
    private client: Client,
    private adminConfirmation: ChannelAdminConfirmationService,
    activity: ActivityService
  ) {
    super();
  }

  @Input() anchorPosition = { top: '100%', right: '0' };

  ngOnInit() {
    this.subscriptions.push(
      this.adminConfirmation.completed$.subscribe(payload => {
        if (payload) {
          let channel = this.service.channel$.getValue();
          const nextState = payload.action === 'make' ? true : false;

          if (payload.type === 'plus') {
            channel.plus = nextState;
          }
          if (payload.type === 'pro') {
            channel.pro = nextState;
          }

          this.service.load(channel);
        }
      })
    );
  }

  /**
   * Subscribe to the user
   * @todo Create a generic service along with post menu things
   */
  async subscribe(): Promise<void> {
    // Shallow clone current user
    const channel = { ...this.service.channel$.getValue() };

    // Optimistic mutation
    this.service.setChannel({ ...channel, subscribed: false });

    // Let Post Menu service handle subscription
    await this.postMenu.setEntityOwner(channel).subscribe();

    // Post menu service mutates passed object
    this.service.setChannel({ ...channel });
  }

  /**
   * Unsubscribe from the user
   * @todo Create a generic service along with post menu things
   */
  async unsubscribe(): Promise<void> {
    // Shallow clone current user
    const channel = { ...this.service.channel$.getValue() };

    // Optimistic mutation
    this.service.setChannel({ ...channel, subscribed: false });

    // Let Post Menu service handle subscription
    await this.postMenu.setEntityOwner(channel).unSubscribe();

    // Post menu service mutates passed object
    this.service.setChannel({ ...channel });

    this.service.onSubscriptionChanged.emit(false);
  }

  /**
   * Unban a user
   * @todo Create a generic service along with post menu things
   */
  async unBan() {
    // Shallow clone current user
    const channel = { ...this.service.channel$.getValue() };

    // Optimistic mutation
    this.service.setChannel({ ...channel, banned: 'no', subscribed: false });

    // Let Post Menu service handle ban operation
    await this.postMenu.setEntity({ ownerObj: channel }).unBan();
  }

  viewLedger() {
    this.router.navigate([
      '/wallet/tokens/transactions',
      { remote: this.service.channel$.getValue().username },
    ]);
  }

  viewWithdrawals() {
    this.router.navigate([
      '/admin/withdrawals',
      { user: this.service.channel$.getValue().username },
    ]);
  }

  /**
   * Links to relevant remote boost page
   * @param { 'newsfeed' | 'content' } type - page.
   */
  public viewBoosts(type: 'newsfeed' | 'content'): void {
    this.router.navigate([
      `/boost/console/${type}/history`,
      { remote: this.service.channel$.getValue().username.toLowerCase() },
    ]);
  }

  async viewEmail() {
    const channel = { ...this.service.channel$.getValue() };

    const email = await this.postMenu
      .setEntity({ ownerObj: channel })
      .getEmail();

    this.service.setChannel({ ...channel, email: email, subscribed: false });
  }

  async setExplicit(explicit: boolean) {
    const channel = { ...this.service.channel$.getValue() };

    // Optimistic mutation
    this.service.setChannel({ ...channel, is_mature: true, subscribed: false });

    await this.postMenu.setEntity({ ownerObj: channel }).setExplicit(explicit);
  }

  async setNSFWLock(reasons: Array<{ label; value; selected }>) {
    const channel = { ...this.service.channel$.getValue() };

    const nsfw = reasons.map(reason => reason.value);

    // Optimistic mutation
    this.service.setChannel({ ...channel, nsfw: nsfw, subscribed: false });

    await this.postMenu.setEntity({ ownerObj: channel }).setNsfw(nsfw);
  }

  async reIndex() {
    const channel = { ...this.service.channel$.getValue() };
    this.postMenu.setEntity({ ownerObj: channel }).reIndex();
  }

  async setRating(rating: number) {
    const channel = { ...this.service.channel$.getValue() };

    // Optimistic mutation
    this.service.setChannel({ ...channel, rating: rating, subscribed: false });

    await this.postMenu.setEntity({ ownerObj: channel }).setRating(rating);
  }

  /**
   * Block a user
   * @todo Create a generic service along with post menu things
   */
  async block() {
    // Shallow clone current user
    const channel = { ...this.service.channel$.getValue() };

    // Let Post Menu service handle block operation
    try {
      const response = await this.postMenu
        .setEntity({ ownerObj: channel })
        .block();

      // Don't allow more blocks than block limit
      if (
        response &&
        response.errorId === 'Minds::Core::Security::Block::BlockLimitException'
      ) {
        return;
      }
    } catch (e) {
      return;
    }

    // Optimistic mutation
    this.service.setChannel({
      ...channel,
      blocked: true,
      subscribed: false,
    });
  }

  /**
   * Unblock a user
   * @todo Create a generic service along with post menu things
   */
  async unblock() {
    // Shallow clone current user
    const channel = { ...this.service.channel$.getValue() };

    // Optimistic mutation
    this.service.setChannel({ ...channel, blocked: false });

    // Let Post Menu service handle block operation
    await this.postMenu.setEntity({ ownerObj: channel }).unBlock();
  }

  /**
   * Report the user
   * @todo Create a generic service along with post menu things
   */
  report(): void {
    // Shallow clone current user
    const channel = { ...this.service.channel$.getValue() };

    // Let Post Menu service handle modal
    this.postMenu.setEntity(channel).openReportModal();
  }

  /**
   * Allows an admin to toggle the pro state of a user.
   * @returns { Promise<void> } -awaitable.
   */
  async proAdminToggle(): Promise<void> {
    const channel = this.service.channel$.getValue();

    this.adminConfirmation.toggle(
      'pro',
      channel.pro ? 'remove' : 'make',
      channel.guid
    );
  }

  /**
   * Allows an admin to toggle the plus state of a user.
   * @returns { Promise<void> } - awaitable.
   */
  async plusAdminToggle(): Promise<void> {
    const channel = this.service.channel$.getValue();

    this.adminConfirmation.toggle(
      'plus',
      channel.plus ? 'remove' : 'make',
      channel.guid
    );
  }

  /**
   * Set the seed
   * @param boolean
   */
  async setSeed(seed: boolean): Promise<void> {
    const channel = { ...this.service.channel$.getValue() };

    // Optimistic mutation
    this.service.setChannel({ ...channel, seed });

    try {
      await this.postMenu.setEntity({ ownerObj: channel }).setSeed(seed);
    } catch (e) {
      // Reverse action
      this.service.setChannel({ ...channel, seed: !seed });
    }
  }

  public getUserSupersetUrl(): string {
    return `https://analytics.minds.com/superset/dashboard/41/?preselect_filters={"286":{"USER_GUID":"${
      this.service.channel$.getValue().guid
    }"}}`;
  }
}
