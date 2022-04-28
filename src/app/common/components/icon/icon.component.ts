import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigsService } from '../../services/configs.service';
import { CUSTOM_ICONS } from './custom-icons';

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
   * Sizing factor.
   * For rem, use '1.25' for when you want 1.25rem
   * (aka 25% larger than root element font size)
   */
  @Input() sizeFactor: number = 35;

  /**
   * Use rem instead of em
   */
  @Input() rem: boolean = false;

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
    let size;
    if (this.rem) {
      size = `${this.sizeFactor}rem`;
    } else {
      const multiplier = 1 + this.sizeFactor / 100;
      size = `${multiplier}em`;
    }

    switch (this.from) {
      case 'md':
      case 'ion':
        return { fontSize: size };
      case 'text':
        return { fontSize: size }; // Ratio might differ in the future
      case 'assets-file':
        return {
          width: size,
          height: size,
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

  getCustomSvg(): string {
    return CUSTOM_ICONS[this.iconId];
  }
}
