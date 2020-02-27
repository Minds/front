import {
  Component,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { Event, NavigationStart, Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { AnalyticsService } from '../../../services/analytics';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';
import { ActivityService } from '../../../common/services/activity.service';
import { SiteService } from '../../../common/services/site.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FeaturesService } from '../../../services/features.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { HorizontalFeedService } from '../../../common/services/horizontal-feed.service';
import { ShareModalComponent } from '../../modals/share/share';
import { AttachmentService } from '../../../services/attachment';

export type MediaModalParams = {
  entity: any;
};

@Component({
  selector: 'm-media--modal',
  templateUrl: 'modal.component.html',
  animations: [
    // Fade media in after load
    trigger('slowFade', [
      state(
        'in',
        style({
          opacity: 1,
        })
      ),
      state(
        'out',
        style({
          opacity: 0,
        })
      ),
      transition('out => in', [animate('600ms')]),
      transition('in => out', [animate('0ms')]),
    ]),
    // Fade overlay in/out
    trigger('fastFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
  providers: [ActivityService, ClientMetaService],
})
export class MediaModalComponent implements OnInit, OnDestroy {
  readonly cdnUrl: string;

  entity: any = {};
  originalEntity: any = null;
  isLoading: boolean = true;
  navigatedAway: boolean = false;
  fullscreenHovering: boolean = false; // Used for fullscreen button transformation

  isTablet: boolean = false;
  isFullscreen: boolean = false;
  contentType: string = '';

  aspectRatio: number;
  modalWidth: number;
  stageWidth: number;
  stageHeight: number;
  mediaWidth: number;
  mediaHeight: number;
  entityWidth: number = 0;
  entityHeight: number = 0;

  maxStageWidth: number;
  maxHeight: number;
  minStageHeight: number = 520;
  minStageWidth: number = 660;

  contentWidth: number = 360;
  padding: number = 20; // 20px on each side

  title: string = '';
  thumbnail: string = '';
  boosted: boolean = false;
  ownerIconTime: string = '';
  pageUrl: string = '';

  // Used for backdrop click detection hack
  isOpen: boolean = false;
  isOpenTimeout: any = null;

  overlayVisible: boolean = false;
  tabletOverlayTimeout: any = null;

  pagerVisible: boolean = false;
  pagerTimeout: any = null;

  routerSubscription: Subscription;

  modalPager = {
    hasPrev: false,
    hasNext: false,
  };

  protected modalPager$: Subscription;

  protected asyncEntity$: Subscription;

  @Input('entity') set data(params: MediaModalParams) {
    this.clearAsyncEntity();
    this.setEntity(params.entity);

    if (this.features.has('modal-pager')) {
      this.horizontalFeed.setBaseEntity(params.entity);
    }
  }

  videoDirectSrc = [];

  videoTorrentSrc = [];

  constructor(
    public session: Session,
    public analyticsService: AnalyticsService,
    private overlayModal: OverlayModalService,
    private router: Router,
    private location: Location,
    private site: SiteService,
    private clientMetaService: ClientMetaService,
    private featureService: FeaturesService,
    @SkipSelf() injector: Injector,
    configs: ConfigsService,
    private horizontalFeed: HorizontalFeedService,
    private features: FeaturesService,
    public attachment: AttachmentService
  ) {
    this.clientMetaService
      .inherit(injector)
      .setSource('single')
      .setMedium('modal');

    this.cdnUrl = configs.get('cdn_url');
  }

  updateSources() {
    this.videoDirectSrc = [
      {
        res: '720',
        uri:
          'api/v1/media/' + this.entity.entity_guid + '/play?s=modal&res=720',
        type: 'video/mp4',
      },
      {
        res: '360',
        uri: 'api/v1/media/' + this.entity.entity_guid + '/play/?s=modal',
        type: 'video/mp4',
      },
    ];

    this.videoTorrentSrc = [
      { res: '720', key: this.entity.entity_guid + '/720.mp4' },
      { res: '360', key: this.entity.entity_guid + '/360.mp4' },
    ];

    if (this.entity.custom_data.full_hd) {
      this.videoDirectSrc.unshift({
        res: '1080',
        uri:
          'api/v1/media/' +
          this.entity.entity_guid +
          '/play/' +
          Date.now() +
          '?s=modal&res=1080',
        type: 'video/mp4',
      });

      this.videoTorrentSrc.unshift({
        res: '1080',
        key: this.entity.entity_guid + '/1080.mp4',
      });
    }
  }

  ngOnInit() {
    // Prevent dismissal of modal when it's just been opened
    this.isOpenTimeout = setTimeout(() => (this.isOpen = true), 20);

    // -- Initialize Horizontal Feed service context

    if (this.features.has('modal-pager')) {
      this.modalPager$ = this.horizontalFeed
        .onChange()
        .subscribe(async change => {
          this.modalPager = {
            hasNext: await this.horizontalFeed.hasNext(),
            hasPrev: await this.horizontalFeed.hasPrev(),
          };
        });

      this.horizontalFeed.setContext('container');
    }

    // -- Load entity

    this.load();

    // -- EVENTS

    // When user clicks a link from inside the modal
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (!this.navigatedAway) {
          this.navigatedAway = true;

          // Fix browser history so back button doesn't go to media page
          this.location.replaceState(this.entity.modal_source_url);

          // Go to the intended destination
          this.router.navigate([event.url]);

          this.overlayModal.dismiss();
        }
      }
    });
  }

  setEntity(entity: any) {
    if (!entity) {
      return;
    }

    this.originalEntity = entity;
    this.entity = entity && JSON.parse(JSON.stringify(entity)); // deep clone
  }

  clearAsyncEntity() {
    if (this.asyncEntity$) {
      this.asyncEntity$.unsubscribe();
      this.asyncEntity$ = void 0;
    }
  }

  setAsyncEntity(
    asyncEntity: BehaviorSubject<any>,
    extraEntityProperties: Object = {}
  ) {
    this.clearAsyncEntity();

    this.asyncEntity$ = asyncEntity.subscribe(rawEntity => {
      if (rawEntity) {
        const entity = {
          ...rawEntity,
          ...extraEntityProperties,
        };

        this.setEntity(entity);
        this.load();
      }
    });
  }

  load() {
    switch (this.entity.type) {
      case 'activity':
        this.title =
          this.entity.message ||
          this.entity.title ||
          `${this.entity.ownerObj.name}'s post`;
        this.entity.guid = this.entity.entity_guid || this.entity.guid;
        this.thumbnail = this.entity.thumbnails
          ? this.entity.thumbnails.xlarge
          : null;

        switch (this.entity.custom_type) {
          case 'video':
            this.contentType = 'video';
            this.entity.width = this.entity.custom_data.dimensions
              ? this.entity.custom_data.dimensions.width
              : 1280;
            this.entity.height = this.entity.custom_data.dimensions
              ? this.entity.custom_data.dimensions.height
              : 720;
            this.entity.thumbnail_src = this.entity.custom_data.thumbnail_src;
            this.updateSources();
            break;
          case 'batch':
            this.contentType = 'image';
            this.entity.width = this.entity.custom_data[0].width;
            this.entity.height = this.entity.custom_data[0].height;
            break;
          default:
            if (
              this.entity.perma_url &&
              this.entity.title &&
              !this.entity.entity_guid
            ) {
              this.contentType = 'rich-embed';
              this.entity.width = this.entity.custom_data.dimensions
                ? this.entity.custom_data.dimensions.width
                : 1280;
              this.entity.height = this.entity.custom_data.dimensions
                ? this.entity.custom_data.dimensions.height
                : 720;
              this.entity.thumbnail_src = this.entity.custom_data.thumbnail_src;
              break;
            } else {
              // Modal not implemented, redirect.
              this.router.navigate([
                this.entity.route
                  ? `/${this.entity.route}`
                  : `/blog/view/${this.entity.guid}`,
              ]);
              // Close modal.
              this.clickedBackdrop(null);
            }
        }

        break;
      case 'object':
        switch (this.entity.subtype) {
          case 'video':
            this.contentType = 'video';
            this.title = this.entity.title;
            this.entity.entity_guid = this.entity.guid;
            this.entity.custom_data = {
              full_hd: this.entity.flags ? !!this.entity.flags.full_hd : false,
            };
            this.updateSources();
            break;
          case 'image':
            this.contentType = 'image';
            this.thumbnail = this.entity.thumbnail;
            this.title = this.entity.title;
            this.entity.entity_guid = this.entity.guid;
            break;
          case 'blog':
            this.contentType = 'blog';
            this.entity.entity_guid = this.entity.guid;
        }
        break;
      case 'comment':
        this.contentType =
          this.entity.custom_type === 'video' ? 'video' : 'image';
        this.title =
          this.entity.message ||
          this.entity.title ||
          this.entity.description ||
          `${this.entity.ownerObj.name}'s post`;
        this.entity.guid = this.entity.attachment_guid;
        this.entity.entity_guid = this.entity.attachment_guid;
        this.thumbnail = this.entity.thumbnails.xlarge;
        break;
    }

    if (this.contentType === 'rich-embed') {
      this.pageUrl = `/newsfeed/${this.entity.guid}`;
    } else if (this.contentType === 'blog') {
      this.pageUrl = `${
        !this.site.isProDomain ? `/${this.entity.ownerObj.username}` : ''
      }/blog/${this.entity.slug}-${this.entity.guid}`;
    } else {
      this.pageUrl = `/media/${this.entity.entity_guid}`;
    }

    this.boosted = this.entity.boosted || this.entity.p2p_boosted || false;

    // Set ownerIconTime
    const session = this.session.getLoggedInUser();
    if (session && session.guid === this.entity.ownerObj.guid) {
      this.ownerIconTime = session.icontime;
    } else {
      this.ownerIconTime = this.entity.ownerObj.icontime;
    }

    this.isTablet =
      isMobileOrTablet() && Math.min(screen.width, screen.height) >= 768;

    let url = `${this.pageUrl}?ismodal=true`;

    if (this.site.isProDomain) {
      url = `/pro/${this.site.pro.user_guid}${url}`;
    }

    this.clientMetaService.recordView(this.entity);
    this.analyticsService.send('pageview', {
      url,
    });

    // * LOCATION & ROUTING * -----------------------------------------------------------------------------------
    // Change the url to point to media page so user can easily share link
    // (but don't actually redirect)
    this.location.replaceState(this.pageUrl);

    // Set Dimensions based on entity
    this.setEntityDimensions();
  }

  // * DIMENSION CALCULATIONS * ---------------------------------------------------------------------

  setEntityDimensions() {
    switch (this.contentType) {
      case 'video':
      case 'image':
        this.entityWidth = this.entity.width;
        this.entityHeight = this.entity.height;
        break;
      case 'blog':
        this.entityWidth = window.innerWidth * 0.6;
        this.entityHeight = window.innerHeight * 0.6;
        break;
    }

    this.aspectRatio = this.entityWidth / this.entityHeight;
    this.calculateDimensions();
  }

  // Re-calculate height/width when window resizes
  @HostListener('window:resize', ['$resizeEvent'])
  onResize(resizeEvent) {
    this.calculateDimensions();
  }

  calculateDimensions() {
    if (!this.isFullscreen) {
      if (this.contentType === 'blog') {
        this.mediaHeight = Math.max(
          this.minStageHeight,
          window.innerHeight * 0.9 - this.padding * 2
        );
        this.mediaWidth = Math.max(
          this.minStageWidth,
          window.innerWidth * 0.9 - this.contentWidth - this.padding * 2
        );
        this.stageHeight = this.mediaHeight;
        this.stageWidth = this.mediaWidth;
        this.modalWidth = this.stageWidth + this.contentWidth;

        if (this.isLoading) {
          this.isLoaded();
        }

        return;
      }

      this.setHeightsAsTallAsPossible();

      // After heights are set, check that scaled width isn't too wide or narrow
      this.maxStageWidth = Math.max(
        window.innerWidth - this.contentWidth - this.padding * 2,
        this.minStageWidth
      );

      if (this.mediaWidth >= this.maxStageWidth) {
        // Too wide :(
        this.rescaleHeightsForMaxWidth();
      } else if (this.mediaWidth > this.minStageWidth - this.padding * 2) {
        // Not too wide or too narrow :)
        this.stageWidth = this.mediaWidth;
      } else {
        // Too narrow :(
        // If black stage background is visible on left/right, each strip should be at least 20px wide
        this.stageWidth = this.minStageWidth;
        // Continue to resize height after reaching min width
        this.handleNarrowWindow();
      }

      // If black stage background is visible on top/bottom, each strip should be at least 20px high
      const heightDiff = this.stageHeight - this.mediaHeight;
      if (0 < heightDiff && heightDiff <= this.padding * 2) {
        this.stageHeight += this.padding * 2;
      }
    } else {
      // isFullscreen
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      this.stageWidth = windowWidth;
      this.stageHeight = windowHeight;

      switch (this.contentType) {
        case 'blog':
          this.mediaHeight = windowHeight;
          this.mediaWidth = windowWidth;
          return;
        case 'image':
          // For images, set mediaHeight as tall as possible but not taller than instrinsic height
          this.mediaHeight =
            this.entityHeight < windowHeight ? this.entityHeight : windowHeight;
          break;
        case 'video':
          // It's ok if videos are taller than intrinsic height
          this.mediaHeight = windowHeight;
      }

      this.mediaWidth =
        this.contentType === 'blog' ? windowWidth : this.scaleWidth();

      if (this.mediaWidth > windowWidth) {
        // Width was too wide, need to rescale heights so width fits
        this.mediaWidth = windowWidth;
        this.mediaHeight = this.scaleHeight();
      }
    }

    if (this.contentType === 'video') {
      this.entityHeight = this.mediaHeight;
      this.entityWidth = this.mediaWidth;
    }

    this.modalWidth = this.stageWidth + this.contentWidth;
  }

  setHeightsAsTallAsPossible() {
    this.maxHeight = window.innerHeight - this.padding * 2;

    // Initialize stageHeight to be as tall as possible and not smaller than minimum
    this.stageHeight = Math.max(this.maxHeight, this.minStageHeight);

    // Set mediaHeight as tall as stage but no larger than intrinsic height
    if (this.contentType !== 'video' && this.entityHeight < this.stageHeight) {
      // Image is shorter than stage; scale down stage
      this.mediaHeight = this.entityHeight;
      this.stageHeight = Math.max(this.mediaHeight, this.minStageHeight);
    } else {
      // Either: Image is taller than stage; scale it down so it fits inside stage
      // Or:     Video should be as tall as possible but not taller than stage
      this.mediaHeight = this.stageHeight;
    }

    // Scale width according to aspect ratio
    this.mediaWidth = this.scaleWidth();
  }

  rescaleHeightsForMaxWidth() {
    // Media is too wide, set width to max and rescale heights
    this.mediaWidth = this.maxStageWidth;
    this.stageWidth = this.maxStageWidth;

    this.mediaHeight = this.scaleHeight();
    this.stageHeight = Math.max(this.mediaHeight, this.minStageHeight);
  }

  handleNarrowWindow() {
    // When at minStageWidth and windowWidth falls below threshold,
    // shrink vertically until it hits minStageHeight

    // When window is narrower than this, start to shrink height
    const verticalShrinkWidthThreshold =
      this.mediaWidth + this.contentWidth + this.padding * 4;

    const widthDiff = verticalShrinkWidthThreshold - window.innerWidth;
    // Is window narrow enough to start shrinking vertically?
    if (widthDiff >= 1) {
      // What mediaHeight would be if it shrunk proportionally to difference in width
      const mediaHeightPreview = Math.round(
        (this.mediaWidth - widthDiff) / this.aspectRatio
      );

      // Shrink media if mediaHeight is still above min
      if (mediaHeightPreview > this.minStageHeight) {
        this.mediaWidth -= widthDiff;
        this.mediaHeight = this.scaleHeight();
        this.stageHeight = this.mediaHeight;
      } else {
        this.stageHeight = this.minStageHeight;
        this.mediaHeight = Math.min(this.minStageHeight, this.entityHeight);
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

  onDimensions($event) {
    if ($event.width && $event.height) {
      this.entity.width = $event.width;
      this.entity.height = $event.height;

      this.setEntityDimensions();
    }
  }

  // * FULLSCREEN * --------------------------------------------------------------------------------
  // Listen for fullscreen change event in case user enters/exits full screen without clicking button
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  onFullscreenChange(event) {
    this.calculateDimensions();
    if (
      !document.fullscreenElement &&
      !document['webkitFullscreenElement'] &&
      !document['mozFullScreenElement'] &&
      !document['msFullscreenElement']
    ) {
      this.isFullscreen = false;
    } else {
      this.isFullscreen = true;
    }
  }

  toggleFullscreen() {
    const elem = document.querySelector('.m-mediaModal__stageWrapper');
    this.fullscreenHovering = false;
    this.calculateDimensions();

    // If fullscreen is not already enabled
    if (
      !document['fullscreenElement'] &&
      !document['webkitFullscreenElement'] &&
      !document['mozFullScreenElement'] &&
      !document['msFullscreenElement']
    ) {
      // Request full screen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem['webkitRequestFullscreen']) {
        elem['webkitRequestFullscreen']();
      } else if (elem['mozRequestFullScreen']) {
        elem['mozRequestFullScreen']();
      } else if (elem['msRequestFullscreen']) {
        elem['msRequestFullscreen']();
      }
      this.isFullscreen = true;
      return;
    }

    // If fullscreen is already enabled, exit it
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document['webkitExitFullscreen']) {
      document['webkitExitFullscreen']();
    } else if (document['mozCancelFullScreen']) {
      document['mozCancelFullScreen']();
    } else if (document['msExitFullscreen']) {
      document['msExitFullscreen']();
    }
    this.isFullscreen = false;
  }

  // * KEYBOARD SHORTCUTS * --------------------------------------------------------------------------

  @HostListener('window:keydown', ['$event']) onWindowKeyDown(
    $event: KeyboardEvent
  ) {
    if (!$event || !$event.target) {
      return true;
    }

    const tagName = (
      ($event.target as HTMLElement).tagName || ''
    ).toLowerCase();
    const isContentEditable =
      ($event.target as HTMLElement).contentEditable === 'true';

    if (
      tagName === 'input' ||
      tagName === 'textarea' ||
      isContentEditable ||
      ($event.key !== 'ArrowLeft' &&
        $event.key !== 'ArrowRight' &&
        $event.key !== 'Escape')
    ) {
      return true;
    }

    $event.stopPropagation();
    $event.preventDefault();

    switch ($event.key) {
      case 'ArrowLeft':
        if (this.hasModalPager()) {
          this.goToPrev();
        }
        break;
      case 'ArrowRight':
        if (this.hasModalPager()) {
          this.goToNext();
        }
        break;
      case 'Escape':
        if (this.isOpen) {
          this.overlayModal.dismiss();
        }
        break;
    }

    return true;
  }

  // * MODAL DISMISSAL * --------------------------------------------------------------------------

  // Dismiss modal when backdrop is clicked and modal is open
  @HostListener('document:click', ['$event'])
  clickedBackdrop($event) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    if (this.isOpen) {
      this.overlayModal.dismiss();
    }
  }

  // Don't dismiss modal if click somewhere other than backdrop
  clickedModal($event) {
    $event.stopPropagation();
  }

  // * OVERLAY & VIDEO CONTROLS * -------------------------------------------------------------------------

  // Show overlay and video controls
  onMouseEnterStage() {
    this.overlayVisible = true;
    this.pagerVisible = true;
    if (this.pagerTimeout) {
      clearTimeout(this.pagerTimeout);
    }
  }

  onMouseLeaveStage() {
    this.overlayVisible = false;
    this.pagerTimeout = setTimeout(() => {
      this.pagerVisible = false;
    }, 2000);
  }

  // * TABLETS ONLY: SHOW OVERLAY & VIDEO CONTROLS * -------------------------------------------

  // Briefly display title overlay and video controls when finished loading and stage touch
  showOverlaysOnTablet() {
    this.onMouseEnterStage();

    if (this.tabletOverlayTimeout) {
      clearTimeout(this.tabletOverlayTimeout);
    }

    this.tabletOverlayTimeout = setTimeout(() => {
      this.onMouseLeaveStage();
    }, 3000);
  }

  // * PAGER * --------------------------------------------------------------------------

  hasModalPager() {
    return this.features.has('modal-pager');
  }

  async goToNext(): Promise<void> {
    if (!this.modalPager.hasNext) {
      return;
    }

    this.isLoading = true;

    const modalSourceUrl = this.entity.modal_source_url || '';
    const response = await this.horizontalFeed.next();

    if (response && response.entity) {
      this.setAsyncEntity(response.entity, {
        modal_source_url: modalSourceUrl,
      });
    } else {
      this.isLoading = false;
    }
  }

  async goToPrev(): Promise<void> {
    if (!this.modalPager.hasPrev) {
      return;
    }

    this.isLoading = true;

    const modalSourceUrl = this.entity.modal_source_url || '';
    const response = await this.horizontalFeed.prev();

    if (response && response.entity) {
      this.setAsyncEntity(response.entity, {
        modal_source_url: modalSourceUrl,
      });
    } else {
      this.isLoading = false;
    }
  }

  // * UTILITY * --------------------------------------------------------------------------

  isLoaded() {
    this.isLoading = false;

    if (this.isTablet) {
      this.showOverlaysOnTablet();
    }
  }

  openShareModal(): void {
    const url = this.overlayModal
      .create(ShareModalComponent, this.site.baseUrl + this.pageUrl.substr(1), {
        class: 'm-overlay-modal--medium m-overlayModal__share',
      })
      .present();
  }

  toggleMatureVisibility() {
    this.entity.mature_visibility = !this.entity.mature_visibility;
  }

  ngOnDestroy() {
    this.clearAsyncEntity();

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (this.modalPager$) {
      this.modalPager$.unsubscribe();
    }

    if (this.isOpenTimeout) {
      clearTimeout(this.isOpenTimeout);
    }

    if (this.tabletOverlayTimeout) {
      clearTimeout(this.tabletOverlayTimeout);
    }

    if (this.pagerTimeout) {
      clearTimeout(this.pagerTimeout);
    }

    // If the modal was closed without a redirect, replace media page url
    // with original source url and fix browser history so back button
    // doesn't go to media page
    if (!this.navigatedAway) {
      this.location.replaceState(this.entity.modal_source_url);
    }
  }
}
