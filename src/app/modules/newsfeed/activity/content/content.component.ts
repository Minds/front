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
  Inject,
} from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';

import { NavigationStart, Router } from '@angular/router';
import {
  ACTIVITY_COMMENTS_MORE_HEIGHT,
  ACTIVITY_COMMENTS_POSTER_HEIGHT,
  ACTIVITY_CONTENT_PADDING,
  ACTIVITY_V2_FIXED_HEIGHT_HEIGHT,
  ACTIVITY_FIXED_HEIGHT_RATIO,
  ACTIVITY_OWNERBLOCK_HEIGHT,
  ACTIVITY_TOOLBAR_HEIGHT,
  ACTIVITY_GRID_LAYOUT_MAX_HEIGHT,
  ACTIVITY_V2_SHORT_STATUS_MAX_LENGTH,
  ACTIVITY_V2_MEDIUM_STATUS_MAX_LENGTH,
  ACTIVITY_V2_MAX_MEDIA_HEIGHT,
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { RedirectService } from '../../../../common/services/redirect.service';
import { Session } from '../../../../services/session';
import { animate, style, transition, trigger } from '@angular/animations';
import { ScrollAwareVideoPlayerComponent } from '../../../media/components/video-player/scrollaware-player.component';
import { ACTIVITY_MODAL_MIN_STAGE_HEIGHT } from '../modal/modal.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { PersistentFeedExperimentService } from '../../../experiments/sub-services/persistent-feed-experiment.service';
import { ActivityModalCreatorService } from '../modal/modal-creator.service';
import { PaywallContextExperimentService } from '../../../experiments/sub-services/paywall-context-experiment.service';
import getMetaAutoCaption from '../../../../helpers/meta-auto-caption';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';

/**
 * The content of the activity and the paywall, if applicable.
 * Content types include image, video, rich embed (includes blogs), status (i.e. text only), quote.
 *
 * Reminds are excluded, as they are displayed as activity posts.
 *
 * All posts may have accompanying text.
 *
 * Media posts (images and videos) have an optional title field.
 *
 * Status posts are displayed in varying sizes - shorter status posts have larger text and vice versa.
 */
@Component({
  selector: 'm-activity__content',
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
export class ActivityContentComponent
  implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Whether or not we allow autoplay on scroll
   */
  @Input() allowAutoplayOnScroll: boolean = false;

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() autoplayVideo: boolean = false;

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

  // We use this to determine the height of
  // images in the boost rotator (aka fixed height)
  @ViewChild('imageContainerEl', { read: ElementRef })
  imageContainerEl: ElementRef;

  @ViewChild('textEl', { read: ElementRef })
  textEl: ElementRef;

  @ViewChild(ScrollAwareVideoPlayerComponent) videoPlayer;

  maxFixedHeightContent: number = 300 * ACTIVITY_FIXED_HEIGHT_RATIO;

  isRemind: boolean; // Is it a remind? (and NOT a quote)

  activityHeight: number;
  quoteHeight: number;
  videoHeight: number;
  videoWidth: number;

  imageHeight: number;
  imageWidth: number;
  imageAspectRatio: number = 0;
  imageOriginalHeight: number;

  paywallUnlocked: boolean = false;
  canonicalUrl: string;

  activeMultiImageIndex: number;
  activeMultiImageUrl: string;

  readonly siteUrl: string;
  readonly cdnAssetsUrl: string;

  subscriptions: Subscription[];

  entity: ActivityEntity;

  @HostBinding('class.m-activityContent--hasPaywallBadge')
  showPaywallBadge: boolean = false;

  @HostBinding('class.m-activityContent--fixedHeight')
  get isFixedHeight(): boolean {
    return this.service.displayOptions.fixedHeight;
  }

  @HostBinding('class.m-activityContent--minimalMode')
  get isMinimalMode(): boolean {
    return this.service.displayOptions.minimalMode;
  }

  @HostBinding('class.m-activityContent--sidebarMode')
  get sidebarMode(): boolean {
    return this.service.displayOptions.sidebarMode;
  }

  @HostBinding('class.m-activityContent--modal--left')
  get mediaOnly(): boolean {
    return !this.hideMedia && this.hideText;
  }

  @HostBinding('class.m-activityContent--modal--right')
  get textOnly(): boolean {
    return !this.hideText && this.hideMedia;
  }

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
      (this.entity.custom_type == 'batch' ||
        (this.entity.thumbnail_src &&
          !this.entity.perma_url &&
          this.entity.custom_type !== 'video')) &&
      !this.isMultiImage
    );
  }

  @HostBinding('class.m-activityContent--multiImage')
  isMultiImage: boolean;

  /**
   * Whether this is a quote post
   * (but not the post that was quoted)
   * */
  @HostBinding('class.m-activityContent--quote')
  isQuote: boolean;

  /**
   * Whether this is the post that was quoted
   * (aka the inset post)
   * */
  @HostBinding('class.m-activityContent--wasQuoted')
  @Input()
  wasQuoted: boolean = false;

  @HostBinding('class.m-activityContent--status')
  get isStatus(): boolean {
    return !(
      this.isImage ||
      this.isVideo ||
      this.isMultiImage ||
      this.isRichEmbed ||
      this.entity.remind_object
    );
  }

  @HostBinding('class.m-activityContent--supermindReply')
  isSupermindReply: boolean;

  @HostBinding('class.m-activityContent--textlessMedia')
  get textlessMedia(): boolean {
    return (
      !this.titleText &&
      !this.bodyText &&
      (this.isVideo || this.isImage || this.isMultiImage)
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
    private injector: Injector,
    private activityModalCreator: ActivityModalCreatorService,
    private persistentFeedExperiment: PersistentFeedExperimentService,
    private paywallContextExperiment: PaywallContextExperimentService,
    private cd: ChangeDetectorRef,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean
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
          this.calculateVideoDimensions();
          this.calculateImageDimensions();
        });

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
      this.service.isQuote$.subscribe(isQuote => {
        this.isQuote = isQuote;
      })
    );
    this.subscriptions.push(
      this.service.isSupermindReply$.subscribe(is => {
        this.isSupermindReply = is;
      })
    );
    this.subscriptions.push(
      this.service.isMultiImage$.subscribe(is => {
        this.isMultiImage = is;
      })
    );
    this.subscriptions.push(
      this.service.activeMultiImageIndex$.subscribe((i: number) => {
        if (this.isMultiImage) {
          this.activeMultiImageIndex = i;
          this.activeMultiImageUrl = this.entity?.custom_data[i].src;
        }
      })
    );
    this.subscriptions.push(
      this.service.shouldShowPaywallBadge$.subscribe((shouldShow: boolean) => {
        this.showPaywallBadge = shouldShow;
      })
    );
  }

  ngAfterViewInit() {
    // Run after view initialized (as modal uses the same component this doesnt get called)
    timer(1)
      .toPromise()
      .then(() => {
        this.calculateQuoteHeight();
        this.calculateVideoDimensions();
        this.calculateImageDimensions();
      });
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get titleText(): string {
    return this.isImage || this.isVideo || this.isMultiImage
      ? this.entity.title
      : '';
  }

  get bodyText(): string {
    // This is a deleted remind, with only the fallback link displaying
    if (this.entity.remind_deleted && this.entity.message.indexOf(' ') === 0) {
      return '';
    }

    // Use media message only if different from title
    if (this.isImage || this.isVideo || this.isMultiImage) {
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
      this.titleText?.length >= 1
      ? true
      : false;
  }

  get videoGuid(): string {
    return this.entity.entity_guid || this.entity.custom_data.guid;
  }

  get imageGuid(): string {
    return this.entity.entity_guid;
  }

  get imageAltTag(): string {
    if (!this.isImage) return;

    let caption = getMetaAutoCaption(this.entity);
    if (caption) {
      return `AI caption: ${caption}`;
    }
    return '';
  }

  get imageUrl(): string {
    if (this.entity.custom_type === 'batch') {
      return this.entity.custom_data[0].src;
    }

    if (this.entity.thumbnail_src && this.entity.custom_type !== 'video') {
      return this.entity.thumbnail_src;
    }

    return ''; // TODO: placeholder
  }

  get mediaHeight(): number | null {
    if (this.isImage) {
      return this.imageHeight || 410;
    }
    if (this.isVideo) {
      return this.videoHeight || 410;
    }
    if (this.isRichEmbed) {
      return 400;
    }
    return null;
  }

  get isModal(): boolean {
    return this.service.displayOptions.isModal;
  }

  get showTranslation(): boolean {
    return this.service.displayOptions.showTranslation;
  }

  get hasLoadingPriority(): boolean {
    return this.service.displayOptions.hasLoadingPriority;
  }

  // Text usually goes above media, except for
  // minimal mode and rich-embed modals
  // Note: no rich-embed modals anymore
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
      this.bodyText.length <= ACTIVITY_V2_SHORT_STATUS_MAX_LENGTH
    );
  }

  get mediumStatus(): boolean {
    return (
      this.entity.content_type === 'status' &&
      this.bodyText.length > ACTIVITY_V2_SHORT_STATUS_MAX_LENGTH &&
      this.bodyText.length <= ACTIVITY_V2_MEDIUM_STATUS_MAX_LENGTH
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

  /**
   * For paywalled posts in the experiment, show less text and
   * display the readMore toggle in a more distinctive color
   */
  get usePaywallContextStyles(): boolean {
    return this.paywallContextExperiment.isActive() && !!this.entity?.paywall;
  }

  /**
   * The "read more" toggle appears after this
   * number of characters (in a post with text)
   */
  get initialVisibleTextLength(): number {
    if (this.usePaywallContextStyles) {
      return 120;
    } else if (this.isFixedHeight && !this.isStatus) {
      // Show less text for boost rotator media posts
      // (the ones that that contain more than just text)
      return 180;
    } else {
      return 280;
    }
  }

  ////////////////////////////////////////////////////////////////////////////

  calculateFixedContentHeight(): void {
    if (!this.isFixedHeight) {
      return;
    }

    let contentHeight = this.activityHeight || ACTIVITY_V2_FIXED_HEIGHT_HEIGHT;
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
  calculateVideoDimensions(): void {
    if (!this.videoEl) {
      return;
    }
    let scaledHeight,
      scaledWidth,
      aspectRatio = 16 / 9;

    const videoElWidth = this.videoEl.nativeElement.clientWidth;

    if (
      this.entity.custom_data &&
      this.entity.custom_data.height &&
      this.entity.custom_data.height !== '0'
    ) {
      // If we have the original dimensions of the video,
      // load it with a height of 500px and a proportional width
      // so we don't have black bars on the side
      const originalWidth = parseInt(this.entity.custom_data.width, 10);
      const originalHeight = parseInt(this.entity.custom_data.height, 10);

      aspectRatio = originalWidth / originalHeight;
    }

    // see how tall it would be with max width
    scaledWidth = videoElWidth;
    scaledHeight = scaledWidth / aspectRatio;

    // if this ends up being taller than max height,
    // scale it down to fit within max height
    if (scaledHeight > ACTIVITY_V2_MAX_MEDIA_HEIGHT) {
      scaledHeight = ACTIVITY_V2_MAX_MEDIA_HEIGHT;
      scaledWidth = scaledHeight * aspectRatio;
    }

    this.videoHeight = scaledHeight;
    this.videoWidth = scaledWidth;

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
    } else if (
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
          originalHeight > 0 ? originalHeight : ACTIVITY_MODAL_MIN_STAGE_HEIGHT;
      } else if (this.isFixedHeight) {
        // For fixed height, calculate height based on
        // client height

        this.imageHeight = this.imageContainerEl.nativeElement.clientHeight;
        this.imageWidth = this.imageHeight / this.imageAspectRatio;
      } else {
        // For everything else, calculate height from
        // aspect ratio and clientWidth

        this.imageWidth = this.imageContainerEl.nativeElement.clientWidth;
        this.imageHeight = this.imageWidth * this.imageAspectRatio;

        // if this ends up being taller than max height,
        // scale it down to fit within max height
        if (this.imageHeight > ACTIVITY_V2_MAX_MEDIA_HEIGHT) {
          this.imageHeight = ACTIVITY_V2_MAX_MEDIA_HEIGHT;
          this.imageWidth = this.imageHeight / this.imageAspectRatio;
        }
      }
    } else {
      // If no custom dimensions data
      if (this.isModal) {
        // Size for modal stage
        this.imageHeight = ACTIVITY_MODAL_MIN_STAGE_HEIGHT;
      } else {
        this.imageHeight = ACTIVITY_V2_MAX_MEDIA_HEIGHT * 0.75;
      }
    }

    this.detectChanges();
  }

  onModalRequested(event: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Don't try to open modal if already in a modal
    if (this.isModal) {
      return;
    }

    // If on mobile device...
    if (!this.modalService.canOpenInModal()) {
      if (this.isMultiImage) {
        // ...and clicked on multi-image image,
        // open that image in a new tab instead of modal
        window.open(this.activeMultiImageUrl, '_blank');
      }
      // Ignore all other modal requests from mobile devices
      return;
    }

    // if sidebarMode, navigate to canonicalUrl for all content types
    if (this.sidebarMode) {
      this.redirectToSinglePage();
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

    // Open the activity modal
    this.activityModalCreator.create(
      this.entity,
      this.injector,
      this.activeMultiImageIndex
    );
  }

  onTranslate(e: Event): void {
    this.service.displayOptions.showTranslation === false;
  }

  /**
   * When boost rotator fadeout is clicked,
   * open modal (if image/video)
   * OR
   * redirect to single activity page
   *
   * Note: fadeout not used for status posts
   */
  onFixedHeightFadeoutClick($event): void {
    if (!this.isFixedHeight) {
      return;
    }
    $event.stopPropagation();

    if (this.isImage || this.isVideo || this.isMultiImage) {
      this.onModalRequested($event);
    } else {
      this.redirectToSinglePage();
    }
  }

  redirectToSinglePage(): void {
    // don't navigate if we're already there
    if (this.router.url !== this.canonicalUrl) {
      this.router.navigateByUrl(this.canonicalUrl);
    }
  }

  // Used as router link binding for image href
  get sepLink(): string[] {
    return ['/newsfeed', this.entity?.guid];
  }

  onImageError(e: Event): void {}

  persistentFeedExperimentActive = this.persistentFeedExperiment.isActive();

  onReadMoreClick(e: MouseEvent) {
    if (
      this.service.displayOptions.isFeed &&
      this.persistentFeedExperimentActive
    ) {
      this.redirectToSinglePage();
    }
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
