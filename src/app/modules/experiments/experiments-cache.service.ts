import { Injectable } from '@angular/core';
import { ObjectLocalStorageService } from '../../common/services/object-local-storage.service';
import { FeatureDefinition, FeatureResult } from '@growthbook/growthbook';

/** Entry in cache */
export type ExperimentCacheEntry = {
  result: FeatureResult<any>;
  updated_timestamp: number;
};

/** Object containing cache entries keyed by experiment ID. */
export type ExperimentCacheObject = {
  [experimentId: string]: ExperimentCacheEntry;
};

/**
 * Local storage cache for experiments. Stores assigned experiment variations in local storage
 * so that we can keep the users variations consistent, between sessions and logged in / out.
 */
@Injectable({ providedIn: 'root' })
export class ExperimentsCacheService {
  /** @type { string } key for local storage */
  private readonly storageKey: string = 'growthbook-experiments';

  constructor(private objectLocalStorageService: ObjectLocalStorageService) {}

  /**
   * Get a feature result from the cache.
   * @param { string } experimentId - experiment id to get feature result for.
   * @returns { ExperimentCacheEntry } cache entry.
   */
  public getResult(experimentId: string): ExperimentCacheEntry {
    this.storageKey;
    const results: ExperimentCacheObject = this.getAll();
    return results[experimentId];
  }

  /**
   * Set a result in storage.
   * @param { string } experimentId - id of an experiment.
   * @param { FeatureResult } result - feature result.
   * @returns { void }
   */
  public setResult(experimentId: string, result: FeatureResult): void {
    this.objectLocalStorageService.setSingle(this.storageKey, {
      [experimentId]: {
        result: result,
        updated_timestamp: Date.now(),
      },
    });
  }

  /**
   * Prunes features that have been removed, or experiments that have been converted into features,
   * such that variations don't wrongly stick and bypass running in Growthbook.
   * @param { Record<string, FeatureDefinition> } features - features from growthbook.
   * @returns { void }
   */
  public pruneRemovedFeatures(
    features: Record<string, FeatureDefinition>
  ): void {
    const cachedFeatures: ExperimentCacheObject = this.getAll();

    for (const cachedKey of Object.keys(cachedFeatures)) {
      // prune if cache key is not an valid feature.
      if (!features[cachedKey]) {
        this.objectLocalStorageService.removeSingle(this.storageKey, cachedKey);
        continue;
      }

      // prune if cache keys matching feature has no rules.
      if (!features[cachedKey].rules || !features[cachedKey].rules.length) {
        this.objectLocalStorageService.removeSingle(this.storageKey, cachedKey);
        continue;
      }

      // prune if cache keys matching feature has 1 or less variations.
      let hasVariations = false;
      for (const rule of features[cachedKey].rules) {
        if (rule.variations && rule.variations.length > 1) {
          hasVariations = true;
          break;
        }
      }

      if (!hasVariations) {
        this.objectLocalStorageService.removeSingle(this.storageKey, cachedKey);
        continue;
      }
    }
  }

  /**
   * Get all cached results
   * @returns { ExperimentCacheObject } - experiments cache object.
   */
  private getAll(): ExperimentCacheObject {
    return this.objectLocalStorageService.getAll(this.storageKey);
  }
}
