import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';
import { ActivityEntity } from '../../../newsfeed/activity/activity.service';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { BoostLatestPostNoticeService } from './boost-latest-post-notice.service';

/**
 * Feed notice directing users to boost their latest post.
 * Dismisses itself when user clicks primary button.
 *
 * Will be automatically dismissed if the user has made no posts.
 */
@Component({
  selector: 'm-feedNotice--boostLatestPost',
  templateUrl: 'boost-latest-post-notice.component.html',
})
export class BoostLatestPostNoticeComponent implements OnInit, OnDestroy {
  private boostModalCompletionSubscription: Subscription;
  private latestPost: ActivityEntity;

  constructor(
    private service: BoostLatestPostNoticeService,
    private feedNotice: FeedNoticeService,
    private boostModal: BoostModalLazyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.latestPost$.subscribe(latestPost => {
      console.log('ojm latestPostRx', latestPost);

      if (!latestPost) {
        console.log('ojm nolatestPost', latestPost);
        this.onDismissClick();
      } else {
        this.latestPost = latestPost;
      }
    });

    // ojm remove all boost modal tracking
    // and close after primary button is clicked??
    this.boostModalCompletionSubscription = this.boostModal.onComplete$.subscribe(
      (completed: boolean) => {
        this.onDismissClick();
      }
    );
  }

  ngOnDestroy(): void {
    this.boostModalCompletionSubscription?.unsubscribe();
  }

  /**
   * Called on primary option click. Navigates to SEP of latest post,
   * where boost modal will open after a short delay
   * @return { void }
   */
  public onPrimaryOptionClick(): void {
    if (!this.latestPost) {
      return;
    }
    // ojm this.boostModal.open(this.session.getLoggedInUser());
    this.router.navigate(['newsfeed', this.latestPost.guid], {
      queryParams: { boost_modal_delay_ms: 400 },
    });
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public onDismissClick(): void {
    this.feedNotice.dismiss('boost-latest-post');
  }
}
