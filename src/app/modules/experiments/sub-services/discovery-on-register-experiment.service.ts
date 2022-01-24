import { Injectable } from '@angular/core';
import { FeaturesService } from '../../../services/features.service';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether discovery on register experiment is active, based upon whether
 * the user has been assigned the experimental variant the feature flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class DiscoveryOnRegisterExperimentService {
  constructor(
    private featuresService: FeaturesService,
    private experiments: ExperimentsService
  ) {}

  /**
   * Returns true if the guest mode experiment is active.
   * @returns { boolean } whether guest mode experiment is active.
   */
  public isActive(): boolean {
    return true;
    // ojm uncomment below

    //  return (
    //    this.experiments.hasVariation(
    //      'discovery-redirect',
    //      'on'
    //    )
    //  );
  }

  public redirectUrl(): string {
    if (this.isActive()) {
      return '/discovery/top';
    } else {
      return '/newsfeed/subscriptions/latest';
    }
  }
}
