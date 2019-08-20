import { Component, OnInit, OnDestroy, Input, HostListener, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Event, NavigationStart } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { AnalyticsService } from '../../../services/analytics';
import { MindsVideoComponent } from '../components/video/video.component';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';

@Component({
  selector: 'm-media--modal',
  templateUrl: 'modal.component.html',
  animations: [
    // Fade media in after load
    trigger('slowFadeAnimation', [
      state('in', style({
        opacity: 1
      })),
      state('out', style({
        opacity: 0
      })),
      transition('in <=> out', [
        animate('600ms')
      ]),
    ]),
    // Fade overlay in/out
    trigger('fastFadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
  ]
})

export class MediaModalComponent implements OnInit, OnDestroy {
  minds = window.Minds;
  entity: any = {};
  isLoading: boolean = true;
  navigatedAway: boolean = false;
  fullscreenHovering: boolean = false; // Used for fullscreen button transformation

  isTablet: boolean = false;
  isFullscreen: boolean = false;
  isVideo: boolean = false; // Otherwise it's an image

  aspectRatio: number;
  modalWidth: number;
  stageWidth: number;
  stageHeight: number;
  mediaWidth: number;
  mediaHeight: number;

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
  permalinkGuid: string = '';
  hasMessage: boolean = true;
  message: string = '';

  // Used for backdrop click detection hack
  isOpen: boolean = false;
  isOpenTimeout: any = null;

  showOverlay: boolean = false;
  tabletOverlayTimeout: any = null;

  routerSubscription: Subscription;

  @Input('entity') set data(entity) {
    this.entity = entity;
    this.entity.width = 0;
    this.entity.height = 0;
  }

  // Used to make sure video progress bar seeker / hover works
  @ViewChild( MindsVideoComponent, { static: false }) videoComponent: MindsVideoComponent;

  constructor(
    public session: Session,
    public analyticsService: AnalyticsService,
    private overlayModal: OverlayModalService,
    private router: Router,
    private location: Location,
  ) {
  }

  ngOnInit() {
    // Prevent dismissal of modal when it's just been opened
    this.isOpenTimeout = setTimeout(() => this.isOpen = true, 20);

    this.boosted = this.entity.boosted || this.entity.p2p_boosted;

    // Set title
    if (!this.entity.title) {
      if (!this.entity.message) {
        this.title = `${this.entity.ownerObj.name}'s post`;
        this.hasMessage = false;
      } else {
        this.title = this.entity.message;
      }
    } else {
      this.title = this.entity.title;
    }

    this.message = this.hasMessage ? this.title : null;

    // Set ownerIconTime
    const session = this.session.getLoggedInUser();
    if (session && session.guid === this.entity.ownerObj.guid) {
      this.ownerIconTime =  session.icontime;
    } else {
      this.ownerIconTime = this.entity.ownerObj.icontime;
    }

    this.permalinkGuid = this.entity.guid ? this.entity.guid : this.entity.entity_guid;

    // Allow comment tree to work
    if (!this.entity.guid) {
      this.entity.guid = this.entity.entity_guid;
    }

    this.isTablet = isMobileOrTablet() && Math.min(screen.width, screen.height) >= 768;

    this.isVideo = this.entity.custom_type === 'video';

    this.analyticsService.send('pageview', {url: `/media/${this.entity.entity_guid}?ismodal=true`});

    // * LOCATION & ROUTING * -----------------------------------------------------------------------------------
    // Change the url to point to media page so user can easily share link
    // (but don't actually redirect)
    this.location.replaceState(`/media/${this.entity.entity_guid}`);


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

    // * DIMENSION CALCULATIONS * ---------------------------------------------------------------------

    if (!this.isVideo) {
      // Image
      this.entity.width = this.entity.custom_data[0].width;
      this.entity.height = this.entity.custom_data[0].height;
      this.thumbnail = `${this.minds.cdn_url}fs/v1/thumbnail/${this.entity.entity_guid}/xlarge`;
    } else {
      this.entity.width = this.entity.custom_data.dimensions.width;
      this.entity.height = this.entity.custom_data.dimensions.height;
      this.thumbnail = this.entity.custom_data.thumbnail_src; // Not currently used
    }

    this.aspectRatio = this.entity.width / this.entity.height;
    this.calculateDimensions();
  }

  // Re-calculate height/width when window resizes
  @HostListener('window:resize', ['$resizeEvent'])
    onResize(resizeEvent) {
      this.calculateDimensions();
    }

  calculateDimensions() {
    if ( !this.isFullscreen ) {
      this.setHeightsAsTallAsPossible();

      // After heights are set, check that scaled width isn't too wide or narrow
      this.maxStageWidth = Math.max(window.innerWidth - this.contentWidth - (this.padding * 2), this.minStageWidth);

      if ( this.mediaWidth >= this.maxStageWidth ) {
        // Too wide :(
        this.rescaleHeightsForMaxWidth();
      } else if ( this.mediaWidth > (this.minStageWidth - (this.padding * 2)) ) {
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
      if ( 0 < heightDiff && heightDiff <= this.padding * 2) {
        this.stageHeight += 40;
      }

    } else { // isFullscreen
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      this.stageWidth = windowWidth;
      this.stageHeight = windowHeight;

      // Set mediaHeight as tall as possible but not taller than instrinsic height
      this.mediaHeight = this.entity.height < windowHeight ? this.entity.height : windowHeight;
      this.mediaWidth = this.scaleWidth();

      if ( this.mediaWidth > windowWidth ) {
        // Width was too wide, need to rescale heights so width fits
        this.mediaWidth = windowWidth;
        this.mediaHeight = this.scaleHeight();
      }
    }

    if (this.isVideo) {
      this.entity.height = this.mediaHeight;
      this.entity.width = this.mediaWidth;
    }

    this.modalWidth = this.stageWidth + this.contentWidth;
  }


  setHeightsAsTallAsPossible() {
    this.maxHeight = window.innerHeight - (this.padding * 2);

    // Initialize stageHeight to be as tall as possible and not smaller than minimum
    this.stageHeight = Math.max(this.maxHeight, this.minStageHeight);

    // Set mediaHeight as tall as stage but no larger than intrinsic height
    if (!this.isVideo && this.entity.height < this.stageHeight) {
      // Image is shorter than stage; scale down stage
      this.mediaHeight = this.entity.height;
      this.stageHeight = Math.max(this.mediaHeight, this.minStageHeight);
    } else {
      // Image is taller than stage; scale it down so it fits inside stage
      // All videos should be as tall as possible but not taller than stage
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
    const verticalShrinkWidthThreshold = this.mediaWidth + this.contentWidth + (this.padding * 4); // + 2;

    const widthDiff = verticalShrinkWidthThreshold - window.innerWidth;

    // Is window narrow enough to start shrinking vertically?
    if ( widthDiff >= 1 ) {

      // What mediaHeight would be if it shrunk proportionally to difference in width
      const mediaHeightPreview = Math.round((this.mediaWidth - widthDiff) / this.aspectRatio);

      // Shrink media if mediaHeight is still above min
      if (mediaHeightPreview > this.minStageHeight) {
        this.mediaWidth -= widthDiff;
        this.mediaHeight = this.scaleHeight();
        this.stageHeight = this.mediaHeight;
      } else {
        this.stageHeight = this.minStageHeight;
        this.mediaHeight = Math.min(this.minStageHeight, this.entity.height);
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


  // * FULLSCREEN * --------------------------------------------------------------------------------
  // Listen for fullscreen change event in case user enters/exits full screen without clicking button
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  onFullscreenChange(event) {
    this.calculateDimensions();
    if ( !document.fullscreenElement &&
      !document['webkitFullScreenElement'] &&
      !document['mozFullScreenElement'] &&
      !document['msFullscreenElement'] ) {
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
    if ( !document['fullscreenElement'] &&
      !document['webkitFullScreenElement'] &&
      !document['mozFullScreenElement'] &&
      !document['msFullscreenElement'] ) {
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
    if ( document.exitFullscreen ) {
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


  // * MODAL DISMISSAL * --------------------------------------------------------------------------

  // Dismiss modal when backdrop is clicked and modal is open
  @HostListener('document:click', ['$event'])
  clickedBackdrop($event) {
    $event.preventDefault();
    $event.stopPropagation();
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
    this.showOverlay = true;

    if (this.isVideo) {
      // Make sure progress bar seeker is updating when video controls are visible
      this.videoComponent.stageHover = true;
      this.videoComponent.onMouseEnter();
    }
  }

  // Hide overlay and video controls
  onMouseLeaveStage() {
    this.showOverlay = false;

    if (this.isVideo) {
      // Stop updating progress bar seeker when controls aren't visible
      this.videoComponent.stageHover = false;
      this.videoComponent.onMouseLeave();
    }
  }

  // * TABLETS ONLY: SHOW OVERLAY & VIDEO CONTROLS * -------------------------------------------

  // Briefly display title overlay and video controls when finished loading and stage touch
  showOverlays() {
    this.onMouseEnterStage();

    if (this.tabletOverlayTimeout) {
      clearTimeout(this.tabletOverlayTimeout);
    }

    this.tabletOverlayTimeout = setTimeout(() => {
      this.onMouseLeaveStage();
    }, 3000);
  }

  // * UTILITY * --------------------------------------------------------------------------

  isLoaded() {
    this.isLoading = false;

    if ( this.isTablet ) {
      this.showOverlays();
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (this.isOpenTimeout) {
      clearTimeout(this.isOpenTimeout);
    }

    if (this.tabletOverlayTimeout) {
      clearTimeout(this.tabletOverlayTimeout);
    }

    // If the modal was closed without a redirect, replace media page url
    // with original source url and fix browser history so back button
    // doesn't go to media page
    if (!this.navigatedAway) {
      this.location.replaceState(this.entity.modal_source_url);
    }
  }
}
