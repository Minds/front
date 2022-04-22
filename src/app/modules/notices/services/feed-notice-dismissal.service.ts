import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FeedNoticeStorageArray, NoticeIdentifier } from '../feed-notice.types';
import { isPlatformServer } from '@angular/common';
import * as moment from 'moment';

/**
 * Service that handles dismissal of feed notices by managing a structure in local storage
 * mapping notice name to timestamp of dismissal. If the timestamp indicates the notice is expired
 * isNoticeDismissed will return false. If the dismissal is still valid is will return true.
 *
 * Helper functions can be called for various interactions with local storage as well as checking notice state.
 */
@Injectable({ providedIn: 'root' })
export class FeedNoticeDismissalService {
  // Key for local storage entry.
  private readonly storageKey: string = 'dismissed-feed-notices';

  // Amount of days until dismissal is considered expired.
  private readonly expirationDays: number = 60;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Set a notice to a dismissed state.
   * @param { NoticeIdentifier } noticeId - identifier of notice to set to dismissed state.
   * @returns { this }
   */
  public dismissNotice(noticeId: NoticeIdentifier): this {
    if (isPlatformServer(this.platformId)) return this;

    const currentNotices = this.getAll();
    const updatedNotice = {
      [noticeId]: {
        timestamp: moment(),
      },
    };

    return this.setAll({
      ...currentNotices,
      ...updatedNotice,
    });
  }

  /**
   * Check whether a notice has been dismissed within last X days, set by class variable expirationDays.
   * @param { NoticeIdentifier } noticeId - identifier of notice to check.
   * @returns { boolean } true if notice is in a dismissed state.
   */
  public isNoticeDismissed(noticeId: NoticeIdentifier): boolean {
    const allDismissedNotices = this.getAll();

    if (!allDismissedNotices || !allDismissedNotices[noticeId]) {
      return false;
    }

    const dismissedNotice = allDismissedNotices[noticeId];
    const dismissDate = moment(dismissedNotice['timestamp']);
    const thresholdDate = moment().subtract(this.expirationDays, 'days');

    return dismissDate.isAfter(thresholdDate);
  }

  /**
   * Overwrite the whole entry in local storage.
   * @param { FeedNoticeStorageArray } notices - replacement notices.
   * @returns { this }
   */
  public setAll(notices: FeedNoticeStorageArray): this {
    if (isPlatformServer(this.platformId)) return this;
    localStorage.setItem(this.storageKey, JSON.stringify(notices));
    return this;
  }

  /**
   * Gets all notices from local storage.
   * @returns { FeedNoticeStorageArray } All notice storage entries as array.
   */
  public getAll(): FeedNoticeStorageArray {
    if (isPlatformServer(this.platformId)) return [];
    return JSON.parse(localStorage.getItem(this.storageKey)) ?? null;
  }

  /**
   * Delete all entries from storage object.
   * @returns { this }
   */
  public deleteAll(): this {
    if (isPlatformServer(this.platformId)) return this;
    localStorage.removeItem(this.storageKey);
    return this;
  }
}
