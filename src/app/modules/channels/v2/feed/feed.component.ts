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
import {
  FeedFilterDateRange,
  FeedFilterType,
} from '../../../../common/components/feed-filter/feed-filter.component';
import { FeedsService } from '../../../../common/services/feeds.service';
import { FeedsUpdateService } from '../../../../common/services/feeds-update.service';
import { Observable, of, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Session } from '../../../../services/session';
import { ThemeService } from '../../../../common/services/theme.service';
import { ModalService } from '../../../composer/components/modal/modal.service';
import { ComposerService } from '../../../composer/services/composer.service';
import { catchError, take } from 'rxjs/operators';

/**
 * Channel feed component
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
    private composerModal: ModalService,
    private injector: Injector,
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
        if (
          this.feedService.guid$.getValue() ===
          this.session.getLoggedInUser().guid
        ) {
          this.prepend(newPost);
        }
      })
    );
  }

  get previousPageUrl() {
    // if we didn't have the firstTimestamp
    if (!this.feedService.service.firstTimestamp) return;
    // if we were backward paginating and we didn't
    // have a pagingToken, there are no more prev
    // pages
    if (
      !this.feedService.service.pagingToken &&
      this.feedService.service.reversedPagination
    )
      return;
    // if we weren't in offset pagination mode
    if (!this.feedService.offset) return;
    return `${window.location.origin}${window.location.pathname}?offset=${this.feedService.service.firstTimestamp}&reverse=1`;
  }

  get nextPageUrl() {
    // if no lastTimestamp return null
    if (!this.feedService.service.lastTimestamp) return null;
    // if no more pages return null
    if (!this.feedService.service.pagingToken) return null;
    return `${window.location.origin}${window.location.pathname}?offset=${this.feedService.service.lastTimestamp}`;
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
      await this.composerModal
        .setInjector(this.injector)
        .present()
        .toPromise();
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
}
