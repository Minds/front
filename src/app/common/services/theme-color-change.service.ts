import { Injectable } from '@angular/core';
import { ConfigsService } from './configs.service';
import { ThemeConfig } from '../types/theme-config.types';

/**
 * Service that handles the dynamic changing of the sites theme.
 */
@Injectable({ providedIn: 'root' })
export class ThemeColorChangeService {
  constructor(private configs: ConfigsService) {}

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
    document.documentElement.style.setProperty('--primary-action-light', color);
    document.documentElement.style.setProperty('--primary-action-dark', color);
  }
}
