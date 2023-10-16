import {
  Inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { MetaService } from './meta.service';
import { ConfigsService } from './configs.service';
import { ThemeColorChangeService } from './theme-color-change.service';
import { MultiTenantColorScheme } from '../../../graphql/generated.engine';
import { ThemeConfig } from '../types/theme-config.types';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';

@Injectable()
export class ThemeService {
  renderer: Renderer2;
  isDark$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isDarkSubscription: Subscription;
  sessionSubscription: Subscription;
  timer;
  setup: boolean = false;
  loaded: boolean = false;

  constructor(
    rendererFactory: RendererFactory2,
    private client: Client,
    private session: Session,
    @Inject(PLATFORM_ID) private platformId,
    @Inject(DOCUMENT) private dom,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork,
    private themeColorChangeService: ThemeColorChangeService,
    private metaService: MetaService,
    private configs: ConfigsService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isDarkSubscription = this.isDark$.subscribe(isDark => {
      this.renderTheme();
    });
    this.sessionSubscription = this.session.loggedinEmitter.subscribe(
      (isLoggedIn: boolean) => {
        this.loaded = false; // prevent theme transition animation.
        this.emitThemePreference();
      }
    );
  }

  setUp(): void {
    this.setup = true;
    this.emitThemePreference();
  }

  /**
   * Toggles, saves and emits theme change
   */
  toggleUserThemePreference(): void {
    if (this.isTenantNetwork) return;
    if (this.isDark$.value) {
      this.client.post('api/v2/settings/theme', {
        theme: 'light',
      });
      this.session.getLoggedInUser().theme = 'light';
    } else {
      this.client.post('api/v2/settings/theme', {
        theme: 'dark',
      });
      this.session.getLoggedInUser().theme = 'dark';
    }

    this.emitThemePreference();
  }

  /**
   * Emits an events that others can listen to
   */
  emitThemePreference(): void {
    const themeConfig: ThemeConfig = this.configs.get<ThemeConfig>(
      'theme_override'
    );

    let shouldBeDark: boolean = false;
    if (themeConfig && this.isTenantNetwork) {
      shouldBeDark = themeConfig?.color_scheme === MultiTenantColorScheme.Dark;
    } else {
      shouldBeDark =
        this.session.isLoggedIn() &&
        this.session.getLoggedInUser().theme === 'dark';
    }
    this.isDark$.next(shouldBeDark);
    this.metaService.setThemeColor(shouldBeDark);

    if (themeConfig) {
      this.themeColorChangeService.changeFromConfig(themeConfig);
    }
  }

  toggleTheme(): void {
    if (this.isTenantNetwork) return;
    this.isDark$.next(!this.isDark$.value);
    this.renderTheme();
  }

  renderTheme(): void {
    // DO NOT add transition classes for when the theme initializes
    if (!this.loaded && this.setup) {
      this.loaded = true;
    } else if (this.setup) {
      this.renderer.addClass(this.dom.body, 'm-theme-in-transition');
    }
    this.renderer.addClass(this.dom.body, 'm-theme__2020');
    if (this.isDark$.value) {
      this.renderer.removeClass(this.dom.body, 'm-theme__light');
      this.renderer.addClass(this.dom.body, 'm-theme__dark');
    } else {
      this.renderer.removeClass(this.dom.body, 'm-theme__dark');
      this.renderer.addClass(this.dom.body, 'm-theme__light');
    }
    this.clearTransitions();
  }

  clearTransitions(): void {
    clearTimeout(this.timer);
    const delay: number = isPlatformServer(this.platformId) ? 0 : 1000;
    this.timer = setTimeout(() => {
      this.renderer.removeClass(this.dom.body, 'm-theme-in-transition');
    }, delay);
  }
}
