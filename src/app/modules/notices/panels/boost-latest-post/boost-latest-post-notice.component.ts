import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  private latestPostSubscription: Subscription;
  public latestPost: ActivityEntity = null;

  constructor(
    private service: BoostLatestPostNoticeService,
    private feedNotice: FeedNoticeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.latestPost$.subscribe(latestPost => {
      if (!latestPost) {
        this.onDismissClick();
      } else {
        this.latestPost = latestPost;
      }
    });
  }

  ngOnDestroy(): void {
    this.latestPostSubscription?.unsubscribe();
  }

  /**
   * Called on primary option click. Navigates to SEP of latest post,
   * where boost modal will open after a short delay
   * @return { void }
   */
  public onPrimaryOptionClick(): void {
    this.onDismissClick();

    this.router.navigate(['newsfeed', this.latestPost.guid], {
      queryParams: { boostModalDelayMs: 400 },
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
