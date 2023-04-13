import { Injectable, OnDestroy } from '@angular/core';

import { GrowthBook, Experiment } from '@growthbook/growthbook';
import { ConfigsService } from '../../common/services/configs.service';
import { AnalyticsService } from '../../services/analytics';
import { Session } from '../../services/session';
import { CookieService } from '../../common/services/cookie.service';
import { Storage } from '../../services/storage';
import * as snowplow from '@snowplow/browser-tracker';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OverridableAttributes } from './experiments.types';
import {
  ExperimentCacheEntry,
  ExperimentsCacheService,
} from './experiments-cache.service';
export { Experiment } from '@growthbook/growthbook';
import { FeatureResult } from '@growthbook/growthbook';

@Injectable({ providedIn: 'root' })
export class ExperimentsService implements OnDestroy {
  growthbook: GrowthBook;
  routerEventsSubscription: Subscription;
  loggedInSubscription: Subscription;

  constructor(
    private session: Session,
    private configs: ConfigsService,
    private analytics: AnalyticsService,
    private cookieService: CookieService,
    private experimentsCacheService: ExperimentsCacheService,
    private storage: Storage,
    private router: Router
  ) {
    this.routerEventsSubscription = this.router.events.subscribe(
      navigationState => {
        if (navigationState instanceof NavigationEnd) {
          this.syncAttributes({
            route: navigationState.urlAfterRedirects,
          });
        }
      }
    );
    this.session.loggedinEmitter.subscribe(isLoggedIn => {
      this.syncAttributes();
    });
  }

  /**
   * Initialize Growthbook, only want to do this once
   */
  initGrowthbook(): void {
    if (!this.growthbook) {
      const userId = this.getUserId();

      this.growthbook = new GrowthBook({
        user: {
          id: userId,
        },
        trackingCallback: (experiment, result) => {
          this.addToAnalytics(experiment.key, result.variationId);
        },
      });
    }

    this.growthbook.setFeatures(this.configs.get('growthbook')?.features);
    this.experimentsCacheService.pruneRemovedFeatures(
      this.growthbook.getFeatures()
    );
    this.syncAttributes();
  }

  /**
   * Returns the variation to display.
   * @param { string } key - key to check.
   * @throws { string } unable to find experiment error.
   * @returns { string } - variation to display.
   */
  public run(key: string): string {
    // TODO: COOKIES EXP TIME IS SET TO SESSION. Should be same TTL as the pseudo id cookie
    // TODO: Need to hack so that storage doesn't get cleared on account switch.
    // TODO: Figure out how to make run again on login when we HAVE the user.
    const cachedResult: ExperimentCacheEntry = this.experimentsCacheService.getResult(
      key
    );

    // TODO: What if we change an experiment to a feature flag or vice versa - handled by prune?
    if (cachedResult !== undefined) {
      return cachedResult.result.value;
    }

    const result: FeatureResult = this.growthbook.feature(key);

    // only store result in cache for experiments, not features.
    if (result.experimentResult) {
      this.experimentsCacheService.setResult(key, result);
    }

    return result.value;
  }

  /**
   * Adds and event to snowplow
   * @param experimentId
   * @param variationId
   */
  private addToAnalytics(experimentId: string, variationId: number): void {
    // Have we recently pushed this event? (last 24 hours)
    const CACHE_KEY = `experiment:${experimentId}`;
    if (parseInt(this.storage.get(CACHE_KEY)) > Date.now() - 86400000) {
      return; // Do not emit event
    } else {
      this.storage.set(CACHE_KEY, Date.now());
      console.log('MH: submitting growthbook_experiment: ' + CACHE_KEY);
    }

    // TODO: May not be needed
    const cachedResult: ExperimentCacheEntry = this.experimentsCacheService.getResult(
      experimentId
    );
    if (cachedResult) {
      variationId = cachedResult.result.experimentResult.variationId;
    }

    //
    snowplow.trackSelfDescribingEvent({
      event: {
        schema: 'iglu:com.minds/growthbook_experiment/jsonschema/1-0-0',
        data: {
          experiment_id: experimentId,
          variation_id: variationId,
        },
      },
      context: this.analytics.getContexts(),
    });
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
      console.warn(e);
      return false;
    }
  }

  /**
   * Will return the logged in userId or a random value
   * will generate an experiment cookie if one doesn't exist.
   * @returns string
   */
  protected getUserId(): string {
    if (this.session.isLoggedIn()) {
      return this.session.getLoggedInUser()?.guid;
    }

    const cookieName = 'experiments_id';

    let cookieValue = this.cookieService.get(cookieName);

    if (!cookieValue) {
      cookieValue =
        'exp-' +
        Math.random()
          .toString(36)
          .substr(2, 16);
      this.cookieService.put(cookieName, cookieValue);
    }

    return cookieValue;
  }

  /**
   * Get the users age in seconds based on how long ago their account was created.
   * @returns { number } - age in seconds.
   */
  private getUserAge(): number {
    if (this.session.getLoggedInUser()) {
      return Math.floor(
        Date.now() / 1000 - this.session.getLoggedInUser().time_created
      );
    }
  }

  /**
   * Syncs state of growthbook attributes object.
   * @param { OverridableAttributes } attributeOverrides - override attributes to force them to a specific value.
   * @returns { void }
   */
  private syncAttributes(attributeOverrides: OverridableAttributes = {}): void {
    let attributes = {
      ...this.configs.get('growthbook')?.attributes, // config set attributes.
      ...(this.growthbook.getAttributes() ?? {}), // existing attributes.
      loggedIn: this.session.isLoggedIn(),
      route: this.router.url,
      id: this.getUserId(),
      ...attributeOverrides, // overrides.
    };

    delete attributes.userAge;
    const userAge = this.getUserAge();

    if (userAge) {
      attributes['userAge'] = userAge;
    }

    this.growthbook.setAttributes(attributes);
  }

  ngOnDestroy() {
    this.routerEventsSubscription?.unsubscribe();
    this.loggedInSubscription?.unsubscribe();
  }
}
