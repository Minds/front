import { Injectable } from '@angular/core';

import { GrowthBook, Experiment } from '@growthbook/growthbook';
import { ConfigsService } from '../../common/services/configs.service';
import { AnalyticsService } from '../../services/analytics';
import { Session } from '../../services/session';
import { CookieService } from '../../common/services/cookie.service';

export { Experiment } from '@growthbook/growthbook';

@Injectable({ providedIn: 'root' })
export class ExperimentsService {
  growthbook: GrowthBook;
  experiments: Experiment<unknown>[] = [];

  constructor(
    private session: Session,
    private configs: ConfigsService,
    private analytics: AnalyticsService,
    private cookieService: CookieService
  ) {}

  /**
   * Initialize Growthbook, only want to do this once
   */
  initGrowthbook(): void {
    console.log('ojm initGrowthbook');
    if (!this.growthbook) {
      // ID field required by SDK even though we are forcing.
      const userId = this.getUserId();

      this.growthbook = new GrowthBook({
        user: { id: userId },
        trackingCallback: (experiment, result) => {
          /**
           * Tracking is only called if force is not used.
           */
          this.addToAnalytics(experiment.key, result.variationId);
          // Note: we don't need to tell the backend, as it's the backend that tells us to run experiments
        },
      });
    }

    const experiments = this.configs.get('experiments');

    console.log('ojm experiments', experiments);

    if (experiments && experiments.length > 0) {
      for (let experiment of experiments) {
        const originExperiment = Object.assign(experiment);

        // Remap
        experiment = {
          key: experiment.experimentId,
          variations: experiment.variations,
        };

        // If logged in, we force the experiment
        if (this.session.isLoggedIn()) {
          experiment.force = originExperiment.variationId;
        }

        this.experiments.push(experiment);
        this.growthbook.run(experiment);

        if (experiment.force != undefined) {
          this.addToAnalytics(experiment.key, experiment.force);
        }
      }
    }
  }

  /**
   * Returns the variation to display.
   * @param { string } key - key to check.
   * @throws { string } unable to find experiment error.
   * @returns { string } - variation to display.
   */
  public run(key: string): string {
    for (let experiment of this.experiments) {
      if (experiment.key === key) {
        const { value } = this.growthbook.run(experiment);
        return String(value);
      }
    }

    throw 'Could not find experiment with key ' + key;
  }

  private addToAnalytics(experimentId: string, variationId: number): void {
    this.analytics.contexts.push({
      schema: 'iglu:com.minds/growthbook_context/jsonschema/1-0-1',
      data: {
        experiment_id: experimentId,
        variation_id: variationId,
      },
    });
  }

  /**
   * Return whether an experiment has a given variation state.
   * @param { string } experimentId - experiment key.
   * @param { string } variation - variation to check, e.g. 'on' or 'off'.
   * @returns { boolean } - true if params reflect current variation.
   */
  public hasVariation(experimentId: string, variation: string = 'on'): boolean {
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
}
