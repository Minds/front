import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ActivityV2ExperimentService } from '../../experiments/sub-services/activity-v2-experiment.service';
import { FeedNotice, NoticeKey, NoticeLocation } from '../feed-notice.types';
import { FeedNoticeDismissalService } from './feed-notice-dismissal.service';

/**
 * Manages the handling of feed notices. An outlet should register with this service
 * to receive a "position" which is an index of an outlets place relative to other outlets.
 * An outlet can then check getNoticeForPosition$(position) to see what notice should
 * be shown in the outlets position is (will be null if one should not be shown).
 */
@Injectable({ providedIn: 'root' })
export class FeedNoticeService extends AbstractSubscriberComponent {
  /**
   * True when fetch request is initialized, allowing outlets to act when
   * notices are ready for registration.
   * @type { BehaviorSubject<boolean> }
   */
  public readonly initialized$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Feed notices.
   * @type { BehaviorSubject<FeedNotice[]> }
   */
  protected readonly notices$: BehaviorSubject<
    FeedNotice[]
  > = new BehaviorSubject<FeedNotice[]>([]);

  /**
   * The amount of feed notices to show.
   * TODO: build getters and setters for this when it becomes
   * a requirement to have more than one notice at a time.
   * @type { number }
   */
  protected showAmount: number = 1;

  constructor(
    private api: ApiService,
    private activityV2Experiment: ActivityV2ExperimentService,
    private dismissalService: FeedNoticeDismissalService
  ) {
    super();
    this.fetch();
  }

  /**
   * Fetch notices from server. Will set initialized to true on completion.
   * @returns { void }
   */
  public fetch(): void {
    this.subscriptions.push(
      this.api
        .get('api/v3/feed-notices')
        .pipe(
          take(1),
          map((response: ApiResponse) => {
            if (response.status === 'success' && response.notices.length) {
              let i = 0;
              for (let notice of response.notices) {
                notice.dismissed = this.dismissalService.isNoticeDismissed(
                  notice.key
                );
                notice.position = null;
              }
              this.notices$.next(response.notices);
              this.initialized$.next(true);
            }
            return response.notices;
          }),
          catchError(e => {
            // only reset this on error
            console.error(e);
            return EMPTY;
          })
        )
        .subscribe()
    );
  }

  /**
   * Register an outlet, passing back the outlets position, that the outlet can use
   * to ask this service what notice it should be showing.
   * @param { NoticeLocation } location - location to register an outlet for.
   * @returns { number } position given to the outlet.
   */
  public register(location: NoticeLocation): number {
    const nextNotice = this.getNextNotice(location);

    if (!nextNotice) {
      return;
    }

    if (location === 'top') {
      nextNotice.position = -1;
    } else {
      nextNotice.position = this.getNextNoticePosition();
    }

    this.patchNoticeAttribute(nextNotice.key, 'position', nextNotice.position);
    return nextNotice.position;
  }

  /**
   * Unregister an outlet by position.
   * @param { NoticeKey } noticeKey - key of notice to unregister
   */
  public unregister(noticeKey: NoticeKey): void {
    this.patchNoticeAttribute(noticeKey, 'position', null);
  }

  /**
   * Gets next notice to be shown for outlet position.
   * Note position !== location! - a position is an outlets index relative
   * to other outlets, and can be attained by calling the register function.
   * @param { number } position -  position to get notice for.
   * @returns { Observable<FeedNotice> }
   */
  public getNoticeForPosition$(position: number): Observable<FeedNotice> {
    return this.notices$.pipe(
      map(notices => {
        notices = this.filterPriorityNotices(notices);

        return (
          notices.filter(notice => {
            return notice.position === position;
          })[0] ?? null
        );
      })
    );
  }

  /**
   * Dismiss a notice, updating local state and storage.
   * @param { NoticeKey } noticeKey - key of notice to dismiss.
   */
  public dismiss(noticeKey: NoticeKey): void {
    this.patchNoticeAttribute(noticeKey, 'dismissed');
    this.dismissalService.dismissNotice(noticeKey);
  }

  /**
   * Whether full width notices should be shown. (if activity v2 experiment is active).
   * @returns { boolean } - true if full width notices should be shown.
   */
  public shouldBeFullWidth(): boolean {
    return this.activityV2Experiment.isActive();
  }

  /**
   * Whether the outlet should be shown with styling to stick to top of feed.
   * @param { FeedNotice } - notice to check.
   * @returns { boolean } true if sticky top styling should be applied.
   */
  public shouldBeStickyTop(notice: FeedNotice): boolean {
    return this.shouldBeFullWidth() && notice.key === 'verify-email';
  }

  /**
   * Gets the next notice for a given location that is showable and not assigned a position.
   * @param { NoticeLocation } location - location to get next notice for.
   * @returns { FeedNotice } - the next notice.
   */
  protected getNextNotice(location: NoticeLocation): FeedNotice {
    let notices = this.notices$.getValue();

    return (
      notices.filter(notice => {
        return (
          this.isShowable(notice) &&
          !this.isAssignedPosition(notice) &&
          notice.location === location
        );
      })[0] ?? null
    );
  }

  protected filterPriorityNotices(notices: FeedNotice[]): FeedNotice[] {
    const shouldShow = [];

    for (let notice of notices) {
      if (this.isShowable(notice)) {
        shouldShow.push(notice);
        if (shouldShow.length >= this.showAmount) {
          break;
        }
      }
    }

    return shouldShow;
  }

  /**
   * Gets next notice position by incrementing the existing highest position by 1.
   * @returns { number } - next notice position.
   */
  protected getNextNoticePosition(): number {
    let notices = this.notices$.getValue();
    return (Math.max(...notices.map(notice => notice.position)) ?? 0) + 1;
  }

  /**
   * Whether notice show show, and is not dismissed.
   * @param { FeedNotice } notice - notice to check.
   * @returns { boolean } - true if notice is showable.
   */
  protected isShowable(notice: FeedNotice): boolean {
    return notice.should_show && !notice.dismissed;
  }

  /**
   * If notice is assigned position.
   * @param { FeedNotice } notice - notice to check.
   * @returns { boolean } - true if notice is already assigned position.
   */
  protected isAssignedPosition(notice: FeedNotice): boolean {
    return !!notice.position;
  }

  /**
   * Patch an individual attribute of a notice in the notices$ array.
   * @param { NoticeKey } noticeKey - key of notice to replace attribute for.
   * @param { string } attribute - string key of attribute.
   * @param { any } value - value to set attribute to - defaults to true.
   * @returns { void }
   */
  protected patchNoticeAttribute(
    noticeKey: NoticeKey,
    attribute: string,
    value: any = true
  ) {
    let notices = this.notices$.getValue();
    notices = notices.map(notice => {
      if (notice.key === noticeKey) {
        notice[attribute] = value;
      }
      return notice;
    });
    this.notices$.next(notices);
  }
}
