import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for handling logic around the onboarding tags experiment
 *
 * Regardless of isActive, ALL new users will be required to select 3+ hashtags.
 * This flag determines whether or not suggested users/groups modals that
 * are displayed after the tags modal are dismissible
 */
@Injectable({ providedIn: 'root' })
export class OnboardingTagsExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether boost partners experiment is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation(
      'minds-3921-mandatory-onboarding-tags',
      true
    );
  }
}
