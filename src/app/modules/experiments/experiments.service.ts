import { Injectable } from '@angular/core';

import { GrowthBook, Experiment } from '@growthbook/growthbook';
import { ConfigsService } from '../../common/services/configs.service';
import { AnalyticsService } from '../../services/analytics';
import { Session } from '../../services/session';

export { Experiment } from '@growthbook/growthbook';

@Injectable({ providedIn: 'root' })
export class ExperimentsService {
  growthbook: GrowthBook;
  experiments: Experiment<unknown>[] = [];

  constructor(
    private session: Session,
    private configs: ConfigsService,
    private analytics: AnalyticsService
  ) {}

  /**
   * Initialize Growthbook, only want to do this once
   */
  initGrowthbook(): void {
    if (!this.growthbook) {
      this.growthbook = new GrowthBook({
        user: { id: this.session.getLoggedInUser()?.guid },
        trackingCallback: (experiment, result) => {
          /**
           * Tracking is only called if force is not used
           */
          this.addToAnalytics(experiment.key, result.variationId);
          // Note: we don't need to tell the backend, as it's the backend that tells us to run experiments
        },
      });
    }

    const experiments = this.configs.get('experiments');

    if (experiments && experiments.length > 0) {
      for (let experiment of experiments) {
        // Remap
        experiment = {
          key: experiment.experimentId,
          variations: experiment.variations,
          force: experiment.variationId,
        };

        this.experiments.push(experiment);
        this.growthbook.run(experiment);

        this.addToAnalytics(experiment.key, experiment.force);
      }
    }
  }

  /**
   * Returns the variation to display
   * @param key
   * @returns string
   */
  run(key): string {
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
}
