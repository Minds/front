import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NoticeKey, NoticeLocation } from '../feed-notice.types';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { TopbarAlertService } from '../../../common/components/topbar-alert/topbar-alert.service';
import { FeedNoticeDismissalService } from '../services/feed-notice-dismissal.service';

/**
 * Switch for feed notices. Use this if you know the key of the notice you wish to display.
 */
@Component({
  selector: 'm-feedNotice__switch',
  templateUrl: './feed-notice-switch.component.html',
  styleUrls: ['./feed-notice-outlet.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedNoticeSwitchComponent implements OnInit, OnDestroy {
  // The key of the notice to load
  @Input() key: NoticeKey;

  // Location can either be inline or top. This is to be provided by the parent.
  @Input() location: NoticeLocation;

  // Makes notice to stick to the top of the feed.
  @HostBinding('class.m-feedNoticeOutlet__container--sticky')
  stickyTop: boolean;

  @HostBinding('class.m-feedNoticeOutlet__container--topbarAlertShown')
  topbarAlertShown: boolean;

  // If the user has dismissed this notice locally
  isDismissed = false;

  /**
   * If a notice is visible (helps us get rid of borders when no notice is shown).
   * @returns { boolean } - true if a notice is visible.
   */
  @HostBinding('class.m-feedNoticeOutlet__container--visible')
  get isVisible(): boolean {
    return !!this.key && !this.isDismissed;
  }

  /**
   * Whether is in top position.
   * @returns { boolean } whether notice should be in top position.
   */
  @HostBinding('class.m-feedNoticeOutlet__container--topPosition')
  get isTopLocation(): boolean {
    return this.location === 'top';
  }

  subscriptions: Subscription[];

  constructor(
    private dismissalService: FeedNoticeDismissalService,
    private topbarAlertService: TopbarAlertService
  ) {}

  ngOnInit(): void {
    this.dismissalService.isNoticeDismissed(this.key);
    this.subscriptions = [
      this.topbarAlertService.shouldShow$
        .pipe(distinctUntilChanged())
        .subscribe((shouldShow: boolean) => {
          this.topbarAlertShown = shouldShow;
        }),
      this.dismissalService.dismissedEvent$
        .pipe(filter(noticeId => noticeId === this.key))
        .subscribe(() => (this.isDismissed = true)),
    ];
  }

  ngOnDestroy(): void {
    // const notice = this.notice$.getValue();
    // if (notice && notice.key) {
    //   this.service.unregister(notice.key);

    //   if (this.stickyTop) {
    //     this.stickyTop = false;
    //   }
    // }
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
