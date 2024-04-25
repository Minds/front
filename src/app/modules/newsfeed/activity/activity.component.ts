import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Component,
  Input,
  HostBinding,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  ViewChild,
  Inject,
  PLATFORM_ID,
  EventEmitter,
} from '@angular/core';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../common/services/activity.service';

import { ActivityService, ActivityEntity } from '../activity/activity.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { ComposerService } from '../../composer/services/composer.service';
import { ElementVisibilityService } from '../../../common/services/element-visibility.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';
import { IntersectionObserverService } from '../../../common/services/intersection-observer.service';
import { debounceTime } from 'rxjs/operators';
import { EntityMetricsSocketService } from '../../../common/services/entity-metrics-socket';
import { PersistentFeedExperimentService } from '../../experiments/sub-services/persistent-feed-experiment.service';
import { MutualSubscriptionsService } from '../../channels/v2/mutual-subscriptions/mutual-subscriptions.service';
import { ComposerModalService } from '../../composer/components/modal/modal.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';

const TOPBAR_HEIGHT: number = 75;

/**
 * Base component for activity posts (excluding activities displayed in a modal).
 *
 * Includes activities displayed in feeds, on single activity pages, in pro pages, channel grid mode, sidebar boosts (excluding blogs), sidebar suggestions
 */
@Component({
  selector: 'm-activity',
  templateUrl: 'activity.component.html',
  styleUrls: ['activity.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ActivityService,
    ActivityServiceCommentsLegacySupport, // Comments service should never have been called this.
    ComposerModalService,
    ComposerService,
    ElementVisibilityService, // MH: There is too much analytics logic in this entity component. Refactor at a later date.
    EntityMetricsSocketService,
    MutualSubscriptionsService, // Create new instance of MutualSubscriptionsService per activity to avoid cancelled replays
  ],
  host: {
    '[class.m-activity--minimalMode]':
      'this.service.displayOptions.minimalMode',
  },
})
export class ActivityComponent implements OnInit, AfterViewInit, OnDestroy {
  entity$: Observable<ActivityEntity> = this.service.entity$;

  @Input() set canDelete(value: boolean) {
    if (value == null) {
      return;
    }
    this.service.canDeleteOverride$.next(value);
  }

  @Input() set entity(entity) {
    this.service.setEntity(entity);
    this.isBoost = entity?.boosted ?? false;
  }

  @Input() set displayOptions(options) {
    this.service.setDisplayOptions(options);
  }

  @Input() slot: number = -1;

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() set autoplayVideo(autoplay: boolean) {
    this.service.displayOptions.autoplayVideo = autoplay;
  }

  @Input() canRecordAnalytics: boolean = true;

  @Output() deleted: Subject<boolean> = this.service.onDelete$;

  isBoost = false;

  @HostBinding('class.m-activity--guestMode')
  isGuestMode: boolean;

  @HostBinding('class.m-activity--isSidebarBoost')
  isSidebarBoost: boolean;

  @HostBinding('class.m-activity--noOwnerBlock')
  noOwnerBlock: boolean;

  @HostBinding('class.m-activity--noToolbar')
  noToolbar: boolean;

  @HostBinding('class.m-activity--isFeed')
  isFeed: boolean;

  @HostBinding('class.m-activity--isSingle')
  isSingle: boolean;

  @HostBinding('style.height')
  heightPx: string;

  @HostBinding('class.m-activity--modal')
  isModal: boolean = false;

  @HostBinding('class.m-activity--hideTopBorder')
  hideTopBorder: boolean = false;

  guestModeSubscription: Subscription;
  private intersectionObserverSubscription: Subscription;

  /**
   * Activity wrapper DOM element
   */
  @ViewChild('activityWrapper')
  activityWrapper: ElementRef<HTMLElement>;

  @ViewChild(ClientMetaDirective) clientMeta: ClientMetaDirective;

  @Output() previousBoost: EventEmitter<any> = new EventEmitter();
  @Output() nextBoost: EventEmitter<any> = new EventEmitter();

  /**
   * Replace the activity with notice
   * when an activity has been explicitly downvoted,
   * and switch back if the 'undo' button on the
   * notice is clicked
   */
  showDownvoteNotice: boolean = false;

  persistentFeedExperimentActive: boolean = false;

  constructor(
    public service: ActivityService,
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private elementVisibilityService: ElementVisibilityService,
    private newsfeedService: NewsfeedService,
    public session: Session,
    private configs: ConfigsService,
    private intersectionObserver: IntersectionObserverService,
    private persistentFeedExperiment: PersistentFeedExperimentService,
    private isTenant: IsTenantService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.persistentFeedExperimentActive =
      this.persistentFeedExperiment.isActive();

    this.noOwnerBlock = !this.service.displayOptions.showOwnerBlock;
    this.noToolbar = !this.service.displayOptions.showToolbar;
    this.isFeed = this.service.displayOptions.isFeed;
    this.isSidebarBoost = this.service.displayOptions.isSidebarBoost;
    this.isModal = this.service.displayOptions.isModal;
    this.isSingle = this.service.displayOptions.isSingle;
    this.hideTopBorder = this.service.displayOptions.hideTopBorder;

    // if this is a supermind request with a reply AND on the feed, then
    // we don't want to show the View comments link
    // and we DO want to show the See supermindReply

    this.guestModeSubscription = this.service.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isGuestMode = !isLoggedIn;
        this.cd.markForCheck();
        this.cd.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.guestModeSubscription.unsubscribe();
    if (this.intersectionObserverSubscription) {
      this.intersectionObserverSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    if (this.canRecordAnalytics) {
      this.elementVisibilityService
        .setEntity(this.service.entity$.value)
        .setElementRef(this.el)
        .onView((entity: ActivityEntity) => {
          if (!entity) return;

          this.newsfeedService.recordView(
            entity,
            true,
            null,
            this.clientMeta.build({
              campaign: entity.boosted_guid ? entity.urn : '',
              position: this.slot,
            })
          );
        });

      // Only needed when metrics toolbar is visible.
      if (this.service.displayOptions.showToolbar) {
        this.setupIntersectionObserver();
      }
    }
  }

  /**
   * Setup an interception observer to report when activity enters the DOM and
   * update local isIntersecting$ state accordingly.
   * @returns { void }
   */
  public setupIntersectionObserver(): void {
    if (this.intersectionObserverSubscription) {
      console.error('Already registered IntersectionObserver');
      return;
    }

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.intersectionObserverSubscription = this.intersectionObserver
      .createAndObserve(this.el)
      .pipe(debounceTime(2000))
      .subscribe((isVisible: boolean) => {
        if (isVisible) {
          this.service.setupMetricsSocketListener();
          return;
        }
        this.service.teardownMetricsSocketListener();
      });
  }

  /**
   * Keep scroll position when comments height changes
   */
  onCommentsHeightChange({ newHeight, oldHeight }): void {
    if (!isPlatformBrowser(this.platformId)) return;

    window.scrollTo({
      top: window.pageYOffset + (newHeight - oldHeight),
    });
  }

  /**
   * Called when a downvote event is received.
   * Handles removing item from the feed and
   * showing of downvote notice.
   * (Tenant sites excluded)
   * @returns { void }
   */
  public onDownvote(): void {
    // Don't remove from feed on tenant sites
    if (this.isTenant.is()) {
      return;
    }
    if (!this.isSingle) {
      if (!this.topOfPostIsVisible()) {
        this.scrollToTopOfPost();
      }
      this.toggleDownvoteNotice(true);
    }
  }

  /**
   * Remove the downvote and show the activity
   * instead of the downvote notice
   */
  onUndoExplicitDownvote($event): void {
    this.service.undoDownvote();

    this.toggleDownvoteNotice(false);
  }

  /**
   * @returns whether the top of the post is visible right now
   */
  topOfPostIsVisible(): boolean {
    const top = this.bounds.top - TOPBAR_HEIGHT;

    return top >= 0;
  }

  /**
   * If you explicitly downvoted when the top of the post was out of view,
   * scroll to the top of the post to ensure the downvote notice is visible
   */
  scrollToTopOfPost(): void {
    const offsetPosition = this.bounds.top + window.scrollY - TOPBAR_HEIGHT;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }

  toggleDownvoteNotice(show: boolean): void {
    this.showDownvoteNotice = show;
    this.cd.detectChanges();
  }

  get bounds() {
    return this.activityWrapper.nativeElement.getBoundingClientRect();
  }
}
