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
} from '@angular/core';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../common/services/activity.service';

import {
  ActivityService,
  ACTIVITY_FIXED_HEIGHT_RATIO,
  ActivityEntity,
} from './../activity/activity.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { ComposerService } from '../../composer/services/composer.service';
import { ElementVisibilityService } from '../../../common/services/element-visibility.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { FeaturesService } from '../../../services/features.service';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';
import { IntersectionObserverService } from '../../../common/services/interception-observer.service';
import { debounceTime } from 'rxjs/operators';
import { EntityMetricsSocketService } from '../../../common/services/entity-metrics-socket';
import { EntityMetricsSocketsExperimentService } from '../../experiments/sub-services/entity-metrics-sockets-experiment.service';
import { Router } from '@angular/router';

/**
 * Base component for activity posts (excluding activities displayed in a modal).
 *
 * Includes activities displayed in feeds, on single activity pages, in pro pages, channel grid mode, sidebar boosts (excluding blogs), sidebar suggestions
 */
@Component({
  selector: 'm-activityV2',
  templateUrl: 'activity.component.html',
  styleUrls: ['activity.component.ng.scss', 'activity-hover.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ActivityService,
    ActivityServiceCommentsLegacySupport, // Comments service should never have been called this.
    ComposerService,
    ElementVisibilityService, // MH: There is too much analytics logic in this entity component. Refactor at a later date.
    EntityMetricsSocketService,
  ],
  host: {
    '[class.m-activity--minimalMode]':
      'this.service.displayOptions.minimalMode',
  },
})
export class ActivityV2Component implements OnInit, AfterViewInit, OnDestroy {
  entity$: Observable<ActivityEntity> = this.service.entity$;

  @Input('canDelete') set _canDelete(value: boolean) {
    this.service.canDeleteOverride$.next(value);
  }

  @Input() set entity(entity) {
    this.service.setEntity(entity);
    this.isBoost = entity.boosted;

    const currentUser = this.session.getLoggedInUser();
    const iconTime: number =
      currentUser && currentUser.guid === entity.ownerObj.guid
        ? currentUser.icontime
        : entity.ownerObj.icontime;

    this.avatarUrl =
      this.configs.get('cdn_url') + 'icon/' + entity.ownerObj.guid + '/medium/';
    iconTime;
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

  @HostBinding('class.m-activity--fixedHeight')
  isFixedHeight: boolean;

  @HostBinding('class.m-activity--fixedHeightContainer')
  isFixedHeightContainer: boolean;

  @HostBinding('class.m-activity--noOwnerBlock')
  noOwnerBlock: boolean;

  @HostBinding('class.m-activity--noToolbar')
  noToolbar: boolean;

  @HostBinding('class.m-activity--isFeed')
  isFeed: boolean;

  @HostBinding('class.m-activity--isSingle')
  isSingle: boolean;

  @HostBinding('class.m-activity--isInset')
  isInset: boolean;

  @HostBinding('class.m-activity--modal')
  isModal: boolean = false;

  @HostBinding('class.m-activity--commentsExpanded')
  commentsExpanded: boolean = false;

  @HostBinding('style.height')
  heightPx: string;

  heightSubscription: Subscription;
  guestModeSubscription: Subscription;
  private interceptionObserverSubscription: Subscription;
  canonicalUrlSubscription: Subscription;

  canonicalUrl: string;

  @ViewChild(ClientMetaDirective) clientMeta: ClientMetaDirective;

  avatarUrl: string;

  pointerdownMs: number;

  constructor(
    public service: ActivityService,
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private elementVisibilityService: ElementVisibilityService,
    private newsfeedService: NewsfeedService,
    public featuresService: FeaturesService,
    public session: Session,
    private configs: ConfigsService,
    private interceptionObserver: IntersectionObserverService,
    private entityMetricSocketsExperiment: EntityMetricsSocketsExperimentService,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.isFixedHeight = this.service.displayOptions.fixedHeight;
    this.isFixedHeightContainer = this.service.displayOptions.fixedHeightContainer;
    this.noOwnerBlock = !this.service.displayOptions.showOwnerBlock;
    this.noToolbar = !this.service.displayOptions.showToolbar;
    this.isFeed = this.service.displayOptions.isFeed;
    this.isSidebarBoost = this.service.displayOptions.isSidebarBoost;
    this.isModal = this.service.displayOptions.isModal;
    this.isSingle = this.service.displayOptions.isSingle;
    this.isInset = this.service.displayOptions.isInset;

    this.heightSubscription = this.service.height$.subscribe(
      (height: number) => {
        if (!this.service.displayOptions.fixedHeight) return;
        if (this.service.displayOptions.fixedHeightContainer) return;
        this.heightPx = `${height}px`;
        this.cd.markForCheck();
        this.cd.detectChanges();
      }
    );

    this.guestModeSubscription = this.service.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isGuestMode = !isLoggedIn;
        this.cd.markForCheck();
        this.cd.detectChanges();
      }
    );

    this.canonicalUrlSubscription = this.service.canonicalUrl$.subscribe(
      canonicalUrl => {
        this.canonicalUrl = canonicalUrl;
      }
    );
  }

  ngOnDestroy() {
    this.heightSubscription.unsubscribe();
    this.guestModeSubscription.unsubscribe();
    if (
      this.entityMetricSocketsExperiment.isActive() &&
      this.interceptionObserverSubscription
    ) {
      this.interceptionObserverSubscription.unsubscribe();
    }
    this.canonicalUrlSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => this.calculateFixedHeight());

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
      this.elementVisibilityService.checkVisibility();

      // Only needed when metrics toolbar is visible.
      if (this.service.displayOptions.showToolbar) {
        this.setupInterceptionObserver();
      }
    }
  }

  /**
   * Setup an interception observer to report when activity enters the DOM and
   * update local isIntersecting$ state accordingly.
   * @returns { void }
   */
  public setupInterceptionObserver(): void {
    if (this.interceptionObserverSubscription) {
      console.error('Already registered InterceptionObserver');
      return;
    }

    if (
      !this.entityMetricSocketsExperiment.isActive() ||
      isPlatformServer(this.platformId)
    ) {
      return;
    }

    this.interceptionObserverSubscription = this.interceptionObserver
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

  @HostListener('window:resize')
  onResize(): void {
    this.calculateFixedHeight();
  }

  /**
   *
   * For fixed height activities, height is
   * determined by clientWidth / ratio
   */
  calculateFixedHeight(): void {
    if (!this.service.displayOptions.fixedHeight) return;
    if (this.service.displayOptions.fixedHeightContainer) return;
    const height =
      this.el.nativeElement.clientWidth / ACTIVITY_FIXED_HEIGHT_RATIO;
    this.service.height$.next(height);
  }

  delete() {
    this.deleted.next(this.service.entity$.value);
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
   * Keep track of whether comments are expanded (in feeds only)
   */
  onCommentsExpandChange(expanded): void {
    this.commentsExpanded = expanded;
  }

  // Capture pointerdown time so we can determine if longpress
  onActivityPointerdown($event) {
    this.pointerdownMs = Date.now();
  }

  /**
   * Navigate to single activity page,
   * but only if you haven't clicked another link inside the post
   * or a dropdown menu item
   * (not used for single activity page or activity modal)
   *
   * Ignore if you clicked in comments sections
   * while comments are expanded
   * @param $event
   *
   * TODO: remove duplication with quote component
   */
  onActivityPointerup($event, clickedComments?: boolean): void {
    const target = $event.target;

    // Only check for longpress if a pointerdown event occured
    let longPress = false;
    if (this.pointerdownMs && Date.now() - this.pointerdownMs > 1000) {
      longPress = true;
    }
    const ignoredContext = this.isSingle || this.isModal || this.isInset;
    const clickedExpandedComments = !!(
      clickedComments && this.commentsExpanded
    );

    if (longPress || ignoredContext || clickedExpandedComments) {
      return;
    }

    const clickedAnchor = !!target.closest('a');
    const clickedDropdownTrigger = this.descendsFromClass(
      target,
      'm-dropdownMenu__trigger'
    );
    const clickedDropdownItem = this.descendsFromClass(
      target,
      'm-dropdownMenu__item'
    );

    if (clickedAnchor || clickedDropdownTrigger) {
      // If link or menu trigger, don't redirect
      $event.stopPropagation();
      return;
    } else if (clickedDropdownItem) {
      // if clicked on dropdown item, ignore
      return;
    }

    // If middle click, open in new tab instead
    if ($event.button == 1) {
      window.open(this.canonicalUrl, '_blank');
    } else {
      // Everything else go to single page
      this.router.navigateByUrl(this.canonicalUrl);
    }
  }

  descendsFromClass(node, className) {
    // Cycle through parents until we find a match
    while ((node = node.parentElement) && !node.classList.contains(className));
    return !!node;
  }
}
