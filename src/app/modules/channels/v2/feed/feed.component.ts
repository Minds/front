import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FeedService } from './feed.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelsV2Service } from '../channels-v2.service';
import { FeedFilterType } from '../../../../common/components/feed-filter/feed-filter.component';
import { FeedsService } from '../../../../common/services/feeds.service';
import { FeedsUpdateService } from '../../../../common/services/feeds-update.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Session } from '../../../../services/session';

/**
 * Channel feed component
 */
@Component({
  selector: 'm-channel__feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'feed.component.html',
  styleUrls: ['feed.component.ng.scss'],
  providers: [FeedService, FeedsService],
})
export class ChannelFeedComponent implements OnDestroy, OnInit {
  isGrid: boolean = false;

  @Input('layout') set _layout(layout: string) {
    this.isGrid = layout === 'grid';
    this.detectChanges();
  }

  /**
   * Parses the view onto the current feed/type
   * @param view
   * @private
   */
  @Input('view') set _view(view: string) {
    switch (view) {
      case 'activities':
      case 'images':
      case 'videos':
      case 'blogs':
        this.feed.sort$.next('latest');
        this.feed.type$.next(view);
        break;

      case 'scheduled':
        this.feed.sort$.next('scheduled');
        this.feed.type$.next('activities');
        break;

      default:
        // TODO: Warning / error / redirect?
        this.feed.sort$.next('latest');
        this.feed.type$.next('activities');
    }
  }

  /**
   * Subscription to channel's GUID
   */
  protected guidSubscription: Subscription;

  /**
   * Listening for new posts.
   */
  private feedsUpdatedSubscription: Subscription;

  /**
   * Constructor
   * @param feed
   * @param service
   * @param router
   */
  constructor(
    public feed: FeedService,
    public service: ChannelsV2Service,
    protected router: Router,
    protected route: ActivatedRoute,
    public feedsUpdate: FeedsUpdateService,
    private session: Session,
    protected cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.guidSubscription = this.service.guid$.subscribe(guid =>
        this.feed.guid$.next(guid)
      );
    }
  }

  ngOnInit() {
    this.feedsUpdatedSubscription = this.feedsUpdate.postEmitter.subscribe(
      newPost => {
        if (
          this.feed.guid$.getValue() === this.session.getLoggedInUser().guid
        ) {
          this.prepend(newPost);
        }
      }
    );
  }

  prepend(activity: any) {
    if (!activity) {
      return;
    }

    // TODO: Increment scheduled count https://gitlab.com/minds/front/-/issues/3127
    // if (activity.time_created > Date.now() / 1000) { // and route is actually on a channel.
    // this.feed.scheduledCount$ = this.feed.scheduledCount$.pipe(
    //   map(count => count++)
    // );
    // }

    let feedItem = {
      entity: activity,
      urn: activity.urn,
      guid: activity.guid,
    };

    // Todo: Move to FeedsService
    this.feed.service.rawFeed.next([
      ...[feedItem],
      ...this.feed.service.rawFeed.getValue(),
    ]);
  }

  /**
   * Destroy lifecycle hook
   */
  ngOnDestroy(): void {
    if (this.guidSubscription) {
      this.guidSubscription.unsubscribe();
    }
    if (this.feedsUpdatedSubscription) {
      this.feedsUpdatedSubscription.unsubscribe();
    }
  }

  /**
   * Type changes
   * @param type
   */
  onTypeChange(type: FeedFilterType) {
    const filter = type !== 'activities' ? type : '';
    this.router.navigate(['/', this.service.username$.getValue(), filter], {
      preserveQueryParams: true,
    });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
