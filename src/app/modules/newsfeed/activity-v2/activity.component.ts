import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Input,
  HostBinding,
  ElementRef,
  HostListener,
  Optional,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
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
import {
  Subscription,
  Observable,
  BehaviorSubject,
  combineLatest,
  Subject,
} from 'rxjs';
import { ComposerService } from '../../composer/services/composer.service';
import { ElementVisibilityService } from '../../../common/services/element-visibility.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { FeaturesService } from '../../../services/features.service';
import { TranslationService } from '../../../services/translation';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { Session } from '../../../services/session';
import { MindsUser } from '../../../interfaces/entities';
import { ConfigsService } from '../../../common/services/configs.service';
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

  @HostBinding('class.m-activity--isFeed')
  isFeed: boolean;

  @HostBinding('class.m-activity--isSingle')
  isSingle: boolean;

  @HostBinding('class.m-activity--modal')
  isModal: boolean = false;

  @HostBinding('class.m-activity--commentsExpanded')
  commentsExpanded: boolean = false;

  @HostBinding('style.height')
  heightPx: string;

  heightSubscription: Subscription;
  guestModeSubscription: Subscription;
  canonicalUrlSubscription: Subscription;

  canonicalUrl: string;

  @ViewChild(ClientMetaDirective) clientMeta: ClientMetaDirective;

  avatarUrl: string;

  constructor(
    public service: ActivityService,
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private elementVisibilityService: ElementVisibilityService,
    private newsfeedService: NewsfeedService,
    public featuresService: FeaturesService,
    public session: Session,
    private configs: ConfigsService,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.isFixedHeight = this.service.displayOptions.fixedHeight;
    this.isFixedHeightContainer = this.service.displayOptions.fixedHeightContainer;
    this.noOwnerBlock = !this.service.displayOptions.showOwnerBlock;
    this.isFeed = this.service.displayOptions.isFeed;
    this.isSidebarBoost = this.service.displayOptions.isSidebarBoost;
    this.isModal = this.service.displayOptions.isModal;
    this.isSingle = this.service.displayOptions.isSingle;

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
    }
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

  /**
   * Navigate to single activity page,
   * but only if you haven't clicked another link inside the post
   * (not used for single activity page or activity modal)
   *
   * Ignore if you clicked in comments sections
   * while comments are expanded
   * @param $event
   */
  onClickActivity($event, clickedComments?: boolean) {
    if (this.isSingle || this.isModal) {
      return;
    }

    if (clickedComments && this.commentsExpanded) {
      return;
    }

    // If link, only go to that link
    if ($event.target instanceof HTMLAnchorElement) {
      $event.stopPropagation();
    } else {
      // if no link, go to single page
      this.router.navigateByUrl(this.canonicalUrl);
    }
  }
}
