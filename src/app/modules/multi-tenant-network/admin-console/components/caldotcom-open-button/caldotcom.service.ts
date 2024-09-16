import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';

/**
 * Service for loading and interacting with the cal.com SDK.
 */
@Injectable({ providedIn: 'root' })
export class CalDotComService {
  /** Whether the cal.com script has been loaded. */
  private loaded: boolean = false;

  constructor(@Inject(WINDOW) private readonly window: Window) {}

  /**
   * Load the cal.com script.
   * @returns { void }
   */
  public loadScript(): void {
    if (this.loaded) {
      console.info('Did not reload cal.com script - it is already loaded');
      return;
    }

    // Cal.com embed script.
    (function (C, A, L) {
      let p = function (a, ar) {
        a.q.push(ar);
      };
      let d = C.document;
      (C as any).Cal =
        (C as any).Cal ||
        function () {
          let cal = (C as any).Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement('script')).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ['initNamespace', namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    this.loaded = true;
  }

  /**
   * Initialize a calendar.
   * @param { string } namespace - The namespace to initialize the calendar with.
   * @returns { void }
   */
  public initializeCalendar(namespace: string): void {
    (this.window as any).Cal('init', namespace, { origin: 'https://cal.com' });
    (this.window as any).Cal.ns[namespace]('ui', {
      styles: {
        branding: {
          brandColor: '#000000',
        },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
  }
}
