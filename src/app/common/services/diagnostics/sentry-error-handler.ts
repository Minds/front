import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import {
  getIsolationScope,
  addIntegration,
  SentryErrorHandler,
} from '@sentry/angular';
import { REQUEST } from '../../../../express.tokens';
import { SSR_SENTRY_INTEGRATIONS } from '../../injection-tokens/common-injection-tokens';
import type { Integration } from '@sentry/types';
import { isPlatformBrowser } from '@angular/common';
export { DiagnosticsService } from './diagnostics.service';

/**
 * Sentry error handler.
 */
@Injectable({ providedIn: 'root' })
export class MindsSentryErrorHandler extends SentryErrorHandler {
  constructor(
    @Optional()
    @Inject(SSR_SENTRY_INTEGRATIONS)
    private ssrIntegrations: Integration[],
    @Optional() @Inject(REQUEST) private request: Request,
    @Optional() @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super();
    // take SSR integrations from server injection.
    if (this.ssrIntegrations) {
      for (const integration of this.ssrIntegrations) {
        addIntegration(integration);
      }
    }
  }

  /**
   * Handle error.
   * @param { any } error
   * @returns { void }
   */
  handleError(error: any): void {
    // Discard client side for now.
    if (isPlatformBrowser(this.platformId)) return;

    if (this.request) {
      getIsolationScope().setSDKProcessingMetadata({
        request: this.request,
      });
    }

    super.handleError(error);
  }
}
