import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import { CompassService } from '../../compass/compass.service';
import * as moment from 'moment';
import {
  NoticePosition,
  Notices,
  NoticeIdentifier,
} from '../feed-notice.types';

/**
 * Determines which feed notices to show, and holds state on
 * which have already been shown / completed.
 */
@Injectable({ providedIn: 'root' })
export class FeedNoticeService extends AbstractSubscriberComponent {
  // whether config identifies email as unconfirmed.
  private readonly fromEmailConfirmation: boolean = false;

  // when state has been updated - subscribed to in outlet
  // so we can decide what components to show AFTER initial load.
  public readonly updatedState$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // Object containing information on all notices, used to sync state.
  // Ordering indicates order of show priority.
  public notices: Notices = {
    'verify-email': {
      shown: false,
      completed: false,
      dismissed: false,
      position: 'top',
    },
    'build-your-algorithm': {
      shown: false,
      completed: false,
      dismissed: false,
      position: 'top',
    },
    'enable-push-notifications': {
      shown: false,
      completed: false,
      dismissed: false,
      position: 'inline',
    },
  };

  constructor(
    private session: Session,
    private api: ApiService,
    private compass: CompassService,
    configs: ConfigsService
  ) {
    super();
    this.fromEmailConfirmation = configs.get('from_email_confirmation');
  }

  /**
   * Checks notice state, setting their completed / dismissed attributes.
   * @returns { Promise<void> } awaitable.
   */
  public async checkNoticeState(): Promise<void> {
    this.notices['verify-email'].completed = !this.requiresEmailConfirmation();

    // check dismissal first.
    this.notices['build-your-algorithm'].dismissed = this.isNoticeDismissed(
      'build-your-algorithm'
    );
    this.notices[
      'enable-push-notifications'
    ].dismissed = this.isNoticeDismissed('enable-push-notifications');

    // check completion.
    this.notices[
      'build-your-algorithm'
    ].completed = await this.hasCompletedCompassAnswers();

    this.notices[
      'enable-push-notifications'
    ].completed = await this.hasPushNotificationsEnabled();

    this.updatedState$.next(true);
  }

  /**
   * Gets next notice to be shown. Component should report after showing via setShown.
   * @param { NoticePosition } position - position for notice to be shown.
   * @returns { NoticeIdentifier } - name of the notice to be shown next.
   */
  public getNextShowableNotice(position: NoticePosition): NoticeIdentifier {
    return this.getShowableNoticesByPosition(position)[0];
  }

  /**
   * Whether position already has notices that have been shown.
   * @param { NoticePosition } position- position to check.
   * @return { boolean } true if position has notices that have been shown.
   */
  public hasShownNoticeInPosition(position: NoticePosition): boolean {
    const shownNoticesForPosition = Object.entries(this.notices).filter(
      ([noticeKey, noticeValue]) => {
        return noticeValue.position === position && noticeValue.shown;
      }
    );
    return shownNoticesForPosition.length > 0;
  }

  /**
   * Whether ANY notice has already been shown.
   * @returns { boolean } - true if any notice has been shown already.
   */
  public hasShownANotice(): boolean {
    const shownNoticesForPosition = Object.entries(this.notices).filter(
      ([noticeKey, noticeValue]) => {
        return noticeValue.shown;
      }
    );
    return shownNoticesForPosition.length > 0;
  }

  /**
   * Sets a notice state as shown to avoid, or cause it to be shown in multiple places.
   * @param { NoticeIdentifier } notice - name of notice to set state for.
   * @param { boolean } value - value to set the notice's shown state to.
   */
  public setShown(notice: NoticeIdentifier, value: boolean): void {
    this.notices[notice].shown = value;
  }

  /**
   * Whether notice has been dismissed.
   * @param { NoticeIdentifier } notice - name of notice to check.
   * @return { boolean } - true if notice has been dismissed.
   */
  public isDismissed(notice: NoticeIdentifier): boolean {
    return this.notices[notice].dismissed;
  }

  /**
   * Sets a notice dismissed state and saves state on dismissal via server call.
   * @param { NoticeIdentifier } notice - name of notice to set dismissed state for.
   * @param { boolean } value - value to set the notice's dismissed state to.
   */
  public setDismissed(notice: NoticeIdentifier, value: boolean): void {
    this.notices[notice].dismissed = value;

    if (value) {
      this.subscriptions.push(
        this.api
          .put(`api/v3/dismissible-notices/${notice}`)
          .pipe(
            take(1),
            map((response: ApiResponse) => {
              if (response.status !== 'success') {
                throw new Error(response.message);
              }
            }),
            catchError(e => {
              console.error(e.error.message ?? e);
              return of(true);
            })
          )
          .subscribe()
      );
    }
  }

  /**
   * Whether notice should be shown in the given position.
   * @param { NoticeIdentifier } notice - notice to check.
   * @param { NoticePosition } position - the position we're checking the notice should be showable in.
   * @returns { boolean } - true if notice can be shown in the given position.
   */
  private shouldShowInPosition(
    notice: NoticeIdentifier,
    position: NoticePosition
  ): boolean {
    return this.notices[notice].position === position;
  }

  /**
   * Gets a list of all showable notice names for a given position.
   * @param { NoticePosition } position - position of showable notices to get.
   * @returns { NoticeIdentifier[] } - array of notice names that are showable.
   */
  private getShowableNoticesByPosition(
    position: NoticePosition = 'top'
  ): NoticeIdentifier[] {
    return (Object.keys(this.notices) as NoticeIdentifier[]).filter(
      (notice: NoticeIdentifier) => {
        return (
          this.shouldShowInPosition(notice, position) &&
          !this.isShown(notice) &&
          !this.isCompleted(notice) &&
          !this.isDismissed(notice)
        );
      }
    );
  }

  /**
   * Whether notice is shown.
   * @param { NoticeIdentifier } notice - notice to check.
   * @returns { boolean } - true if notice is to be shown.
   */
  private isShown(notice: NoticeIdentifier): boolean {
    return this.notices[notice].shown;
  }

  /**
   * Whether notice action is already completed.
   * @param { NoticeIdentifier } notice - notice to check.
   * @returns { boolean } - true if notice action is already completed.
   */
  private isCompleted(notice: NoticeIdentifier): boolean {
    return this.notices[notice].completed;
  }

  /**
   * Whether user requires email confirmation.
   * @returns { boolean } true if email confirmation is required.
   */
  private requiresEmailConfirmation(): boolean {
    const user = this.session.getLoggedInUser();
    return (
      !this.fromEmailConfirmation && user && user.email_confirmed === false
    );
  }

  /**
   * Whether compass answers are required.
   * @returns { Promise<boolean> }
   */
  private async hasCompletedCompassAnswers(): Promise<boolean> {
    await this.compass.fetchQuestions();
    return this.compass.answersProvided$.getValue();
  }

  /**
   * Whether push notifications are enabled.
   * @returns { Promise<boolean> } true if user has push notifications enabled.
   */
  private async hasPushNotificationsEnabled(): Promise<boolean> {
    return this.api
      .get('/api/v3/notifications/push/settings')
      .pipe(
        take(1),
        map((response: ApiResponse) => {
          if (response.status === 'success' && response.settings) {
            const allGroup = response.settings.filter(setting => {
              return setting['notification_group'] === 'all';
            })[0];
            return allGroup.enabled;
          }
          throw new Error(
            response.message ??
              'An unknown error has occurred getting push notification settings'
          );
        }),
        catchError(e => {
          // in the event of an error loading, skip showing but log.
          console.error(e);
          return of(true);
        })
      )
      .toPromise();
  }

  /**
   * Determine whether notice has been dismissed within last 60 days.
   * @param { NoticeIdentifier } notice - identifier of notice to check.
   * @returns { boolean } true if notice has been dismissed in last 60 days.
   */
  private isNoticeDismissed(notice: NoticeIdentifier): boolean {
    if (this.notices[notice].dismissed) {
      return true;
    }

    const dismissedNotices =
      this.session.getLoggedInUser()['dismissed_notices'] ?? [];
    if (!dismissedNotices.length) {
      return false;
    }

    const threshold = moment().subtract(60, 'days');

    return (
      dismissedNotices.filter(dismissedNotice => {
        const noticeDate = moment(dismissedNotice['timestamp_ms']);
        return (
          dismissedNotice['id'] === notice && noticeDate.isAfter(threshold)
        );
      }).length > 0
    );
  }
}
