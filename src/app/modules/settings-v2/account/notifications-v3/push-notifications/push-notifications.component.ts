import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { NotificationsSettingsV2Service } from '../notifications-settings-v3.service';
import { PushNotificationGroup } from '../notifications-settings-v3.type';

// toggle state
export type ToggleState = 'on' | 'off';

// push notification toggle options
export type PushNotificationToggleType = {
  notificationGroup: PushNotificationGroup;
  state: ToggleState;
  subtext?: string;
};

/**
 * Push notification settings component.
 */
@Component({
  selector: 'm-settingsV2__pushNotifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['../notifications-settings-v3.ng.scss'],
})
export class SettingsV2PushNotificationsV3Component
  extends AbstractSubscriberComponent
  implements OnInit {
  // is in progress
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  // is initializing
  public readonly initializing$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  // holds array of toggles
  private toggles: PushNotificationToggleType[] = [];

  // text to accompany option - manually add if adding more opts.
  private subtextMap = {
    votes: 'Get notified when your post or comment is upvoted.',
    tags: 'When you are tagged in a post or comment.',
    subscriptions: 'When a channel subscribes to you.',
    comments:
      'When a channel comments on your post or replies to your comment.',
    reminds: 'When your post is reminded.',
    boosts: 'Notifications on boost performance and management.',
    tokens: 'Earnings, rewards and payout notifications.',
    wires: 'When you receive a payment.',
    chats: 'When you receive chat requests.',
    groups: 'Activity in your groups.',
    reports: 'Progress on your reports.',
    all: '',
  };

  constructor(private service: NotificationsSettingsV2Service) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.pushSettings$.subscribe(response => {
        for (let setting of response.settings) {
          this.toggles.push({
            notificationGroup: setting.notification_group as PushNotificationGroup,
            state: setting.enabled ? 'on' : 'off',
            subtext: this.subtextMap[setting.notification_group],
          });
        }
        this.initializing$.next(false);
      })
    );
  }

  /**
   * Toggle push notifications.
   * @param { PushNotificationGroup } notificationGroup - group to toggle.
   */
  public toggle(notificationGroup: PushNotificationGroup): void {
    this.inProgress$.next(true);

    let enabling = false;

    this.toggles.map(option => {
      if (option.notificationGroup === notificationGroup) {
        enabling = option.state === 'off' ? true : false;
        option.state = enabling ? 'on' : 'off';
      }
      return option;
    });

    this.subscriptions.push(
      this.service.togglePush(notificationGroup, enabling).subscribe()
    );

    this.inProgress$.next(false);
  }

  /**
   * Gets toggles that should be loaded dynamically (allows us to manually load and specify 'all')
   * @returns { PushNotificationToggleType[] } array of settings to be dynamically added.
   */
  public getDynamicToggles(): PushNotificationToggleType[] {
    return this.toggles.filter(option => option.notificationGroup !== 'all');
  }

  /**
   * Gets specific toggle
   * @param { PushNotificationGroup } notificationGroup group to get for
   * @returns { PushNotificationToggleType }
   */
  public getToggle(
    notificationGroup: PushNotificationGroup
  ): PushNotificationToggleType {
    return this.toggles.filter(
      option => option.notificationGroup === notificationGroup
    )[0];
  }
}
