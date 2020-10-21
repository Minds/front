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
} from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { Router } from '@angular/router';
import {
  ACTIVITY_COMMENTS_MORE_HEIGHT,
  ACTIVITY_COMMENTS_POSTER_HEIGHT,
  ACTIVITY_CONTENT_PADDING,
  ACTIVITY_FIXED_HEIGHT_HEIGHT,
  ACTIVITY_FIXED_HEIGHT_RATIO,
  ACTIVITY_OWNERBLOCK_HEIGHT,
  ACTIVITY_TOOLBAR_HEIGHT,
  ACTIVITY_GRID_LAYOUT_MAX_HEIGHT,
  ActivityEntity,
  ActivityService,
} from '../activity.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MediaModalComponent } from '../../../media/modal/modal.component';
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
  ActivityModalComponent,
  ACTIVITY_MODAL_MIN_STAGE_HEIGHT,
} from '../modal/modal.component';
import { FeaturesService } from '../../../../services/features.service';
import { ActivityModalCreatorService } from '../modal/modal-creator.service';

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

  @Input() showPaywall: boolean = false;
  @Input() showPaywallBadge: boolean = false;

  /**
   * Used in activity modal
   */
  @Input() hideText: boolean = false;
  @Input() hideMedia: boolean = false;

  @ViewChild('mediaEl', { read: ElementRef })
  mediaEl: ElementRef;

  @ViewChild('messageEl', { read: ElementRef })
  messageEl: ElementRef;

  @ViewChild('mediaDescriptionEl', { read: ElementRef })
  mediaDescriptionEl: ElementRef;

  @ViewChild(ScrollAwareVideoPlayerComponent) videoPlayer;

  maxFixedHeightContent: number = 750 * ACTIVITY_FIXED_HEIGHT_RATIO;

  activityHeight: number;
  remindWidth: number;
  remindHeight: number;

  paywallUnlocked: boolean = false;
  canonicalUrl: string;

  private entitySubscription: Subscription;
  private activityHeightSubscription: Subscription;
  private paywallUnlockedSubscription: Subscription;
  private canonicalUrlSubscription: Subscription;

  readonly siteUrl: string;
  readonly cdnAssetsUrl: string;

  entity: ActivityEntity;

  @HostBinding('class.m-activityContent--paywalledStatus')
  isPaywalledStatusPost: boolean;

  constructor(
    public service: ActivityService,
    private overlayModal: OverlayModalService,
    private router: Router,
    private el: ElementRef,
    private redirectService: RedirectService,
    private session: Session,
    configs: ConfigsService,
    private features: FeaturesService,
    private injector: Injector,
    private activityModalCreator: ActivityModalCreatorService
  ) {
    this.siteUrl = configs.get('site_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
        this.calculateFixedContentHeight();
        this.isPaywalledStatusPost =
          this.showPaywallBadge && entity.content_type === 'status';
        if (
          this.entity.paywall_unlocked ||
          this.entity.ownerObj.guid === this.session.getLoggedInUser().guid
        ) {
          this.paywallUnlocked = true;
        }
      }
    );
    this.canonicalUrlSubscription = this.service.canonicalUrl$.subscribe(
      canonicalUrl => {
        if (!this.entity) return;
        this.canonicalUrl = canonicalUrl;
      }
    );
    this.activityHeightSubscription = this.service.height$.subscribe(
      (height: number) => {
        this.activityHeight = height;
        this.calculateRemindHeight();
      }
    );
    this.paywallUnlockedSubscription = this.service.paywallUnlockedEmitter.subscribe(
      (unlocked: boolean) => {
        if (!unlocked) {
          return;
        }
        if (this.isVideo) {
          this.videoPlayer.forcePlay();
        }
        if (this.entity.content_type === 'blog') {
          this.redirectService.redirect(this.entity.perma_url);
        }
      }
    );

    this.canonicalUrlSubscription = this.service.canonicalUrl$.subscribe(
      canonicalUrl => {
        if (!this.entity) return;
        /**
         * Record pageviews
         */
        this.canonicalUrl = canonicalUrl;
      }
    );
  }

  ngAfterViewInit() {
    // Run after view initialized
    timer(0)
      .toPromise()
      .then(() => this.calculateRemindHeight());
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
    this.activityHeightSubscription.unsubscribe();
    this.paywallUnlockedSubscription.unsubscribe();
    this.canonicalUrlSubscription.unsubscribe();
  }

  get message(): string {
    // No message if media post
    if (this.mediaDescription || this.mediaTitle) return '';

    // No message if the same as blog title
    if (
      this.entity.perma_url &&
      (!this.entity.message || this.entity.title === this.entity.message)
    )
      return '';

    return this.entity.message || this.entity.title;
  }

  get isRichEmbed(): boolean {
    return !!this.entity.perma_url && !this.isVideo && !this.isImage;
  }

  get mediaTitle(): string {
    return this.isImage || this.isVideo ? this.entity.title : '';
  }

  get mediaDescription(): string {
    return (this.isImage || this.isVideo) &&
      this.entity.message !== this.entity.title
      ? this.entity.message
      : '';
  }

  get hideMediaDescription(): boolean {
    // Minimal mode hides description if there is already a title
    return this.service.displayOptions.minimalMode &&
      this.mediaTitle.length >= 1
      ? true
      : false;
  }

  get isVideo(): boolean {
    return this.entity.custom_type == 'video';
  }

  get videoGuid(): string {
    return this.entity.entity_guid;
  }

  get isImage(): boolean {
    return (
      this.entity.custom_type == 'batch' ||
      (this.entity.thumbnail_src &&
        !this.entity.perma_url &&
        this.entity.custom_type !== 'video')
    );
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

  get imageHeight(): string {
    if (this.service.displayOptions.fixedHeight) return null;
    if (this.entity.custom_type !== 'batch') return null;
    const originalHeight = parseInt(this.entity.custom_data[0].height || 0);
    const originalWidth = parseInt(this.entity.custom_data[0].width || 0);

    if (!originalHeight || !originalWidth) {
      if (this.isModal) {
        return `${ACTIVITY_MODAL_MIN_STAGE_HEIGHT}px`;
      } else {
        return null;
      }
    }

    if (this.isModal && originalHeight) {
      return `${originalHeight}px`;
    }

    const ratio = originalHeight / originalWidth;

    const height = this.el.nativeElement.clientWidth * ratio;
    return `${height}px`;
  }

  get imageGuid(): string {
    return this.entity.entity_guid;
  }

  get isTextOnly(): boolean {
    return !(
      this.isImage ||
      this.isVideo ||
      this.isRichEmbed ||
      this.entity.remind_object
    );
  }

  get videoHeight(): string {
    if (!this.mediaEl) return '';
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
    const height = this.mediaEl.nativeElement.clientWidth / aspectRatio;
    return `${height}px`;
  }

  get mediaHeight(): number | null {
    if (this.isImage) {
      const imageHeight = this.imageHeight || '410px';
      return parseInt(imageHeight.slice(0, -2), 10);
    }
    if (this.isVideo) {
      return parseInt(this.videoHeight.slice(0, -2), 10);
    }
    if (this.isRichEmbed) {
      return 400;
    }
    return null;
  }

  get isModal(): boolean {
    return this.service.displayOptions.isModal;
  }

  calculateFixedContentHeight(): void {
    if (!this.service.displayOptions.fixedHeight) {
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
  calculateRemindHeight(): void {
    if (!this.service.displayOptions.fixedHeight) return;
    const messageHeight = this.messageEl
      ? this.messageEl.nativeElement.clientHeight
      : 0;

    this.calculateFixedContentHeight();

    const maxFixedHeightContent = this.maxFixedHeightContent;

    this.remindHeight = maxFixedHeightContent - messageHeight;

    //if (this.entity['remind_object'].)
    //this.remindWidth = this.remindHeight * ACTIVITY_FIXED_HEIGHT_RATIO;
  }

  onModalRequested(event: MouseEvent) {
    if (!this.overlayModal.canOpenInModal() || this.isModal) {
      return;
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
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

    if (
      this.entity.perma_url &&
      this.entity.perma_url.indexOf(this.siteUrl) === 0
    ) {
      this.redirectService.redirect(this.entity.perma_url);
      return; // Don't open modal for minds links
    }

    this.activityModalCreator.create(this.entity, this.injector);
  }

  onImageError(e: Event): void {}

  get maxMessageHeight(): number {
    if (this.service.displayOptions.minimalMode) {
      return ACTIVITY_GRID_LAYOUT_MAX_HEIGHT;
    } else {
      const maxMessageHeight = this.service.displayOptions.fixedHeight
        ? 130
        : 320;
      return this.isTextOnly ? this.maxFixedHeightContent : maxMessageHeight;
    }
  }

  get maxDescHeight(): number {
    if (this.service.displayOptions.minimalMode) {
      return ACTIVITY_GRID_LAYOUT_MAX_HEIGHT;
    } else {
      return this.service.displayOptions.fixedHeight ? 80 : 320;
    }
  }
}
