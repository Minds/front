import { DismissalService } from './../../../common/services/dismissal.service';
import { Component, Input, OnInit } from '@angular/core';
import { FeedsService } from '../../../common/services/feeds.service';
import { ExperimentsService } from '../../experiments/experiments.service';
import { FeedNoticeService } from '../../notices/services/feed-notice.service';
import { Session } from '../../../services/session';

/**
 * A default recommendations feed - can be accessed by logged-out users.
 * Users subscribers of a recommendations user on the backend.
 */
@Component({
  selector: 'm-defaultFeed',
  providers: [FeedsService],
  templateUrl: 'feed.component.html',
  styleUrls: ['./feed.component.ng.scss'],
})
export class DefaultFeedComponent implements OnInit {
  /**
   * the location in which this feed appears. Used for
   * recommendations widget
   */
  @Input()
  location: string;

  /**
   * Whether the header of the feed should be visible
   */
  @Input()
  visibleHeader: boolean = false;

  /**
   * Whether channel recommendation component is dismissed
   */
  isChannelRecommendationDismissed$ = this.dismissal.dismissed(
    'channel-recommendation:feed'
  );

  constructor(
    public feedsService: FeedsService,
    public experiments: ExperimentsService,
    private feedNoticeService: FeedNoticeService,
    private dismissal: DismissalService,
    private session: Session
  ) {}

  public ngOnInit(): void {
    this.load(true);
    this.feedNoticeService.fetch();
  }

  /**
   * Loads more content to the feed.
   * @returns { void }
   */
  public loadNext(): void {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue()
    ) {
      this.feedsService.fetch();
    }
    this.feedsService.loadMore();
  }

  /**
   * Whether a boost should be shown in a given feed position.
   * @param { number } position - index / position in feed.
   * @returns { boolean } - true if a boost should be shown in given feed position
   */
  public shouldShowBoostInPosition(position: number): boolean {
    return (
      this.isLoggedIn() &&
      ((position > 0 && position % 5 === 0) || position === 3)
    );
  }

  /**
   * Loads the feed.
   * @returns { void }
   * @param refresh
   */
  private load(refresh: boolean = false): void {
    if (refresh) {
      this.feedsService.clear(true);
    }

    try {
      let endpoint = `api/v3/newsfeed/default-feed`;
      if (this.location) {
        endpoint = `api/v3/newsfeed/feed/clustered-recommendations`;
      }
      this.feedsService
        .setEndpoint(endpoint)
        .setLimit(12)
        .setUnseen(true)
        .fetch(refresh);
    } catch (e) {
      console.error('DefaultFeedComponent', e);
    }
  }

  /**
   * whether channel recommendation should be shown
   * @param { number } index the index of the feed
   * @returns { boolean }
   */
  shouldShowChannelRecommendation(index: number) {
    if (!this.isLoggedIn()) {
      return false;
    }

    if (!this.location) {
      return false;
    }

    if (this.feedsService.feedLength <= 3) {
      // if the newsfeed length was less than equal to 3,
      // show the widget after last item
      return index === this.feedsService.feedLength - 1;
    }

    // show after the 3rd post
    return index === 2;
  }

  /**
   * Whether a git couser is logged in.
   * @returns { boolean } true if a user is logged in.
   */
  public isLoggedIn(): boolean {
    return this.session.isLoggedIn();
  }
}
