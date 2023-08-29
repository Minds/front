import { DismissalService } from './../../../common/services/dismissal.service';
import { Component, Input, OnInit } from '@angular/core';
import { FeedsService } from '../../../common/services/feeds.service';
import { ExperimentsService } from '../../experiments/experiments.service';
import { FeedNoticeService } from '../../notices/services/feed-notice.service';
import { Session } from '../../../services/session';
import { PublisherType } from '../../../common/components/publisher-search-modal/publisher-search-modal.component';
import { PublisherRecommendationsLocation } from '../../suggestions/publisher-recommendations/publisher-recommendations.component';
import { ActivityEntity } from '../../newsfeed/activity/activity.service';
import { ExplicitVotesExperimentService } from '../../experiments/sub-services/explicit-votes-experiment.service';

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
  location: PublisherRecommendationsLocation;

  /**
   * Whether the header of the feed should be visible
   */
  @Input()
  visibleHeader: boolean = false;

  /**
   * Whether publisher recommendations component is dismissed
   */
  isPublisherRecommendationsDismissed$ = this.dismissal.dismissed(
    'channel-recommendation:feed'
  );

  /**
   * Should we show channel or group recs?
   */
  recommendationsPublisherType: PublisherType;

  constructor(
    public feedsService: FeedsService,
    public experiments: ExperimentsService,
    private feedNoticeService: FeedNoticeService,
    private dismissal: DismissalService,
    private session: Session,
    private explicitVotesExperiment: ExplicitVotesExperimentService
  ) {}

  public ngOnInit(): void {
    this.load(true);
    this.feedNoticeService.fetch();

    /**
     * Randomly choose whether to show user or group recs
     */
    this.recommendationsPublisherType = Math.random() < 0.5 ? 'user' : 'group';
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
   * whether publisher recommendations should be shown
   * @param { number } index the index of the feed
   * @returns { boolean }
   */
  shouldShowPublisherRecommendations(index: number) {
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
   * Whether a user is logged in.
   * @returns { boolean } true if a user is logged in.
   */
  public isLoggedIn(): boolean {
    return this.session.isLoggedIn();
  }

  protected shouldShowActivity(activity: ActivityEntity): boolean {
    return !this.isExplicitlyDownvotedDiscoveryPost(activity);
  }

  private isExplicitlyDownvotedDiscoveryPost(
    activity: ActivityEntity
  ): boolean {
    return (
      this.location === 'discovery-feed' &&
      this.explicitVotesExperiment.isActive() &&
      this.isLoggedIn() &&
      activity['thumbs:down:user_guids'].includes(
        this.session.getLoggedInUser().guid
      )
    );
  }

  /**
   * Whether a value prop card can be shown.
   * @param { number } index - index in feed.
   * @returns { boolean } true if value prop card can be shown in this position.
   */
  public canShowValuePropCard(index: number): boolean {
    return !this.isLoggedIn() && index % 2 === 0;
  }
}
