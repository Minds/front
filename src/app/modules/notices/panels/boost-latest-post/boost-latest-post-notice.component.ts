import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActivityEntity } from '../../../newsfeed/activity/activity.service';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { BoostLatestPostNoticeService } from './boost-latest-post-notice.service';
import { BoostConsoleLocationFilter } from '../../../boost/boost.types';
import { BoostModalV2LazyService } from '../../../boost/modal-v2/boost-modal-v2-lazy.service';
import { Session } from '../../../../services/session';

/**
 * Notice that displays both as a feed notice and inside the v2 boost console.
 * As a feed notice, it directs users to boost their latest post, if there is one.
 * It dismisses itself when user clicks primary button.
 *
 * In the boost console, if the user is on the 'sidebar' tab
 * (and not the 'newsfeed' tab), clicking the button opens
 * the boost modal for boosting the user's channel.
 */
@Component({
  selector: 'm-feedNotice--boostLatestPost',
  templateUrl: 'boost-latest-post-notice.component.html',
})
export class BoostLatestPostNoticeComponent implements OnInit, OnDestroy {
  /**
   * False if this is displayed in the boost console
   */
  @Input() isInFeed = true;

  /**
   * Determines whether clicking primary button should
   * help create a channel boost or a boosted post
   */
  protected _targetBoostLocation: BoostConsoleLocationFilter = 'feed';

  /**
   * If this is displayed in the boost console, which tab are we on?
   */
  @Input() set targetBoostLocation(location: BoostConsoleLocationFilter) {
    if (location !== 'feed' && location !== 'sidebar') {
      // Failsafe b/c 'all' is an option for admins
      this._targetBoostLocation = 'feed';
    } else {
      this._targetBoostLocation = location;
    }
  }

  public latestPost: ActivityEntity = null;

  private subscriptions: Array<Subscription> = [];

  constructor(
    protected service: BoostLatestPostNoticeService,
    private feedNotice: FeedNoticeService,
    private router: Router,
    private session: Session,
    private boostModal: BoostModalV2LazyService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.latestPost$.subscribe(latestPost => {
        if (!latestPost) {
          this.onDismissClick();
        } else {
          this.latestPost = latestPost;
        }
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Called on primary option click.
   * @return { void }
   */
  public onPrimaryOptionClick(): void {
    this.onDismissClick();

    if (this._targetBoostLocation === 'feed') {
      // Navigate to SEP of latest post, where boost modal will open after a short delay
      this.router.navigate(['newsfeed', this.latestPost.guid], {
        queryParams: {
          boostModalDelayMs: 1000,
        },
      });
    } else if (this._targetBoostLocation === 'sidebar') {
      this.openBoostChannelModal();
    }
  }

  // Open the boost modal, prepopulated with user's channel
  async openBoostChannelModal(): Promise<void> {
    if (!this.session.getLoggedInUser()) {
      return;
    }

    try {
      await this.boostModal.open(this.session.getLoggedInUser());
      return;
    } catch (e) {
      // do nothing.
    }
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public onDismissClick(): void {
    if (this.isInFeed) {
      this.feedNotice.dismiss('boost-latest-post');
    }
  }
}
