import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { NotificationsSettingsV2Service } from '../notifications-settings-v3.service';
import {
  EmailNotificationCampaign,
  EmailNotificationSetting,
  EmailNotificationTopic,
} from '../notifications-settings-v3.type';

/**
 * Settings form for controlling what email notifications you receive, and when.
 */
@Component({
  selector: 'm-settingsV2__emailNotifications--v3',
  templateUrl: './email-notifications-v3.component.html',
  styleUrls: ['../notifications-settings-v3.ng.scss'],
})
export class SettingsV2EmailNotificationsV3Component
  extends AbstractSubscriberComponent
  implements OnInit {
  // holds settings
  public readonly settings$ = new BehaviorSubject<EmailNotificationSetting[]>(
    null
  );
  // when initializing.
  public readonly initializing$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  // map topics to text
  public textMap = {
    exclusive_promotions: 'Exclusive Promotions',
    minds_news: 'News about new Minds products and features',
    minds_tips: 'Tips on how to use Minds',
    boost_completed: 'My boost has been completed',
    unread_notifications: 'I have unread notifications',
    wire_received: 'I receive a wire or Supermind offer',
    channel_improvement_tips: 'Tips on how to improve my channel',
    new_channels: 'New things to subscribe to',
    posts_missed_since_login: 'Things I’ve missed since my last login',
    top_posts: 'Top posts from my network',
  };

  /**
   * Topics that use a <select> box option for timespan.
   */
  public selectBoxTopics: EmailNotificationTopic[] = [
    'unread_notifications',
    'top_posts',
  ];

  constructor(private service: NotificationsSettingsV2Service) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.emailSettings$
        .pipe(
          map(response => {
            /**
             * patch over select box topics to ensure current values are digestible
             * this can be an issue for legacy settings that you could
             * not previously select a timespan for.
             */
            for (let option of response.notifications) {
              if (this.selectBoxTopics.indexOf(option.topic) > -1) {
                if (this.hasPeriod(option)) {
                  continue;
                }
                option.value =
                  option.value === undefined ||
                  option.value === null ||
                  option.value === '0'
                    ? '0'
                    : 'weekly';
              }
            }
            return response;
          })
        )
        .subscribe(response => {
          this.settings$.next(response.notifications);
          this.initializing$.next(false);
        })
    );
  }

  /**
   * Toggle a selected setting.
   * @param { EmailNotificationSetting } selected - selected option.
   * @returns { Promise<void> }
   */
  public async toggle(selected: EmailNotificationSetting): Promise<void> {
    let settings = await this.settings$.pipe(first()).toPromise();

    for (let option of settings) {
      if (option.topic === selected.topic) {
        // treat as boolean flip
        if (
          option.value === '1' ||
          option.value === '0' ||
          option.value === ''
        ) {
          option.value = option.value === '1' ? '0' : '1';
        }

        if (this.selectBoxTopics.indexOf(option.topic) > -1) {
          option.value = this.hasPeriod(option) ? '0' : 'weekly';
        }

        this.subscriptions.push(
          this.service.toggleEmail(this.assemblePayload(option)).subscribe()
        );
      }
    }
  }

  /**
   * On select change, ensure the value of the option is changed and send change to server.
   * @param { EmailNotificationTopic } topic - the topic selected
   * @param $event - event fired from select change.
   * @returns { Promise<void> }
   */
  public async onSelectChange(
    topic: EmailNotificationTopic,
    $event: any
  ): Promise<void> {
    let settings = await this.settings$.pipe(first()).toPromise();

    for (let option of settings) {
      if (option.topic === topic) {
        option.value = $event.target.value ?? '0';
        this.subscriptions.push(
          this.service.toggleEmail(this.assemblePayload(option)).subscribe()
        );
      }
    }
  }

  /**
   * Filters settings by campaign
   * @param { EmailNotificationCampaign } campaign
   * @returns { Observable<EmailNotificationSetting[]> }
   */
  public filterByCampaign$(
    campaign: EmailNotificationCampaign
  ): Observable<EmailNotificationSetting[]> {
    return this.settings$.pipe(
      map(
        settings =>
          settings.filter(option => option.campaign === campaign) ?? []
      ),
      catchError(e => [])
    );
  }

  /**
   * Gets value for direction on toggle based on setting.
   * e.g. left value "0", right value "1".
   * @param { EmailNotificationSetting } option - setting.
   * @param { 'left' | 'right' } direction
   * @returns { string } value for specified side of toggle.
   */
  public getToggleValue(
    option: EmailNotificationSetting,
    direction: 'left' | 'right'
  ): string {
    if (
      this.selectBoxTopics.indexOf(option.topic) > -1 &&
      option.value === '0'
    ) {
      if (direction === 'left') {
        return '0';
      } else {
        return option.value !== '0' ? option.value : 'weekly';
      }
    }
    return direction === 'left' ? '0' : '1';
  }

  /**
   * Assembles payload
   * @param { EmailNotificationSetting } option
   * @returns { unknown } - payload value
   */
  private assemblePayload(option: EmailNotificationSetting): unknown {
    return {
      notifications: {
        [option.campaign]: {
          [option.topic]: option.value,
        },
      },
    };
  }

  /**
   * Returns true if the option has a digestible time period as the value
   * @param { EmailNotificationSetting } option - option to check
   * @returns { boolean } true if option has valid time period.
   */
  private hasPeriod(option: EmailNotificationSetting): boolean {
    return (
      option.value === 'daily' ||
      option.value === 'weekly' ||
      option.value === 'periodically'
    );
  }
}
