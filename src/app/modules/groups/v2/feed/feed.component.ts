import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  OnInit,
  ChangeDetectorRef,
  Injector,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
} from '@angular/core';
import { GroupFeedService } from './feed.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedsService } from '../../../../common/services/feeds.service';
import { FeedsUpdateService } from '../../../../common/services/feeds-update.service';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { ComposerService } from '../../../composer/services/composer.service';
import { GroupService } from '../group.service';
import { ComposerComponent } from '../../../composer/composer.component';
import { GroupFeedTypeFilter } from '../group.types';
import { MindsGroup } from '../group.model';
import { ToasterService } from '../../../../common/services/toaster.service';
import { PermissionsService } from '../../../../common/services/permissions.service';

/**
 * Container for group feed, including filters, search and composer (if user is member)
 */
@Component({
  selector: 'm-group__feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'feed.component.html',
  styleUrls: ['feed.component.ng.scss'],
  providers: [GroupFeedService, FeedsService, ComposerService],
})
export class GroupFeedComponent implements OnDestroy, OnInit {
  private subscriptions: Subscription[] = [];

  @ViewChildren('feedViewChildren', { read: ElementRef })
  feedViewChildren: QueryList<ElementRef>;

  @ViewChild('composer') private composer: ComposerComponent;

  feed: Object[] = [];

  group: MindsGroup;

  showNoQueryResultsNotice: boolean = false;

  protected readonly inProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  constructor(
    public feedService: GroupFeedService,
    public service: GroupService,
    protected router: Router,
    protected route: ActivatedRoute,
    public feedsUpdate: FeedsUpdateService,
    protected cd: ChangeDetectorRef,
    private composerModal: ComposerModalService,
    private injector: Injector,
    private clientMeta: ClientMetaDirective,
    private toast: ToasterService,
    protected permissions: PermissionsService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.service.group$.subscribe(group => {
        this.group = group;
      }),
      this.feedService.service.feed.subscribe(feed => {
        this.feed = feed;
      }),
      this.feedsUpdate.postEmitter.subscribe(newPost => {
        this.prepend(newPost);
      }),
      this.route.queryParams.subscribe(params => {
        // listen for type filter
        if (params['filter']) {
          this.feedService.type$.next(params['filter']);
        } else {
          this.feedService.type$.next('activities');
        }
      }),
      combineLatest([
        this.feedService.service.feed,
        this.feedService.service.inProgress,
        this.service.query$,
      ]).subscribe(([feed, inProgress, query]) => {
        this.showNoQueryResultsNotice =
          !inProgress && feed && feed?.length < 1 && !!query;
      })
    );
  }

  prepend(activity: any) {
    // if new activity does not belong to this group, do not prepend.
    if (
      !activity?.container_guid ||
      activity.container_guid !== this.group.guid
    ) {
      return;
    }

    if (
      this.group.moderated &&
      !(this.group['is:moderator'] || this.group['is:owner'])
    ) {
      this.toast.success(
        'Your post is pending approval from the group moderators'
      );
    }

    let feedItem = {
      entity: activity,
      urn: activity.urn,
      guid: activity.guid,
    };

    this.feedService.service.rawFeed.next([
      ...[feedItem],
      ...this.feedService.service.rawFeed.getValue(),
    ]);

    this.detectChanges();
  }

  /**
   * Toggle view scheduled
   */
  toggleScheduled(): void {
    this.feedService.toggleScheduled();
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
  onTypeChange(type: GroupFeedTypeFilter) {
    this.feedService.onTypeChange(type);
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

  /**
   * Whether a boost should be shown in a given feed position.
   * @param { number } position - index / position in feed.
   * @returns { boolean } - true if a boost should be shown in given feed position
   */
  public shouldShowBoostInPosition(position: number): boolean {
    return (
      // Displays in the 2nd slot and then every 6 posts
      (position > 4 && position % 5 === 0) || position === 0
    );
  }

  /**
   * Applies dontPin value to the entities
   * @param entity
   */
  patchEntity(entity) {
    entity.dontPin = !(this.group['is:moderator'] || this.group['is:owner']);
    return entity;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.composer) {
      return this.composer.canDeactivate();
    }
    return true;
  }

  /**
   * Determines whether the post is scheduled.
   * (Removes pinned posts from scheduled post feed)
   * @returns true if post is scheduled.
   */
  activityIsScheduled(entity): boolean {
    return entity.time_created && entity.time_created * 1000 > Date.now();
  }
}
