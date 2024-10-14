import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
  Self,
  ChangeDetectorRef,
  ViewChild,
  HostBinding,
} from '@angular/core';
import { Location } from '@angular/common';
import { Event, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SlowFadeAnimation } from '../../../../animations';
import {
  ActivityService,
  ActivityEntity,
  ACTIVITY_SHORT_STATUS_MAX_LENGTH,
} from '../../activity/activity.service';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { AnalyticsService } from '../../../../services/analytics';
import { TranslationService } from '../../../../services/translation';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { ClientMetaService } from '../../../../common/services/client-meta.service';
import { AttachmentService } from '../../../../services/attachment';
import isFullscreen, { toggleFullscreen } from '../../../../helpers/fullscreen';
import { ComposerService } from '../../../composer/services/composer.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../../common/services/activity.service';
import { ActivityModalService } from './modal.service';
import { RelatedContentService } from '../../../../common/services/related-content.service';

export type MediaModalParams = {
  entity: any;
  activeMultiImageIndex: number;
  isComment: boolean;
};

// Constants of dimensions calculations
export const ACTIVITY_MODAL_MIN_STAGE_HEIGHT = 520;
export const ACTIVITY_MODAL_MIN_STAGE_WIDTH = 660;
export const ACTIVITY_MODAL_CONTENT_WIDTH = 360;
export const ACTIVITY_MODAL_PADDING = 60; // 20px on each side
export const ACTIVITY_MODAL_WIDTH_EXCL_STAGE =
  ACTIVITY_MODAL_CONTENT_WIDTH + ACTIVITY_MODAL_PADDING;

/**
 * Base component for activities displayed in a modal.
 * Only media posts (images and videos) are allowed to be displayed in the modal.
 * The modal is opened when the content of a media post is clicked (excluding mobile users)
 */
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
  entity: any;
  isMultiImage: boolean = false;

  subscriptions: Subscription[] = [];

  // Used for backdrop click detection hack
  isOpen: boolean = false;
  isOpenTimeout: any = null;

  pagerTimeout: any = null;
  navigatedAway: boolean = false;
  tabletOverlayTimeout: any = null;

  /**
   * Dimensions
   */
  isContentReady = false;
  modalHeight: number;

  /**
   * Multi-image posts
   */
  activeMultiImageIndex: number;

  isQuote: boolean = false;

  @ViewChild('scrollableArea')
  scrollableArea;

  @HostBinding('class.m-activityModal--isComment')
  isComment: boolean = false;

  constructor(
    @Self() public activityService: ActivityService,
    public client: Client,
    public session: Session,
    public analyticsService: AnalyticsService,
    public translationService: TranslationService,
    private router: Router,
    private location: Location,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective,
    protected clientMetaService: ClientMetaService,
    public attachment: AttachmentService,
    public service: ActivityModalService,
    private relatedContent: RelatedContentService,
    private cd: ChangeDetectorRef
  ) {}

  /////////////////////////////////////////////////////////////////
  // SETUP
  /////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    // Prevent dismissal of modal when it's just been opened
    this.isOpenTimeout = setTimeout(() => (this.isOpen = true), 20);
    this.modalHeight = window.innerHeight - ACTIVITY_MODAL_PADDING;

    this.subscriptions.push(
      this.activityService.entity$.subscribe((entity: ActivityEntity) => {
        if (!entity) {
          return;
        }

        // Clears content component
        this.isContentReady = false;
        this.cd.detectChanges();

        // Set the new entity
        this.entity = entity;

        // Re-display content component
        this.isContentReady = true;
        this.cd.detectChanges();
      }),

      this.activityService.activeMultiImageIndex$.subscribe((i) => {
        this.activeMultiImageIndex = i;
      }),

      this.activityService.isQuote$.subscribe((is) => {
        this.isQuote = is;
      }),

      this.activityService.isMultiImage$.subscribe((is) => {
        this.isMultiImage = is;
      }),

      this.activityService.canonicalUrl$.subscribe((canonicalUrl) => {
        if (!this.entity) return;
        /**
         * Record pageviews
         */
        let url = `${canonicalUrl}?ismodal=true`;

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
      }),

      this.router.events.subscribe((event: Event) => {
        // When user clicks a link from inside the modal
        if (event instanceof NavigationStart) {
          if (!this.navigatedAway) {
            this.navigatedAway = true;

            // Fix browser history so back button doesn't go to media page
            this.service.returnToSourceUrl();

            // Go to the intended destination. We use `navigateByUrl` rather than `navigate`
            // because the router event CAN pass through a URL with a query string, which
            // `navigate` will escape.
            this.router.navigateByUrl(event.url);

            this.service.dismiss();
          }
        }
      })
    );
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
  }

  /////////////////////////////////////////////////////////////////
  // MODAL DISMISSAL
  /////////////////////////////////////////////////////////////////
  clickedModal($event) {
    $event.stopPropagation();
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
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

  get showContentMessageOnRight(): boolean {
    return (
      this.entity.content_type === 'image' ||
      this.entity.content_type === 'video' ||
      (this.isMultiImage && this.isQuote)
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

  /**
   * when comments height changes we want to move keep scroll position
   */
  onCommentsHeightChange({
    newHeight,
    oldHeight,
  }: {
    newHeight: number;
    oldHeight: number;
  }) {
    if (this.scrollableArea?.nativeElement) {
      this.scrollableArea.nativeElement.scrollTop += newHeight - oldHeight;
    }
  }

  setModalData(params: MediaModalParams) {
    this.service.setActivityService(this.activityService);

    this.service.setSourceUrl(this.router.url);

    this.service.setEntity(params.entity);

    this.activityService.activeMultiImageIndex$.next(
      params.activeMultiImageIndex
    );

    this.activityService.setDisplayOptions({
      showOnlyCommentsInput: false,
      showInteractions: true,
      canShowLargeCta: true,
      isModal: true,
      autoplayVideo: true,
      permalinkBelowContent: true,
    });

    // Prepare pager
    this.relatedContent.setBaseEntity(params.entity);
    this.relatedContent.setParent('activityModal');

    // Determine if modal is displaying media from a comment,
    // so we can show appropriate toolbar buttons
    this.isComment = params.isComment;
  }
}
