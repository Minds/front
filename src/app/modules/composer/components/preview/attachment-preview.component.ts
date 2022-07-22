import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigsService } from '../../../../common/services/configs.service';
import { AttachmentPreviewResource } from '../../services/preview.service';
import { ComposerService } from '../../services/composer.service';
import { Observable, Subscription } from 'rxjs';
import { VideoPoster } from '../../services/video-poster.service';

/**
 * Renders a user-friendly preview of the embedded photo/video media attachment
 */
@Component({
  selector: 'm-composerPreview--attachment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'attachment-preview.component.html',
})
export class AttachmentPreviewComponent
  implements OnInit, OnDestroy, OnChanges {
  videoPosterSubscription: Subscription;

  /**
   * The preview resource
   */
  @Input() attachmentPreviewResource: AttachmentPreviewResource;

  /**
   * Orientation emitter, called when media loads
   */
  @Output('onPortraitOrientation') onPortraitOrientationEmitter: EventEmitter<
    boolean
  > = new EventEmitter<boolean>();

  safeResourceUrl: SafeResourceUrl;
  safeVideoPosterUrl: SafeResourceUrl;

  /**
   * URL for the CDN
   */
  readonly cdnUrl: string;

  /**
   * Constructor
   * @param domSanitizer
   * @param configs
   */
  constructor(
    protected domSanitizer: DomSanitizer,
    configs: ConfigsService,
    protected service: ComposerService,
    private cd: ChangeDetectorRef
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.videoPosterSubscription = this.service.videoPoster$.subscribe(
      (videoPoster: VideoPoster) => {
        this.safeVideoPosterUrl = videoPoster
          ? this.sanitizeUrl(videoPoster.url)
          : null;
        this.cd.markForCheck();
        this.cd.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.videoPosterSubscription.unsubscribe();
  }

  ngOnChanges(changes) {
    this.buildSafeUrl(this.attachmentPreviewResource);
  }

  /**
   * Builds the safe URL for a resource
   * @param resource
   */
  buildSafeUrl(resource: AttachmentPreviewResource) {
    switch (resource.sourceType) {
      case 'image':
        if (resource.source === 'local') {
          this.safeResourceUrl = this.sanitizeUrl(resource.payload);
        } else if (resource.source === 'guid') {
          this.safeResourceUrl =
            `${this.cdnUrl}fs/v1/thumbnail/${resource.payload}/xlarge/?unlock_paywall=` +
            Date.now();
        }
        break;
      case 'video':
        if (resource.source === 'local') {
          this.safeResourceUrl = this.sanitizeUrl(`${resource.payload}#t=1`);
        } else if (resource.source === 'guid') {
          this.safeResourceUrl = this.sanitizeUrl(
            `${this.cdnUrl}api/v1/media/${resource.payload}/play/#t=1`
          );
        }
        break;
    }
  }

  /**
   * Trust the Blob URL used to preview the media
   * @param url
   */
  protected sanitizeUrl(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Calculates portrait mode for images. Called on load.
   * @param image
   */
  fitForImage(image: HTMLImageElement): void {
    if (!image) {
      this.onPortraitOrientationEmitter.emit(false);
      return;
    }

    this.onPortraitOrientationEmitter.emit(
      image.naturalHeight >= image.naturalWidth
    );
  }

  /**
   * Calculates portrait mode for videos. Called on load.
   * @param video
   */
  fitForVideo(video: HTMLVideoElement) {
    if (!video) {
      this.onPortraitOrientationEmitter.emit(false);
    }

    this.onPortraitOrientationEmitter.emit(
      video.videoHeight >= video.videoWidth
    );
  }
}
