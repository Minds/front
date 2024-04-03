import { Injectable } from '@angular/core';
import { Session } from '../../services/session';
import posthog from 'posthog-js';

@Injectable({ providedIn: 'root' })
export class ExperimentsService {
  constructor(private session: Session) {}

  /**
   * Returns the variation to display.
   * @param { string } key - key to check.
   * @throws { string } unable to find experiment error.
   * @returns { string } - variation to display.
   */
  public run(key: string): string {
    const result = posthog.getFeatureFlag(key);
    return result?.toString();
  }

  /**
   * Return whether an experiment has a given variation state.
   * @param { string } experimentId - experiment key.
   * @param { string|number|boolean } variation - variation to check, e.g. 'on' or 'off'. Defaults to true
   * @returns { boolean } - true if params reflect current variation.
   */
  public hasVariation(
    experimentId: string,
    variation: string | number | boolean = true
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
