import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigsService } from '../../services/configs.service';

export type IconSource = 'md' | 'ion' | 'assets-file' | 'text';

/**
 * Normalized icon component
 */
@Component({
  selector: 'm-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'icon.component.html',
})
export class IconComponent {
  /**
   * Source for this icon
   */
  @Input() from: IconSource = 'md';

  /**
   * icon ID (for icons set) or file name for assets-file
   */
  @Input() iconId: string;

  /**
   * Sizing factor
   */
  @Input() sizeFactor: number = 35;

  /**
   * URL for CDN assets
   * @internal
   */
  readonly cdnAssetsUrl: string;

  /**
   * Constructor
   * @param configs
   */
  constructor(configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url') || '/';
  }

  /**
   * Gets the CSS size for the icon type
   */
  get sizeCss() {
    const size = 1 + this.sizeFactor / 100;

    switch (this.from) {
      case 'md':
      case 'ion':
        return { fontSize: `${size}em` };
      case 'text':
        return { fontSize: `${size}em` }; // Ratio might differ in the future
      case 'assets-file':
        return {
          width: `${size}em`,
          height: `${size}em`,
        };
    }

    return {};
  }

  /**
   * Gets the CSS size and mask image for local assets type
   */
  get maskAndSizeCss() {
    const maskImage = `url(${this.cdnAssetsUrl}${this.iconId})`;

    return {
      ...this.sizeCss,
      '-webkit-mask-image': maskImage,
      'mask-image': maskImage,
    };
  }
}
