import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigsService } from '../../../../common/services/configs.service';
import { AttachmentPreviewResource } from '../../services/preview.service';

@Component({
  selector: 'm-composerAttachmentPreview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'attachment-preview.component.html',
})
export class AttachmentPreviewComponent {
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

  /**
   * URL for the CDN
   */
  readonly cdnUrl: string;

  /**
   * Constructor
   * @param domSanitizer
   * @param configs
   */
  constructor(protected domSanitizer: DomSanitizer, configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
  }

  /**
   * Gets the URL for a resource
   * @param resource
   */
  getUrl(resource: AttachmentPreviewResource) {
    switch (resource.sourceType) {
      case 'image':
        if (resource.source === 'local') {
          return this.localTrustedUrl(resource.payload);
        } else if (resource.source === 'guid') {
          return `${this.cdnUrl}fs/v1/thumbnail/${resource.payload}/xlarge/`;
        }
        break;
      case 'video':
        if (resource.source === 'local') {
          return `${this.localTrustedUrl(resource.payload)}#t=1`;
        } else if (resource.source === 'guid') {
          return `${this.cdnUrl}api/v1/media/${resource.payload}/play/#t=1`;
        }
        break;
    }
  }

  /**
   * Trust the Blob URL used to preview the media
   * @param url
   */
  protected localTrustedUrl(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
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
