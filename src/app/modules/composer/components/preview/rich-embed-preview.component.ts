import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RichEmbed } from '../../services/rich-embed.service';
import { MediaProxyService } from '../../../../common/services/media-proxy.service';

/**
 * Renders a user-friendly preview of the rich-embed
 */
@Component({
  selector: 'm-composerRichEmbedPreview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'rich-embed-preview.component.html',
})
export class RichEmbedPreviewComponent {
  /**
   * Rich embed metadata object
   */
  @Input() richEmbed: RichEmbed;

  /**
   * Constructor
   * @param mediaProxy
   */
  constructor(protected mediaProxy: MediaProxyService) {}

  /**
   * Gets a proxied URL for the thumbnail
   */
  getProxiedThumbnail() {
    if (!this.richEmbed || !this.richEmbed.thumbnail) {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }

    return this.mediaProxy.proxy(this.richEmbed.thumbnail, 1200);
  }

  /**
   * Extracts the domain name
   */
  extractDomain(): string {
    if (!this.richEmbed) {
      return '';
    }

    return new URL(this.richEmbed.url || '').hostname;
  }
}
