import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FeedNotice, NoticeLocation } from '../feed-notice.types';
import { BehaviorSubject, EMPTY, Subscription } from 'rxjs';
import { FeedNoticeService } from '../services/feed-notice.service';
import {
  catchError,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';

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
        <m-feedNotice--supermindPending
          *ngSwitchCase="'supermind-pending'"
        ></m-feedNotice--supermindPending>
        <m-feedNotice--setupChannel
          *ngSwitchCase="'setup-channel'"
        ></m-feedNotice--setupChannel>
        <m-feedNotice--verifyUniqueness
          *ngSwitchCase="'verify-uniqueness'"
        ></m-feedNotice--verifyUniqueness>
        <m-feedNotice--connectWallet
          *ngSwitchCase="'connect-wallet'"
        ></m-feedNotice--connectWallet>
        <m-feedNotice--buildYourAlgorithm
          *ngSwitchCase="'build-your-algorithm'"
        ></m-feedNotice--buildYourAlgorithm>
        <m-feedNotice--enablePushNotifications
          *ngSwitchCase="'enable-push-notifications'"
        ></m-feedNotice--enablePushNotifications>
        <m-feedNotice--updateTags
          *ngSwitchCase="'update-tags'"
        ></m-feedNotice--updateTags>
        <m-feedNotice--plusUpgrade
          *ngSwitchCase="'plus-upgrade'"
        ></m-feedNotice--plusUpgrade>
        <m-feedNotice--boostChannel
          *ngSwitchCase="'boost-channel'"
        ></m-feedNotice--boostChannel>
        <m-feedNotice--inviteYourFriends
          *ngSwitchCase="'invite-your-friends'"
        ></m-feedNotice--inviteYourFriends>
      </ng-container>
    </ng-container>
  `,
})
export class FeedNoticeOutletComponent implements OnInit, OnDestroy {
  // location of component - where should it show 'top' or 'inline' in the feed.
  @Input() location: NoticeLocation = 'top';

  // name of currently active notice.
  public notice$: BehaviorSubject<FeedNotice> = new BehaviorSubject<FeedNotice>(
    null
  );

  // index of outlet relative to other outlets. Top outlets will be -1.
  protected position: number = null;

  // array of subscriptions to be unsubscribed from on destroy.
  private subscriptions: Subscription[] = [];

  // Makes notice to stick to the top of the feed.
  @HostBinding('class.m-feedNoticeOutlet__container--sticky')
  @Input()
  stickyTop: boolean;

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

  constructor(private service: FeedNoticeService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      // wait till service has finished fetching from server.
      this.service.initialized$
        .pipe(
          // filter out non-true values.
          filter((completed: boolean) => !!completed),
          /**
           * register outlet with service and replace observable with
           * one representing the notice to show for this position.
           */
          switchMap((success: boolean) => {
            this.position = this.service.register(this.location);
            return this.service.getNoticeForPosition$(this.position);
          }),
          // filter out null notices.
          filter((notice: FeedNotice) => !!notice),
          // only continue if the notice has changed.
          distinctUntilChanged(),
          // update this classes notice.
          tap((notice: FeedNotice) => {
            if (this.service.shouldBeStickyTop(notice)) {
              this.stickyTop = true;
            }
            this.notice$.next(notice);
          }),
          catchError(e => {
            console.error(e);
            return EMPTY;
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    const notice = this.notice$.getValue();
    if (notice && notice.key) {
      this.service.unregister(notice.key);

      if (this.stickyTop) {
        this.stickyTop = false;
      }
    }
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
