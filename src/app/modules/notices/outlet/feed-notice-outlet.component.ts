import { Component, Input, OnInit } from '@angular/core';
import { FeedNoticeService } from '../services/feed-notice.service';
import { NoticePosition, NoticeIdentifier } from '../feed-notice.types';

/**
 * Outlet for feed notices - use this component to show a relevant
 * notice in or on-top of a feed. Component will use service to sync
 * state and ensure no duplicate notices are shown.
 */
@Component({
  selector: 'm-feedNotice__outlet',
  template: `
    <m-feedNotice--verifyEmail
      *ngIf="shouldShowNotice('verify-email')"
    ></m-feedNotice--verifyEmail>
    <m-feedNotice--buildYourAlgorithm
      *ngIf="shouldShowNotice('build-your-algorithm')"
    ></m-feedNotice--buildYourAlgorithm>
    <m-feedNotice--enablePushNotifications
      *ngIf="shouldShowNotice('enable-push-notifications')"
    ></m-feedNotice--enablePushNotifications>
  `,
})
export class FeedNoticeOutletComponent implements OnInit {
  // name of currently active notice.
  public activeNotice: NoticeIdentifier = null;

  // positioning of component - where should it show 'top' or feed, or 'inline' in the feed.
  @Input() position: NoticePosition = 'top';

  // should show new notices even when service identifies another notice has already been shown.
  // not designed to show notices linearly - designed to be used in a for loop every x positions of a feed.
  @Input() showMultiple: boolean = false;

  constructor(private service: FeedNoticeService) {}

  ngOnInit(): void {
    this.initNotice();
  }

  /**
   * Gets next active notice from service, sets it to local state to be shown
   * and informs the service that this instance is showing that notice already.
   * @returns { void }
   */
  private initNotice(): void {
    const notice = this.showMultiple
      ? this.service.getNextShowableNotice(this.position)
      : this.service.getNextUncompletedNotice();

    if (!notice || !this.service.shouldShowInPosition(notice, this.position)) {
      return;
    }

    this.activeNotice = notice;
    this.service.setShown(notice, true);
  }

  /**
   * Determines whether the active notice, matches the notice name passed in.
   * @param { NoticeIdentifier } notice - name of the notice to check.
   * @returns { boolean } - true if notice should be shown.
   */
  public shouldShowNotice(notice: NoticeIdentifier): boolean {
    return this.activeNotice === notice && !this.service.isDismissed(notice);
  }
}
