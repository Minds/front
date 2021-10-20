import {
  Inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';
import { FeaturesService } from '../../services/features.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DOCUMENT, isPlatformServer } from '@angular/common';

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
    private features: FeaturesService,
    @Inject(PLATFORM_ID) private platformId,
    @Inject(DOCUMENT) private dom
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isDarkSubscription = this.isDark$.subscribe(isDark => {
      this.renderTheme();
    });
    this.sessionSubscription = this.session.loggedinEmitter.subscribe(
      isLoggedIn => {
        this.emitThemePreference();
      }
    );
  }

  // TODO after release of MacOS 10.14.4
  // Setup a listener for below to automatically toggle into dark mode for Macs --
  // prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  setUp(): void {
    this.setup = true;
    this.emitThemePreference();
  }

  /**
   * Toggles, saves and emits theme change
   */
  toggleUserThemePreference(): void {
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
    const shouldBeDark: boolean =
      this.session.isLoggedIn() &&
      this.session.getLoggedInUser().theme === 'dark';
    this.isDark$.next(shouldBeDark);
  }

  toggleTheme(): void {
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
