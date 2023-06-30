import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  OnInit,
  ChangeDetectorRef,
  Injector,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FeedService } from './feed.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelsV2Service } from '../channels-v2.service';
import { FeedFilterType } from '../../../../common/components/feed-filter/feed-filter.component';
import { FeedsService } from '../../../../common/services/feeds.service';
import { FeedsUpdateService } from '../../../../common/services/feeds-update.service';
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Session } from '../../../../services/session';
import { ThemeService } from '../../../../common/services/theme.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { catchError, take } from 'rxjs/operators';
import { AnalyticsService } from '../../../../services/analytics';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { ComposerService } from '../../../composer/services/composer.service';

/**
 * Container for channel feed, including filters and composer (if user is channel owner)
 */
@Component({
  selector: 'm-channel__feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'feed.component.html',
  styleUrls: ['feed.component.ng.scss'],
  providers: [FeedService, FeedsService, ComposerService],
})
export class ChannelFeedComponent implements OnDestroy, OnInit {
  private subscriptions: Subscription[] = [];

  @ViewChildren('feedViewChildren', { read: ElementRef })
  feedViewChildren: QueryList<ElementRef>;

  isGrid: boolean = false;

  dateRangeEnabled: boolean = false;

  /**
   * whether channel recs should be shown. Will get toggled when user
   * subscribed to the channel
   */
  private shouldShowChannelRecommendation$ = new BehaviorSubject(false);

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
        this.feedService.sort$.next('latest');
        this.feedService.type$.next(view);
        break;

      case 'scheduled':
        this.feedService.sort$.next('scheduled');
        this.feedService.type$.next('activities');
        break;

      default:
        // TODO: Warning / error / redirect?
        this.feedService.sort$.next('latest');
        this.feedService.type$.next('activities');
    }
  }

  feed: Object[] = [];

  readonly publisherRecommendationsTitle = $localize`:@@M__CHANNEL_RECOMMENDATION__CONSIDER_SUBSCRIBING_TO:Consider subscribing to`;

  /**
   * Constructor
   * @param feed
   * @param service
   * @param router
   */
  constructor(
    public feedService: FeedService,
    public service: ChannelsV2Service,
    protected router: Router,
    protected route: ActivatedRoute,
    public feedsUpdate: FeedsUpdateService,
    private session: Session,
    protected cd: ChangeDetectorRef,
    private themesService: ThemeService,
    private composerModal: ComposerModalService,
    private injector: Injector,
    private analyticsService: AnalyticsService,
    private clientMeta: ClientMetaDirective,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.subscriptions.push(
        this.service.guid$.subscribe(guid => {
          this.feedService.guid$.next(guid);

          // Reset date range filter on channel change
          this.feedService.dateRange$.next({ fromDate: null, toDate: null });
        })
      );
    }
  }

  /**
   * True if current theme is dark.
   * @returns { Observable<boolean> } - true if theme is dark, else false.
   */
  get isDarkTheme$(): Observable<boolean> {
    return this.themesService.isDark$;
  }

  /**
   * Determines whether current channel is users own channel.
   * @returns { boolean } - True if user owns channel.
   */
  get isOwnedChannel(): boolean {
    return (
      this.session.getLoggedInUser().guid === this.service.guid$.getValue()
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.feedService.service.feed.subscribe(feed => {
        this.feed = feed;
      }),
      this.feedsUpdate.postEmitter.subscribe(newPost => {
        const currentChannelGuid: string = this.service.guid$.getValue();

        if (
          // if the current channel is owned by the logged in user.
          currentChannelGuid === this.session.getLoggedInUser().guid &&
          // if new activity is a post to the users channel.
          currentChannelGuid === newPost?.container_guid
        ) {
          this.prepend(newPost);
        }
      }),
      this.service.onSubscriptionChanged.subscribe(subscribed =>
        this.shouldShowChannelRecommendation$.next(subscribed)
      ),
      // Subscribe to user entity to reset channel recommendation
      this.service.channel$.subscribe(() =>
        this.shouldShowChannelRecommendation$.next(false)
      )
    );
  }

  prepend(activity: any) {
    if (!activity) {
      return;
    }

    // TODO: Increment scheduled count https://gitlab.com/minds/front/-/issues/3127
    // if (activity.time_created > Date.now() / 1000) { // and route is actually on a channel.
    // this.feedService.scheduledCount$ = this.feedService.scheduledCount$.pipe(
    //   map(count => count++)
    // );
    // }

    let feedItem = {
      entity: activity,
      urn: activity.urn,
      guid: activity.guid,
    };

    // Todo: Move to FeedsService
    this.feedService.service.rawFeed.next([
      ...[feedItem],
      ...this.feedService.service.rawFeed.getValue(),
    ]);
  }

  /**
   * Destroy lifecycle hook
   */
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Type changes
   * @param type
   */
  onTypeChange(type: FeedFilterType) {
    const filter = type !== 'activities' ? type : '';
    this.router.navigate(['/', this.service.username$.getValue(), filter], {
      queryParamsHandling: 'preserve',
    });
  }

  /**
   * Either opens composer modal or opens blogs
   * @returns { Promise<void> } - awaitable.
   */
  public async onFirstPostButtonClick(): Promise<void> {
    this.subscriptions.push(
      this.feedService.type$
        .pipe(
          take(1),
          catchError(error => {
            console.error(error);
            return of(null);
          })
        )
        .subscribe((filter: FeedFilterType) => {
          if (filter === 'blogs') {
            this.router.navigate(['/blog/v2/edit/new']);
            return;
          }
          this.openComposerModal();
        })
    );
  }

  /**
   * Open composer modal
   * @returns { Promise<void> } - awaitable.
   */
  public async openComposerModal(): Promise<void> {
    try {
      await this.composerModal.setInjector(this.injector).present();
    } catch (e) {
      console.error(e);
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * Determines whether to show infinite scroll.
   * @returns true if infinite scroll should be shown.
   */
  public showInfiniteScroll(): boolean {
    return (
      this.feedService.service.inProgress.getValue() ||
      this.feedService.service.rawFeed.getValue().length > 0
    );
  }

  /**
   * Determines whether the publisher recommendations should be shown
   * @returns { Observable<boolean> }
   */
  get channelRecommendationVisible$(): Observable<boolean> {
    if (this.feedService.service.inProgress.getValue()) {
      return of(false);
    }

    if (!this.feedService.service.feedLength) {
      return of(true);
    }

    return this.shouldShowChannelRecommendation$;
  }

  /**
   * Whether a boost should be shown in a given feed position.
   * @param { number } position - index / position in feed.
   * @returns { boolean } - true if a boost should be shown in given feed position
   */
  public shouldShowBoostInPosition(position: number): boolean {
    return (
      this.service.channel$.getValue()?.guid !==
        this.session.getLoggedInUser()?.guid &&
      // Displays in the 2nd slot and then every 6 posts
      ((position > 4 && position % 5 === 0) || position === 0)
    );
  }
}
