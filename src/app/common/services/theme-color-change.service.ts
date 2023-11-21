import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ConfigsService } from './configs.service';
import { ThemeConfig } from '../types/theme-config.types';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Service that handles the dynamic changing of the sites theme.
 */
@Injectable({ providedIn: 'root' })
export class ThemeColorChangeService {
  constructor(
    @Inject(DOCUMENT) private dom,
    @Inject(PLATFORM_ID) private platformId: Object,
    private configs: ConfigsService
  ) {}

  /**
   * Change site theme based on given theme config object.
   * @param { ThemeConfig } themeConfig - Theme config object.
   * @returns { void }
   */
  public changeFromConfig(themeConfig: ThemeConfig = null): void {
    if (!themeConfig) {
      themeConfig = this.configs.get<ThemeConfig>('theme_override');
    }
    if (themeConfig.primary_color) {
      this.changePrimaryAccent(themeConfig.primary_color);
    }
  }

  /**
   * Change primary accent color.
   * @param { string } color - color to change primary accent color to.
   * @returns { void }
   */
  private changePrimaryAccent(color: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.dom.documentElement.style.setProperty(
        '--primary-action-light',
        color
      );
      this.dom.documentElement.style.setProperty(
        '--primary-action-dark',
        color
      );
    } else {
      const styleString = `--primary-action-light: ${color}; --primary-action-dark: ${color};`;

      let style: HTMLLinkElement;
      style = this.dom.createElement('style');
      style.setAttribute('id', 'dynamicSsrTheme');
      style.innerHTML = styleString;
      this.dom.head.appendChild(style);
    }
  }
}
