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

export { Experiment } from '@growthbook/growthbook';

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
    private storage: Storage,
    private router: Router
  ) {
    this.routerEventsSubscription = this.router.events.subscribe(
      navigationState => {
        if (navigationState instanceof NavigationEnd) {
          this.growthbook?.setAttributes({
            ...this.growthbook.getAttributes(),
            route: navigationState.urlAfterRedirects,
          });
        }
      }
    );
    this.session.loggedinEmitter.subscribe(isLoggedIn => {
      this.growthbook?.setAttributes({
        ...this.growthbook.getAttributes(),
        loggedIn: isLoggedIn,
      });
    });
  }

  /**
   * Initialize Growthbook, only want to do this once
   */
  initGrowthbook(): void {
    if (!this.growthbook) {
      // ID field required by SDK even though we are forcing.
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

    this.growthbook.setAttributes(this.getAttributes());
  }

  /**
   * Returns the variation to display.
   * @param { string } key - key to check.
   * @throws { string } unable to find experiment error.
   * @returns { string } - variation to display.
   */
  public run(key: string): string {
    const result = this.growthbook.feature(key);

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
   * @param { string|number|boolean } variation - variation to check, e.g. 'on' or 'off'.
   * @returns { boolean } - true if params reflect current variation.
   */
  public hasVariation(
    experimentId: string,
    variation: string | number | boolean = 'on'
  ): boolean {
    try {
      return this.run(experimentId) === variation;
    } catch (e) {
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
   * Constructs growthbook attributes object.
   * @returns { Object } - Growthbook attributes object.
   */
  private getAttributes(): Object {
    let attributes = {
      ...this.configs.get('growthbook')?.attributes,
      ...this.growthbook.getAttributes(),
      id: this.getUserId(),
    };

    const userAge = this.getUserAge();

    if (userAge) {
      attributes['userAge'] = userAge;
    }

    console.log('attributes', attributes);
    return attributes;
  }

  ngOnDestroy() {
    this.routerEventsSubscription?.unsubscribe();
    this.loggedInSubscription?.unsubscribe();
  }
}
