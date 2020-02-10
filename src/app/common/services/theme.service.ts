import {
  Inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';
import { Storage } from '../../services/storage';
import { BehaviorSubject, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class ThemeService {
  renderer: Renderer2;
  isDark: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isDark$ = this.isDark.asObservable();
  allowSetStorage: boolean = true;
  timer;

  constructor(
    private rendererFactory: RendererFactory2,
    private client: Client,
    private session: Session,
    private storage: Storage,
    private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  static _(
    rendererFactory: RendererFactory2,
    client: Client,
    session: Session,
    storage: Storage,
    platformId: Object
  ) {
    return new ThemeService(
      rendererFactory,
      client,
      session,
      storage,
      platformId
    );
  }

  // TODO after release of MacOS 10.14.4
  // Setup a listener for below to automatically toggle into dark mode for Macs --
  // prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  setUp() {
    window.addEventListener('storage', event => {
      if (event.key === 'dark_theme' && this.session.isLoggedIn()) {
        if (
          (event.newValue === 'true' && this.isDark.value === false) ||
          (event.newValue === 'false' && this.isDark.value === true)
        ) {
          this.toggleTheme();
        }
      }
    });

    this.applyThemePreference();
  }

  applyThemePreference() {
    // apply theme on page load (via app.component)
    // and/or after login/logout (via user-menu.component)

    // pages where user !isLoggedIn are always light theme,
    // so they are prevented from triggering storage events on other tabs
    this.allowSetStorage = this.session.isLoggedIn();

    if (this.session.getLoggedInUser().theme === 'dark') this.isDark.next(true);
    else this.isDark.next(false);
    this.renderTheme();
  }

  toggleUserThemePreference() {
    if (this.isDark.value) {
      this.client.post('api/v2/settings/theme', {
        theme: 'light',
      });
    } else {
      this.client.post('api/v2/settings/theme', {
        theme: 'dark',
      });
    }

    this.toggleTheme();
  }

  toggleTheme() {
    this.isDark.next(!this.isDark.value);
    this.renderTheme();
  }

  renderTheme() {
    if (this.allowSetStorage) this.storage.set('dark_theme', this.isDark.value);

    this.renderer.addClass(document.body, 'm-theme-in-transition');
    if (this.isDark.value) {
      this.renderer.removeClass(document.body, 'm-theme__light');
      this.renderer.addClass(document.body, 'm-theme__dark');
    } else {
      this.renderer.removeClass(document.body, 'm-theme__dark');
      this.renderer.addClass(document.body, 'm-theme__light');
    }
    this.clearTransitions();
  }

  clearTransitions() {
    if (isPlatformBrowser(this.platformId)) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.renderer.removeClass(document.body, 'm-theme-in-transition');
      }, 1000);
    }
  }
}
