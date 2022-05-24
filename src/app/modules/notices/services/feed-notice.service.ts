import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { CompassService } from '../../compass/compass.service';
import { FeedNoticeDismissalService } from './feed-notice-dismissal.service';
import { NotificationsSettingsV2Service } from '../../settings-v2/account/notifications-v3/notifications-settings-v3.service';
import { EmailConfirmationService } from '../../../common/components/email-confirmation/email-confirmation.service';
import { ExperimentsService } from '../../experiments/experiments.service';
import {
  NoticePosition,
  Notices,
  NoticeIdentifier,
} from '../feed-notice.types';
import { ActivityV2ExperimentService } from '../../experiments/sub-services/activity-v2-experiment.service';

/**
 * Determines which feed notices to show, and holds state on
 * which have already been shown / completed.
 */
@Injectable({ providedIn: 'root' })
export class FeedNoticeService extends AbstractSubscriberComponent {
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
    private dismissService: FeedNoticeDismissalService,
    private compass: CompassService,
    private notificationSettings: NotificationsSettingsV2Service,
    private emailConfirmation: EmailConfirmationService,
    private activityV2Experiment: ActivityV2ExperimentService
  ) {
    super();
    this.initSubscriptions();
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
   * Sets a notice dismissed state and saves state on dismissal to local storage.
   * @param { NoticeIdentifier } notice - name of notice to set dismissed state for.
   * @param { boolean } value - value to set the notice's dismissed state to.
   */
  public dismiss(notice: NoticeIdentifier): void {
    this.notices[notice].dismissed = true;
    this.setShown(notice, false);
    this.dismissService.dismissNotice(notice);
    this.updatedState$.next(true);
  }

  /**
   * Whether full width notices should be shown. (if activity v3 experiment is active).
   * @returns { boolean } - true if full width notices should be shown.
   */
  public shouldBeFullWidth(): boolean {
    return this.activityV2Experiment.isActive();
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
    return this.emailConfirmation.requiresEmailConfirmation();
  }

  /**
   * Whether compass answers are required.
   * @returns { Promise<boolean> }
   */
  private async hasCompletedCompassAnswers(): Promise<boolean> {
    return this.compass.hasCompletedCompassAnswers();
  }

  /**
   * Whether push notifications are enabled.
   * @returns { Promise<boolean> } true if user has push notifications enabled.
   */
  private async hasPushNotificationsEnabled(): Promise<boolean> {
    return this.notificationSettings.pushNotificationsEnabled$.toPromise();
  }

  /**
   * Determine whether notice has been dismissed within service specified time-frame.
   * @param { NoticeIdentifier } notice - identifier of notice to check.
   * @returns { boolean } true if notice has been dismissed within service specified time-frame.
   */
  private isNoticeDismissed(notice: NoticeIdentifier): boolean {
    if (this.notices[notice].dismissed) {
      return true;
    }
    return this.dismissService.isNoticeDismissed(notice);
  }

  /**
   * Initialize subscriptions.
   * @returns { void }
   */
  private initSubscriptions(): void {
    this.subscriptions.push(
      this.emailConfirmation.success$
        .pipe(filter(Boolean))
        .subscribe(success => {
          this.dismiss('verify-email');
        })
    );
  }
}
