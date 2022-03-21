import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  HostBinding,
  Injector,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';

import { NavigationStart, Router } from '@angular/router';
import {
  ACTIVITY_COMMENTS_MORE_HEIGHT,
  ACTIVITY_COMMENTS_POSTER_HEIGHT,
  ACTIVITY_CONTENT_PADDING,
  ACTIVITY_FIXED_HEIGHT_HEIGHT,
  ACTIVITY_FIXED_HEIGHT_RATIO,
  ACTIVITY_OWNERBLOCK_HEIGHT,
  ACTIVITY_TOOLBAR_HEIGHT,
  ACTIVITY_GRID_LAYOUT_MAX_HEIGHT,
  ACTIVITY_SHORT_STATUS_MAX_LENGTH,
  ACTIVITY_MEDIUM_STATUS_MAX_LENGTH,
  ACTIVITY_CONTENT_MAX_HEIGHT,
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { RedirectService } from '../../../../common/services/redirect.service';
import * as moment from 'moment';
import { Session } from '../../../../services/session';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ScrollAwareVideoPlayerComponent } from '../../../media/components/video-player/scrollaware-player.component';
import {
  ActivityV2ModalComponent,
  ACTIVITY_MODAL_MIN_STAGE_HEIGHT,
} from '../modal/modal.component';
import { FeaturesService } from '../../../../services/features.service';
import { ActivityV2ModalCreatorService } from '../modal/modal-creator.service';
import { ModalService } from '../../../../services/ux/modal.service';

@Component({
  selector: 'm-activityV2__content',
  templateUrl: 'content.component.html',
  animations: [
    trigger('fader', [
      transition(':leave', [
        style({ opacity: '1' }),
        animate(
          '500ms cubic-bezier(0.23, 1, 0.32, 1)',
          style({ opacity: '0', height: '0px' })
        ),
      ]),
    ]),
  ],
  styleUrls: ['./content.component.ng.scss'],
})
export class ActivityV2ContentComponent
  implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Whether or not we allow autoplay on scroll
   */
  @Input() allowAutoplayOnScroll: boolean = false;

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() autoplayVideo: boolean = false;

  @Input() showPaywall: boolean = false;
  @Input() showPaywallBadge: boolean = false;

  /**
   * Used in activity modal
   */
  @Input() hideText: boolean = false;
  @Input() hideMedia: boolean = false;

  @Input() maxHeightAllowed: number;

  @ViewChild('videoEl', { read: ElementRef })
  videoEl: ElementRef;

  @ViewChild('imageEl', { read: ElementRef })
  imageEl: ElementRef;

  // ojm used in calculate remind height ?
  @ViewChild('textEl', { read: ElementRef })
  textEl: ElementRef;

  @ViewChild(ScrollAwareVideoPlayerComponent) videoPlayer;

  //ojm changed from 750
  maxFixedHeightContent: number = 300 * ACTIVITY_FIXED_HEIGHT_RATIO;

  isRemind: boolean;
  isQuote: boolean;

  activityHeight: number;
  quoteHeight: number;
  videoHeight: string;
  videoWidth: string;

  imageHeight: string;
  imageWidth: string;
  imageAspectRatio: number = 0;
  imageOriginalHeight: number;

  paywallUnlocked: boolean = false;
  canonicalUrl: string;

  readonly siteUrl: string;
  readonly cdnAssetsUrl: string;

  subscriptions: Subscription[];

  entity: ActivityEntity;

  @HostBinding('class.m-activityContent--fixedHeight')
  get isFixedHeight(): boolean {
    return this.service.displayOptions.fixedHeight;
  }

  @HostBinding('class.m-activity__content--minimalMode')
  get isMinimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  @HostBinding('class.m-activityContent--modal--left')
  get mediaOnly(): boolean {
    return !this.hideMedia && this.hideText;
  }

  @HostBinding('class.m-activityContent--modal--right')
  get textOnly(): boolean {
    return !this.hideText && this.hideMedia;
  }

  @HostBinding('class.m-activityContent--paywalledStatus')
  isPaywalledStatus: boolean;

  @HostBinding('class.m-activityContent--richEmbed')
  get isRichEmbed(): boolean {
    return !!this.entity.perma_url && !this.isVideo && !this.isImage;
  }

  @HostBinding('class.m-activityContent--blog')
  get isBlog(): boolean {
    return this.entity.content_type === 'blog';
  }

  @HostBinding('class.m-activityContent--video')
  get isVideo(): boolean {
    return this.entity.custom_type == 'video';
  }

  @HostBinding('class.m-activityContent--image')
  get isImage(): boolean {
    return (
      this.entity.custom_type == 'batch' ||
      (this.entity.thumbnail_src &&
        !this.entity.perma_url &&
        this.entity.custom_type !== 'video')
    );
  }

  @HostBinding('class.m-activityContent--status')
  get isStatus(): boolean {
    return !(
      this.isImage ||
      this.isVideo ||
      this.isRichEmbed ||
      this.entity.remind_object
    );
  }

  constructor(
    public service: ActivityService,
    private modalService: ModalService,
    private router: Router,
    private el: ElementRef,
    private redirectService: RedirectService,
    private session: Session,
    configs: ConfigsService,
    private features: FeaturesService,
    private injector: Injector,
    private activityModalCreator: ActivityV2ModalCreatorService,
    private cd: ChangeDetectorRef
  ) {
    this.siteUrl = configs.get('site_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.subscriptions = [
      this.service.entity$.subscribe((entity: ActivityEntity) => {
        this.entity = entity;

        this.calculateFixedContentHeight();
        setTimeout(() => {
          this.calculateVideoHeight();
          this.calculateImageDimensions();
        });

        this.isPaywalledStatus =
          this.showPaywallBadge && entity.content_type === 'status';
        if (
          this.entity.paywall_unlocked ||
          this.entity.ownerObj.guid === this.session.getLoggedInUser().guid
        ) {
          this.paywallUnlocked = true;
        }
      }),
    ];
    this.subscriptions.push(
      this.service.height$.subscribe((height: number) => {
        this.activityHeight = height;
        this.calculateQuoteHeight();
      })
    );
    this.subscriptions.push(
      this.service.paywallUnlockedEmitter.subscribe((unlocked: boolean) => {
        if (!unlocked) {
          return;
        }
        if (this.isVideo) {
          this.videoPlayer.forcePlay();
        }
        if (this.entity.content_type === 'blog') {
          this.redirectService.redirect(
            this.entity.perma_url + '?unlock=' + Date.now()
          );
        }
      })
    );
    this.subscriptions.push(
      this.service.canonicalUrl$.subscribe(canonicalUrl => {
        if (!this.entity) return;
        /**
         * Record pageviews
         */
        this.canonicalUrl = canonicalUrl;
      })
    );
    this.subscriptions.push(
      this.service.isRemind$.subscribe(is => {
        this.isRemind = is;
      })
    );
    this.subscriptions.push(
      this.service.isQuote$.subscribe(is => {
        this.isQuote = is;
      })
    );
  }

  ngAfterViewInit() {
    // Run after view initialized (as modal uses the same component this doesnt get called)
    timer(1)
      .toPromise()
      .then(() => {
        this.calculateQuoteHeight();
        this.calculateVideoHeight();
        this.calculateImageDimensions();
      });
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // ojm search for all instances of these classes (aka message/mediaDesc) in other components and change
  get titleText(): string {
    return this.isImage || this.isVideo ? this.entity.title : '';
  }

  get bodyText(): string {
    // This is a deleted remind, with only the fallback link displaying
    if (this.entity.remind_deleted && this.entity.message.indexOf(' ') === 0) {
      return '';
    }

    // Use media message only if different from title
    if (this.isImage || this.isVideo) {
      if (this.entity.message !== this.entity.title) {
        return this.entity.message;
      } else {
        return '';
      }
    }

    // No message if the same as blog title
    if (
      this.isBlog &&
      (!this.entity.message || this.entity.title === this.entity.message)
    ) {
      return '';
    }

    // if not an image or vid,
    return this.entity.message || this.entity.title;
  }

  get hideBodyText(): boolean {
    // Minimal mode hides media description if there is already a title
    return this.isMinimalMode &&
      (this.isImage || this.isVideo) &&
      this.titleText.length >= 1
      ? true
      : false;
  }

  get videoGuid(): string {
    return this.entity.entity_guid;
  }

  get imageGuid(): string {
    return this.entity.entity_guid;
  }

  get imageUrl(): string {
    if (this.entity.custom_type === 'batch') {
      let thumbUrl = this.entity.custom_data[0].src;

      return thumbUrl;
    }

    if (this.entity.thumbnail_src && this.entity.custom_type !== 'video') {
      return this.entity.thumbnail_src;
    }

    return ''; // TODO: placeholder
  }

  get mediaHeight(): number | null {
    if (this.isImage) {
      const imageHeight = this.imageHeight || '410px';
      return parseInt(imageHeight.slice(0, -2), 10);
    }
    if (this.isVideo) {
      return this.videoHeight ? parseInt(this.videoHeight.slice(0, -2), 10) : 0;
    }
    if (this.isRichEmbed) {
      return 400;
    }
    return null;
  }

  get isModal(): boolean {
    return this.service.displayOptions.isModal;
  }

  // Text usually goes above media, except for
  // minimal mode and rich-embed modals
  // ojm note: no rich-embed modals anymore
  get isTextBelowMedia(): boolean {
    return (
      (this.isMinimalMode && !this.isQuote) ||
      (this.isRichEmbed && this.isModal)
    );
  }

  get maxTextHeight(): number {
    if (this.isMinimalMode) {
      return ACTIVITY_GRID_LAYOUT_MAX_HEIGHT;
    } else {
      const maxTextHeight = this.isFixedHeight ? 130 : 320;

      return this.isStatus ? this.maxFixedHeightContent : maxTextHeight;
    }
  }

  get maxDescHeight(): number {
    if (this.isMinimalMode) {
      return ACTIVITY_GRID_LAYOUT_MAX_HEIGHT;
    } else if (this.isFixedHeight) {
      return 80;
    } else if (this.isModal) {
      return 115;
    }
    return 230;
  }

  get shortStatus(): boolean {
    return (
      this.entity.content_type === 'status' &&
      this.bodyText.length <= ACTIVITY_SHORT_STATUS_MAX_LENGTH
    );
  }

  get mediumStatus(): boolean {
    return (
      this.entity.content_type === 'status' &&
      this.bodyText.length > ACTIVITY_SHORT_STATUS_MAX_LENGTH &&
      this.bodyText.length <= ACTIVITY_MEDIUM_STATUS_MAX_LENGTH
    );
  }

  get extraTallImage(): boolean {
    return (
      this.imageOriginalHeight >= 500 &&
      this.imageAspectRatio &&
      this.imageAspectRatio > 3
    );
  }

  get extraWideImage(): boolean {
    return (
      this.imageAspectRatio &&
      this.imageAspectRatio < 0.333 &&
      this.imageOriginalHeight >= 166
    );
  }

  get showPermalink(): boolean {
    return !this.hideText && this.service.displayOptions.permalinkBelowContent;
  }

  ////////////////////////////////////////////////////////////////////////////

  calculateFixedContentHeight(): void {
    if (!this.isFixedHeight) {
      return;
    }

    let contentHeight = this.activityHeight || ACTIVITY_FIXED_HEIGHT_HEIGHT;
    contentHeight = contentHeight - ACTIVITY_CONTENT_PADDING;
    if (this.service.displayOptions.showOwnerBlock) {
      contentHeight = contentHeight - ACTIVITY_OWNERBLOCK_HEIGHT;
    }
    if (this.service.displayOptions.showToolbar) {
      contentHeight = contentHeight - ACTIVITY_TOOLBAR_HEIGHT;
    }
    if (this.service.displayOptions.showComments) {
      contentHeight = contentHeight - ACTIVITY_COMMENTS_POSTER_HEIGHT;
    }
    if (
      this.service.displayOptions.showComments &&
      this.entity['comments:count'] > 0
    ) {
      contentHeight = contentHeight - ACTIVITY_COMMENTS_MORE_HEIGHT;
    }

    this.maxFixedHeightContent = contentHeight;
  }

  @HostListener('window:resize')
  calculateQuoteHeight(): void {
    if (!this.isFixedHeight) return;
    const textHeight = this.textEl ? this.textEl.nativeElement.clientHeight : 0;

    this.calculateFixedContentHeight();

    const maxFixedHeightContent = this.maxFixedHeightContent;

    this.quoteHeight = maxFixedHeightContent - textHeight;
  }

  /**
   * Calculates the video height after the video has loaded in
   */
  calculateVideoHeight(): void {
    if (!this.videoEl) {
      return;
    }
    let aspectRatio = 16 / 9;
    if (
      this.entity.custom_data &&
      this.entity.custom_data.height &&
      this.entity.custom_data.height !== '0'
    ) {
      aspectRatio =
        parseInt(this.entity.custom_data.width, 10) /
        parseInt(this.entity.custom_data.height, 10);
    }
    const height = this.videoEl.nativeElement.clientWidth / aspectRatio;
    this.videoHeight = `${height}px`;

    this.detectChanges();
  }

  /**
   * Calculates the image height and aspect ratio
   */
  calculateImageDimensions(): void {
    if (!this.imageEl) {
      return;
    }
    if (this.isFixedHeight || this.entity.custom_type !== 'batch') {
      this.imageHeight = null;
    }

    if (
      this.entity.custom_data &&
      this.entity.custom_data[0] &&
      this.entity.custom_data[0].height &&
      this.entity.custom_data[0].height !== '0'
    ) {
      // Get aspect ratio from original dimensions (if available)
      const originalHeight = parseInt(this.entity.custom_data[0].height || 0);
      const originalWidth = parseInt(this.entity.custom_data[0].width || 0);

      this.imageOriginalHeight = originalHeight;
      this.imageAspectRatio = originalHeight / originalWidth;

      // For modals, keep original dimensions
      if (this.isModal) {
        this.imageHeight =
          originalHeight > 0
            ? `${originalHeight}px`
            : `${ACTIVITY_MODAL_MIN_STAGE_HEIGHT}px`;
      } else {
        // For everything else, calculate height from
        // aspect ratio and clientWidth
        const height =
          this.imageEl.nativeElement.clientWidth * this.imageAspectRatio;

        this.imageHeight = `${height}px`;
      }
    } else {
      // If no custom dimensions data
      if (this.isModal) {
        // Size for modal stage
        this.imageHeight = `${ACTIVITY_MODAL_MIN_STAGE_HEIGHT}px`;
      } else {
        this.imageHeight = null;
      }
    }

    this.detectChanges();
  }

  /**
   * Open the activity in the modal when you click on
   * its message or description
   */
  // onMessageClick(event): void {
  //   return;

  // ojm remove
  // if (this.isModal) {
  //   return;
  // }

  // /**
  //  * Don't open modal if click on link, readmore, or translation
  //  */
  // if (event.target instanceof HTMLAnchorElement) {
  //   return;
  // } else if (
  //   event.target.classList.contains('m-readMoreButton--v2') ||
  //   event.target.classList.contains('m-readMoreButtonV2__text') ||
  //   event.target.closest('m-translate')
  // ) {
  //   return;
  // } else {
  //   this.onModalRequested(event);
  // }
  // }

  onModalRequested(event: MouseEvent) {
    if (!this.modalService.canOpenInModal() || this.isModal) {
      return;
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    //if sidebarMode, navigate to canonicalUrl for all content types
    if (this.service.displayOptions.sidebarMode) {
      this.router.navigateByUrl(this.canonicalUrl);
      return;
    }

    if (
      this.service.displayOptions.bypassMediaModal &&
      this.entity.content_type !== 'image' &&
      this.entity.content_type !== 'video'
    ) {
      // Open new window to media page instead of media modal
      window.open(this.canonicalUrl, '_blank');
      return;
    }

    // Don't open modal for minds links
    if (
      this.entity.perma_url &&
      this.entity.perma_url.indexOf(this.siteUrl) === 0
    ) {
      this.redirectService.redirect(this.entity.perma_url);
      return;
    }

    this.activityModalCreator.create(this.entity, this.injector);
  }

  onTranslate(e: Event): void {
    this.service.displayOptions.showTranslation === false;
  }

  /**
   * Gets URL to redirect.
   * @returns { string } - equals '' if url is not needed.
   */
  getRedirectUrl(): string {
    return this.isFixedHeight ? `/newsfeed/${this.entity.guid}` : '';
  }

  onImageError(e: Event): void {}

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
