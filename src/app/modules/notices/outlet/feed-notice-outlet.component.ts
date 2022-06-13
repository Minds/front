import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FeedNotice, NoticeLocation } from '../feed-notice.types';
import { BehaviorSubject } from 'rxjs';
import { FeedNoticeService } from '../services/feed-notice.service';
import { distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';

/**
 * Outlet for feed notices - use this component to show a relevant
 * notice in or on-top of a feed. Component will use service to sync
 * state and ensure no duplicate notices are shown.
 */
@Component({
  selector: 'm-feedNotice__outlet',
  styleUrls: ['./feed-notice-outlet.component.ng.scss'],
  template: `
    <ng-container *ngIf="(notice$ | async) && !(notice$ | async).dismissed">
      <ng-container [ngSwitch]="(notice$ | async)?.key">
        <m-feedNotice--verifyEmail
          *ngSwitchCase="'verify-email'"
        ></m-feedNotice--verifyEmail>
        <m-feedNotice--buildYourAlgorithm
          *ngSwitchCase="'build-your-algorithm'"
        ></m-feedNotice--buildYourAlgorithm>
        <m-feedNotice--enablePushNotifications
          *ngSwitchCase="'enable-push-notifications'"
        ></m-feedNotice--enablePushNotifications>
        <m-feedNotice--updateTags
          *ngSwitchCase="'update-tags'"
        ></m-feedNotice--updateTags>
      </ng-container>
    </ng-container>
  `,
})
export class FeedNoticeOutletComponent extends AbstractSubscriberComponent
  implements OnInit {
  // location of component - where should it show 'top' or 'inline' in the feed.
  @Input() location: NoticeLocation = 'top';

  // name of currently active notice.
  public notice$: BehaviorSubject<FeedNotice> = new BehaviorSubject<FeedNotice>(
    null
  );

  // index of outlet relative to other outlets. Top outlets will be -1.
  protected position: number = null;

  /**
   * If experiment is active, full width class.
   * @returns { boolean } - true if should be shown as full width.
   */
  @HostBinding('class.m-feedNoticeOutlet__container--fullWidth')
  get isFullWidth(): boolean {
    return this.service.shouldBeFullWidth();
  }

  /**
   * If a notice is visible (helps us get rid of borders when no notice is shown).
   * @returns { boolean } - true if a notice is visible.
   */
  @HostBinding('class.m-feedNoticeOutlet__container--visible')
  get isVisible(): boolean {
    const notice = this.notice$.getValue();
    return !!notice && !notice.dismissed;
  }

  /**
   * Whether is in top position.
   * @returns { boolean } whether notice should be in top position.
   */
  @HostBinding('class.m-feedNoticeOutlet__container--topPosition')
  get isTopLocation(): boolean {
    return this.location === 'top';
  }

  constructor(public service: FeedNoticeService) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      // wait till service has finished fetching from server.
      this.service.initialized$
        .pipe(
          // filter out non-true values.
          filter(Boolean),
          /**
           * Register outlet with service and replace observable with
           * one representing the notice to show for this position.
           */
          switchMap((success: boolean) => {
            this.position = this.service.register(this.location);
            return this.service.getNoticeForPosition$(this.position);
          }),
          // Only continue if the notice has changed.
          distinctUntilChanged(),
          // Update this classes notice.
          tap((notice: FeedNotice) => {
            this.notice$.next(notice);
          })
        )
        .subscribe()
    );
  }
}
