import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Session } from '../../services/session';
import { isPlatformBrowser } from '@angular/common';
import type { PostHog } from 'posthog-js';
import { POSTHOG_JS } from '../../common/services/posthog/posthog-injection-tokens';

type PostHogI = PostHog;

@Injectable({ providedIn: 'root' })
export class ExperimentsService {
  constructor(
    private session: Session,
    @Inject(POSTHOG_JS) private posthog: PostHogI,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Returns the variation to display.
   * @param { string } key - key to check.
   * @throws { string } unable to find experiment error.
   * @returns { string } - variation to display.
   */
  public run(key: string): string | boolean {
    return (
      isPlatformBrowser(this.platformId) && this.posthog.getFeatureFlag(key)
    );
  }

  /**
   * Return whether an experiment has a given variation state.
   * @param { string } experimentId - experiment key.
   * @param { string|number|boolean } variation - variation to check, e.g. 'on' or 'off'. Defaults to true
   * @returns { boolean } - true if params reflect current variation.
   */
  public hasVariation(
    experimentId: string,
    variation: string | boolean = true
  ): boolean {
    try {
      return this.run(experimentId) === variation;
    } catch (e) {
      return false;
    }
  }

  /**
   * Will return the logged in userId or null if there is no user.
   * @returns { string } logged in userId or null if there is no user.
   */
  protected getUserId(): string {
    if (this.session.isLoggedIn()) {
      return this.session.getLoggedInUser()?.guid;
    }
  }
}
