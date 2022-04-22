import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FeedNoticeStorageArray, NoticeIdentifier } from '../feed-notice.types';
import { isPlatformServer } from '@angular/common';
import * as moment from 'moment';
import { ObjectLocalStorageService } from '../../../common/services/object-local-storage.service';

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

  constructor(private objectStorage: ObjectLocalStorageService) {}

  /**
   * Set a notice to a dismissed state.
   * @param { NoticeIdentifier } noticeId - identifier of notice to set to dismissed state.
   * @returns { this }
   */
  public dismissNotice(noticeId: NoticeIdentifier): this {
    this.objectStorage.setSingle(this.storageKey, {
      [noticeId]: {
        timestamp: moment(),
      },
    });
    return this;
  }

  /**
   * Check whether a notice has been dismissed within last X days, set by class variable expirationDays.
   * @param { NoticeIdentifier } noticeId - identifier of notice to check.
   * @returns { boolean } true if notice is in a dismissed state.
   */
  public isNoticeDismissed(noticeId: NoticeIdentifier): boolean {
    const allDismissedNotices = this.objectStorage.getAll(this.storageKey);

    if (!allDismissedNotices || !allDismissedNotices[noticeId]) {
      return false;
    }

    const dismissedNotice = allDismissedNotices[noticeId];
    const dismissDate = moment(dismissedNotice['timestamp']);
    const thresholdDate = moment().subtract(this.expirationDays, 'days');

    return dismissDate.isAfter(thresholdDate);
  }
}
