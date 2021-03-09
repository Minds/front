import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
  Self,
} from '@angular/core';
import { Location } from '@angular/common';
import { Event, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { SlowFadeAnimation } from '../../../../animations';
import {
  ActivityService,
  ActivityEntity,
  ACTIVITY_SHORT_STATUS_MAX_LENGTH,
} from '../activity.service';
import { FeaturesService } from '../../../../services/features.service';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { AnalyticsService } from '../../../../services/analytics';
import { TranslationService } from '../../../../services/translation';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { SiteService } from '../../../../common/services/site.service';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { ClientMetaService } from '../../../../common/services/client-meta.service';
import { AttachmentService } from '../../../../services/attachment';
import isFullscreen, { toggleFullscreen } from '../../../../helpers/fullscreen';
import { ComposerService } from '../../../composer/services/composer.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../../common/services/activity.service';
import { ActivityModalService } from './modal.service';
import { RelatedContentService } from '../../../../common/services/related-content.service';
import { MediaModalParams } from '../../../media/modal/modal.component';

// Constants of dimensions calculations
export const ACTIVITY_MODAL_MIN_STAGE_HEIGHT = 520;
export const ACTIVITY_MODAL_MIN_STAGE_WIDTH = 660;
export const ACTIVITY_MODAL_CONTENT_WIDTH = 360;
export const ACTIVITY_MODAL_PADDING = 40; // 20px on each side
export const ACTIVITY_MODAL_WIDTH_EXCL_STAGE =
  ACTIVITY_MODAL_CONTENT_WIDTH + ACTIVITY_MODAL_PADDING;

@Component({
  selector: 'm-activity__modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.ng.scss'],
  animations: [
    SlowFadeAnimation, // Fade media in after load
  ],
  providers: [
    ActivityService,
    ActivityModalService,
    ComposerService,
    ActivityServiceCommentsLegacySupport,
  ],
})
export class ActivityModalComponent implements OnInit, OnDestroy {
  @Input('entity') set data(params: MediaModalParams) {
    this.service.setActivityService(this.activityService);

    this.service.setSourceUrl(this.router.url);

    this.service.setEntity(params.entity);

    this.activityService.setDisplayOptions({
      showOnlyCommentsInput: false,
      isModal: true,
      fixedHeight: false,
    });

    // Prepare pager
    this.relatedContent.setBaseEntity(params.entity);
  }

  entity: any;
  entitySubscription: Subscription;
  routerSubscription: Subscription;
  fullscreenSubscription: Subscription;
  canonicalUrlSubscription: Subscription;

  // Used for backdrop click detection hack
  isOpen: boolean = false;
  isOpenTimeout: any = null;

  pagerTimeout: any = null;
  navigatedAway: boolean = false;
  tabletOverlayTimeout: any = null;

  /**
   * Dimensions
   */
  maxHeight: number;

  stageWidth: number;
  stageHeight: number;
  maxStageWidth: number;

  mediaWidth: number = 0;
  mediaHeight: number;

  entityWidth: number = 0;
  entityHeight: number = 0;

  constructor(
    @Self() public activityService: ActivityService,
    public client: Client,
    public session: Session,
    public analyticsService: AnalyticsService,
    public translationService: TranslationService,
    private overlayModal: OverlayModalService,
    private router: Router,
    private location: Location,
    private site: SiteService,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective,
    protected clientMetaService: ClientMetaService,
    public attachment: AttachmentService,
    public service: ActivityModalService,
    private relatedContent: RelatedContentService,
    private features: FeaturesService
  ) {}

  /////////////////////////////////////////////////////////////////
  // SETUP
  /////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    // Prevent dismissal of modal when it's just been opened
    this.isOpenTimeout = setTimeout(() => (this.isOpen = true), 20);

    this.entitySubscription = this.activityService.entity$.subscribe(
      (entity: ActivityEntity) => {
        if (!entity) {
          return;
        }

        this.entity = entity;
        this.calculateDimensions();
      }
    );

    this.canonicalUrlSubscription = this.activityService.canonicalUrl$.subscribe(
      canonicalUrl => {
        if (!this.entity) return;
        /**
         * Record pageviews
         */
        let url = `${canonicalUrl}?ismodal=true`;

        if (this.site.isProDomain) {
          url = `/pro/${this.site.pro.user_guid}${url}`;
        }
        this.clientMetaService.recordView(this.entity, this.parentClientMeta, {
          source: 'single',
          medium: 'modal',
        });

        this.analyticsService.send('pageview', {
          url,
        });
        /**
         * Change the url to point to media page so user can easily share link
         * (but don't actually redirect)
         */
        this.location.replaceState(canonicalUrl);
      }
    );

    // When user clicks a link from inside the modal
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (!this.navigatedAway) {
          this.navigatedAway = true;

          // Fix browser history so back button doesn't go to media page
          this.service.returnToSourceUrl();

          // Go to the intended destination
          this.router.navigate([event.url]);

          this.service.dismiss();
        }
      }
    });

    this.fullscreenSubscription = this.service.isFullscreen$.subscribe(
      isFullscreen => {
        this.calculateDimensions();
      }
    );
  }

  /**
   * Re-calculate height/width when window resizes
   *
   */
  @HostListener('window:resize', ['$resizeEvent'])
  onResize(resizeEvent) {
    this.calculateDimensions();
  }

  /////////////////////////////////////////////////////////////////
  // OVERLAY & PAGER VISIBILITY
  /////////////////////////////////////////////////////////////////

  /**
   * Show overlay and pager
   */
  onMouseEnterStage() {
    this.service.overlayVisible$.next(true);
    this.service.pagerVisible$.next(true);
    if (this.pagerTimeout) {
      clearTimeout(this.pagerTimeout);
    }
  }

  /**
   * Hide overlay and pager
   */
  onMouseLeaveStage() {
    this.service.overlayVisible$.next(false);
    this.service.pagerVisible$.next(false);
    this.pagerTimeout = setTimeout(() => {
      this.service.pagerVisible$.next(false);
    }, 2000);
  }

  /////////////////////////////////////////////////////////////////
  // FULLSCREEN LISTENER
  /////////////////////////////////////////////////////////////////
  /**
   * Listen for fullscreen change event in case
   * user enters/exits full screen without clicking the icon
   */
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  onFullscreenChange(event) {
    this.service.isFullscreen$.next(isFullscreen());
    this.calculateDimensions();
  }

  /////////////////////////////////////////////////////////////////
  // MODAL DISMISSAL
  /////////////////////////////////////////////////////////////////

  // Dismiss modal when backdrop is clicked and modal is open
  @HostListener('document:click', ['$event'])
  clickedBackdrop($event) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    if (this.isOpen) {
      this.service.dismiss();
    }
  }

  // Don't dismiss modal if click somewhere other than backdrop
  clickedModal($event) {
    $event.stopPropagation();
  }

  ngOnDestroy() {
    if (this.entitySubscription) {
      this.entitySubscription.unsubscribe();
    }

    if (this.canonicalUrlSubscription) {
      this.canonicalUrlSubscription.unsubscribe();
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (this.fullscreenSubscription) {
      this.fullscreenSubscription.unsubscribe();
    }

    if (this.tabletOverlayTimeout) {
      clearTimeout(this.tabletOverlayTimeout);
    }

    if (this.isOpenTimeout) {
      clearTimeout(this.isOpenTimeout);
    }

    // If the modal was closed without a redirect, replace media page url
    // with original source url and fix browser history so back button
    // doesn't go to media page
    if (!this.navigatedAway) {
      this.service.returnToSourceUrl();
    }
  }

  /////////////////////////////////////////////////////////////////
  // KEYBOARD SHORTCUTS
  /////////////////////////////////////////////////////////////////

  @HostListener('window:keydown', ['$event']) onWindowKeyDown(
    $event: KeyboardEvent
  ): Boolean {
    if (!this.service.shouldFilterOutKeyDownEvent($event)) {
      if ($event.key === 'Escape' && this.isOpen) {
        this.service.dismiss();
      }
    }
    return true;
  }

  /////////////////////////////////////////////////////////////////
  // TABLET TOUCH CONTROLS
  /////////////////////////////////////////////////////////////////
  /**
   * Briefly display title overlay and video controls on stage touch
   */
  showOverlaysOnTablet() {
    this.onMouseEnterStage();

    if (this.tabletOverlayTimeout) {
      clearTimeout(this.tabletOverlayTimeout);
    }

    this.tabletOverlayTimeout = setTimeout(() => {
      this.onMouseLeaveStage();
    }, 3000);
  }

  /////////////////////////////////////////////////////////////////
  // DIMENSIONS CAlCULATIONS
  /////////////////////////////////////////////////////////////////

  // TODO de-spaghetti ლ(¯ロ¯"ლ)
  calculateDimensions() {
    if (!this.entity) {
      return;
    }

    /**
     * Get intrinsic dimensions
     */
    switch (this.entity.content_type) {
      case 'image':
        this.entityWidth = this.entity.custom_data[0].width;
        this.entityHeight =
          this.entity.custom_data[0].height !== '0'
            ? this.entity.custom_data[0].height
            : ACTIVITY_MODAL_MIN_STAGE_HEIGHT;
        break;
      case 'quote':
        this.entityWidth = 500;
        this.entityHeight = 600;
        break;
      case 'blog':
        this.entityWidth = window.innerWidth * 0.4;
        this.entityHeight = window.innerHeight * 0.6;
        break;
      case 'video':
      case 'rich-embed':
      case 'status':
        let providedCustomWidth,
          providedCustomHeight,
          providedWidth,
          providedHeight;
        if (this.entity.custom_data) {
          if (this.entity.custom_data.dimensions) {
            providedCustomWidth = this.entity.custom_data.dimensions.width;
            providedCustomHeight = this.entity.custom_data.dimensions.height;
          }
          if (this.entity.custom_data.width) {
            providedCustomWidth = this.entity.custom_data.width;
          }
          if (this.entity.custom_data.height) {
            providedCustomHeight = this.entity.custom_data.height;
          }
        }
        if (this.entity.width) providedWidth = this.entity.width;
        if (this.entity.height) providedHeight = this.entity.height;

        this.entityWidth = providedCustomWidth || providedWidth || 1280;
        this.entityHeight = providedCustomHeight || providedHeight || 720;
    }

    /**
     * NOT FULLSCREEN
     */
    if (!this.service.isFullscreen$.getValue()) {
      /**
       * NON-FULLSCREEN BLOG
       */
      if (this.entity.content_type === 'blog') {
        this.mediaHeight = Math.max(
          ACTIVITY_MODAL_MIN_STAGE_HEIGHT,
          this.aBitLessThan(window.innerHeight) - ACTIVITY_MODAL_PADDING
        );
        this.mediaWidth = Math.max(
          ACTIVITY_MODAL_MIN_STAGE_WIDTH,
          this.aBitLessThan(window.innerWidth) - ACTIVITY_MODAL_WIDTH_EXCL_STAGE
        );
        this.stageHeight = this.mediaHeight;
        this.stageWidth = this.mediaWidth;

        this.service.loading$.next(false);
        return;
      }

      this.setHeightsAsTallAsPossible();

      // After heights are set, check that scaled width isn't too wide or narrow
      this.maxStageWidth = Math.max(
        window.innerWidth -
          ACTIVITY_MODAL_CONTENT_WIDTH -
          ACTIVITY_MODAL_PADDING,
        ACTIVITY_MODAL_MIN_STAGE_WIDTH
      );

      if (this.mediaWidth >= this.maxStageWidth) {
        // Too wide :(
        this.rescaleHeightsForMaxWidth();
      } else if (
        this.mediaWidth >
        ACTIVITY_MODAL_MIN_STAGE_WIDTH - ACTIVITY_MODAL_PADDING
      ) {
        // Not too wide or too narrow :)
        this.stageWidth = this.mediaWidth;
      } else {
        // Too narrow :(
        // If black stage background is visible on left/right, each strip should be at least 20px wide
        this.stageWidth = ACTIVITY_MODAL_MIN_STAGE_WIDTH;
        // Continue to resize height after reaching min width
        this.handleNarrowWindow();
      }

      // If black stage background is visible on top/bottom, each strip should be at least 20px high
      const heightDiff = this.stageHeight - this.mediaHeight;
      if (0 < heightDiff && heightDiff <= ACTIVITY_MODAL_PADDING) {
        this.stageHeight += ACTIVITY_MODAL_PADDING;
      }
    } else {
      /**
       * IS FULLSCREEN
       */
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      this.stageWidth = windowWidth;
      this.stageHeight = windowHeight;

      switch (this.entity.content_type) {
        case 'image':
          // For images, set mediaHeight as tall as possible but not taller than instrinsic height
          this.mediaHeight =
            this.entityHeight < windowHeight ? this.entityHeight : windowHeight;
          break;
        case 'video':
          // It's ok if videos are taller than intrinsic height
          this.mediaHeight = windowHeight;
        case 'blog':
        case 'rich-embed':
        case 'default':
          this.mediaHeight = windowHeight;
          this.mediaWidth = windowWidth;
      }

      if (this.entity.content_type === 'blog') {
        this.mediaWidth = windowWidth;
      } else if (this.mediaWidth >= 1) {
        this.scaleWidth;
      }

      if (this.mediaWidth > windowWidth) {
        // Width was too wide, need to rescale heights so width fits
        this.mediaWidth = windowWidth;
        this.mediaHeight = this.scaleHeight();
      }
    }

    if (this.entity.content_type === 'video') {
      this.entityHeight = this.mediaHeight;
      this.entityWidth = this.mediaWidth;
    }

    this.service.loading$.next(false);
  }

  setHeightsAsTallAsPossible() {
    this.maxHeight = window.innerHeight - ACTIVITY_MODAL_PADDING;

    // Initialize stageHeight to be as tall as possible and not smaller than minimum
    this.stageHeight = Math.max(
      this.maxHeight,
      ACTIVITY_MODAL_MIN_STAGE_HEIGHT
    );

    // Set mediaHeight as tall as stage but no larger than intrinsic height
    if (
      this.entity.content_type !== 'video' &&
      this.entityHeight < this.stageHeight
    ) {
      // Image is shorter than stage; scale down stage
      this.mediaHeight = this.entityHeight;
      this.stageHeight = Math.max(
        this.mediaHeight,
        ACTIVITY_MODAL_MIN_STAGE_HEIGHT
      );
    } else {
      // Either: Image is taller than stage; scale it down so it fits inside stage
      // Or:     Video should be as tall as possible but not taller than stage
      this.mediaHeight = this.stageHeight;
    }

    // Scale width according to aspect ratio
    this.mediaWidth = this.scaleWidth();
  }

  /**
   * Media is intrinsically too wide, set width to max and rescale heights
   */
  rescaleHeightsForMaxWidth() {
    this.mediaWidth = this.maxStageWidth;
    this.stageWidth = this.maxStageWidth;

    this.mediaHeight = this.scaleHeight();
    this.stageHeight = Math.max(
      this.mediaHeight,
      ACTIVITY_MODAL_MIN_STAGE_HEIGHT
    );
  }

  /**
   * When at minStageWidth and windowWidth falls below threshold,
   * shrink vertically until it hits minStageHeight
   */
  handleNarrowWindow() {
    // When window is narrower than this, start to shrink height
    const verticalShrinkWidthThreshold =
      this.mediaWidth + ACTIVITY_MODAL_WIDTH_EXCL_STAGE;

    const widthDiff = verticalShrinkWidthThreshold - window.innerWidth;
    // Is window narrow enough to start shrinking vertically?
    if (widthDiff >= 1) {
      // What mediaHeight would be if it shrunk proportionally to difference in width
      const mediaHeightPreview = Math.round(
        (this.mediaWidth - widthDiff) / this.aspectRatio
      );

      // Shrink media if mediaHeight is still above min
      if (mediaHeightPreview > ACTIVITY_MODAL_MIN_STAGE_HEIGHT) {
        this.mediaWidth -= widthDiff;
        this.mediaHeight = this.scaleHeight();
        this.stageHeight = this.mediaHeight;
      } else {
        this.stageHeight = ACTIVITY_MODAL_MIN_STAGE_HEIGHT;
        this.mediaHeight = Math.min(
          ACTIVITY_MODAL_MIN_STAGE_HEIGHT,
          this.entityHeight
        );
        this.mediaWidth = this.scaleWidth();
      }
    }
  }

  scaleHeight() {
    return Math.round(this.mediaWidth / this.aspectRatio);
  }

  scaleWidth() {
    return Math.round(this.mediaHeight * this.aspectRatio);
  }

  aBitLessThan(number: number) {
    return number * 0.9;
  }
  ////////////////////////////////////////
  get aspectRatio(): number {
    return this.entityWidth / this.entityHeight;
  }

  get modalWidth(): number {
    return this.stageWidth + ACTIVITY_MODAL_CONTENT_WIDTH;
  }

  get showContentMessageOnRight(): boolean {
    return (
      (this.entity.content_type === 'image' ||
        this.entity.content_type === 'video' ||
        this.entity.content_type === 'quote') &&
      (this.entity.title || this.entity.message)
    );
  }

  get shortStatus(): boolean {
    return (
      this.entity &&
      this.entity.content_type === 'status' &&
      this.entity.message &&
      this.entity.message.length <= ACTIVITY_SHORT_STATUS_MAX_LENGTH
    );
  }

  get mediaWrapperWidth(): string {
    if (
      this.entity.content_type === status ||
      !this.mediaWidth ||
      this.mediaWidth <= 0
    ) {
      return '100%';
    } else {
      return `${this.mediaWidth}px`;
    }
  }

  get mediaWrapperHeight(): string {
    if (this.entity.content_type === 'status') {
      return '100%';
    }

    if (
      this.entity.activity_type === 'rich-embed' &&
      this.entity.content_type === 'rich-embed'
    ) {
      return `${this.stageHeight}px`;
    }

    return this.mediaHeight === 0
      ? ACTIVITY_MODAL_MIN_STAGE_HEIGHT + 'px'
      : this.mediaHeight + 'px';
  }

  get isQuote(): boolean {
    return this.entity.activity_type === 'quote';
  }
}
