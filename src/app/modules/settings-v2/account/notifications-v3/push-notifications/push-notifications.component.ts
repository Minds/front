import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { NotificationsSettingsV2Service } from '../notifications-settings-v3.service';
import { PushNotificationGroup } from '../notifications-settings-v3.type';
import { PushNotificationService } from './../../../../../common/services/push-notification.service';
import { Storage } from '../../../../../services/storage';
import { FALSE } from 'sass';

// toggle state
export type ToggleState = 'on' | 'off';

// push notification toggle options
export type PushNotificationToggleType = {
  notificationGroup: PushNotificationGroup;
  state: ToggleState;
  subtext?: string;
};

export const NOTIFICATION_SOUNDS_STORAGE_KEY = 'play_notification_sounds';

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

  private notificationEnablingError$ = new BehaviorSubject('');

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
    top_posts: "Get notifications for top posts you haven't yet seen",
    community_updates: 'Get community updates from this network',
    supermind: 'Get notified about your Supermind offers',
    affiliate_earnings: 'Get notified about your affiliate earnings',
    all: '',
  };

  /**
   * This one is standalone because it is not a push notif setting
   */
  protected soundToggleState: ToggleState;

  constructor(
    private service: NotificationsSettingsV2Service,
    public pushNotificationService: PushNotificationService,
    private storage: Storage
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.pushSettings$.subscribe(response => {
        // Initialize all the push notification settings
        for (const setting of response.settings) {
          this.toggles.push({
            notificationGroup: setting.notification_group as PushNotificationGroup,
            state: setting.enabled ? 'on' : 'off',
            subtext: this.subtextMap[setting.notification_group],
          });
        }

        // Initialize notification sound setting
        this.soundToggleState = this.initializeSoundToggleState();

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

  /**
   * do we have browser push notification permission
   * @returns { Observable<boolean> }
   */
  get pushNotificationsEnabled$(): Observable<boolean> {
    return this.pushNotificationService.enabled$;
  }

  /**
   * does the browser support push notifs?
   * @returns { Observable<boolean> }
   */
  get pushNotificationsSupported$(): Observable<boolean> {
    return this.pushNotificationService.supported$;
  }

  /**
   * user wants to enable push notifications
   * @returns { Promise<void> }
   */
  public async onEnablePushNotifications(): Promise<void> {
    this.notificationEnablingError$.next('');
    try {
      await this.pushNotificationService.requestSubscription();
    } catch (e) {
      console.error(e);
      switch (e?.name || e?.message) {
        case 'NotAllowedError':
          this.notificationEnablingError$.next('Permission denied');
          break;
        case 'timeout':
        default:
          this.notificationEnablingError$.next('Something went wrong');
          break;
      }
    }
  }

  /**
   * user wants to disable push notifications
   * @returns { Promise<void> }
   */
  public async onDisablePushNotifications(): Promise<void> {
    try {
      await this.pushNotificationService.cancelSubscription();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Get sound toggle state from local storage. On by default
   */
  private initializeSoundToggleState(): ToggleState {
    const fromStorage = this.storage.get(NOTIFICATION_SOUNDS_STORAGE_KEY);

    return fromStorage === 'true' || fromStorage === null ? 'on' : 'off';
  }

  /**
   * Update sound toggle and save state to local storage
   */
  protected toggleSound(state: ToggleState): void {
    this.inProgress$.next(true);

    this.soundToggleState = state;
    this.storage.set(
      NOTIFICATION_SOUNDS_STORAGE_KEY,
      state === 'on' ? true : false
    );

    this.inProgress$.next(false);
  }
}
