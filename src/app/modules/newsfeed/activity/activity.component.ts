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

import {
  ActivityService,
  ACTIVITY_FIXED_HEIGHT_RATIO,
  ActivityEntity,
} from '../activity/activity.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { ComposerService } from '../../composer/services/composer.service';
import { ElementVisibilityService } from '../../../common/services/element-visibility.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';
import { IntersectionObserverService } from '../../../common/services/interception-observer.service';
import { debounceTime } from 'rxjs/operators';
import { EntityMetricsSocketService } from '../../../common/services/entity-metrics-socket';
import { EntityMetricsSocketsExperimentService } from '../../experiments/sub-services/entity-metrics-sockets-experiment.service';
import { PersistentFeedExperimentService } from '../../experiments/sub-services/persistent-feed-experiment.service';
import { MutualSubscriptionsService } from '../../channels/v2/mutual-subscriptions/mutual-subscriptions.service';
import { PaywallContextExperimentService } from '../../experiments/sub-services/paywall-context-experiment.service';

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
    this.service.canDeleteOverride$.next(value);
  }

  @Input() set entity(entity) {
    this.service.setEntity(entity);
    this.isBoost = entity?.boosted ?? false;

    const currentUser = this.session.getLoggedInUser();
    const iconTime: number =
      currentUser && currentUser.guid === entity.ownerObj.guid
        ? currentUser.icontime
        : entity.ownerObj.icontime;

    this.avatarUrl =
      this.configs.get('cdn_url') +
      'icon/' +
      entity.ownerObj.guid +
      '/medium/' +
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

  @HostBinding('style.height')
  heightPx: string;

  @HostBinding('class.m-activity--modal')
  isModal: boolean = false;

  heightSubscription: Subscription;
  guestModeSubscription: Subscription;
  entitySubscription: Subscription;
  private interceptionObserverSubscription: Subscription;

  @ViewChild(ClientMetaDirective) clientMeta: ClientMetaDirective;

  avatarUrl: string;

  // Whether the boost/remind/supermind/mutualSubscriptions flag
  // should appear on top of owner block
  showFlagRow: boolean = false;

  @Output() previousBoost: EventEmitter<any> = new EventEmitter();
  @Output() nextBoost: EventEmitter<any> = new EventEmitter();

  /**
   * If false, the template will be empty (used for deleted)
   */
  canShow = true;

  constructor(
    public service: ActivityService,
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private elementVisibilityService: ElementVisibilityService,
    private newsfeedService: NewsfeedService,
    public session: Session,
    private configs: ConfigsService,
    private interceptionObserver: IntersectionObserverService,
    private entityMetricSocketsExperiment: EntityMetricsSocketsExperimentService,
    private persistentFeedExperiment: PersistentFeedExperimentService,
    private paywallContextExperiment: PaywallContextExperimentService,
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

    // if this is a supermind request with a reply AND on the feed, then
    // we don't want to show the View comments link
    // and we DO want to show the See supermindReply

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

    this.entitySubscription = this.service.entity$.subscribe(entity => {
      if (!entity) {
        return;
      }

      const notInBoostRotator = !this.service.displayOptions.boostRotatorMode;
      const boosted = entity.boosted;
      const reminded = entity.remind_users && entity.remind_users.length;

      const isSupermindOffer =
        entity.supermind &&
        !entity.supermind.is_reply &&
        entity.supermind.receiver_user;

      // const isSomeoneElsesPaywalledPost =
      //   this.paywallContextExperiment.isActive() &&
      //   !!entity?.paywall &&
      //   entity.ownerObj.guid !== this.session.getLoggedInUser().guid;

      this.showFlagRow =
        notInBoostRotator && (boosted || reminded || isSupermindOffer);

      this.cd.markForCheck();
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.heightSubscription.unsubscribe();
    this.guestModeSubscription.unsubscribe();
    this.entitySubscription.unsubscribe();
    if (
      this.entityMetricSocketsExperiment.isActive() &&
      this.interceptionObserverSubscription
    ) {
      this.interceptionObserverSubscription.unsubscribe();
    }
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
    this.canShow = false;

    // Tell the boost rotator to go to the next boost
    this.nextBoost.emit();
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

  persistentFeedExperimentActive = this.persistentFeedExperiment.isActive();
}
