import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupermindGlobalFeedExperimentService } from '../../sub-services/supermind-global-feed-experiment.service';

/**
 * Guard to redirect if experiment is NOT active.
 */
@Injectable({ providedIn: 'root' })
export class SupermindGlobalFeedExperimentGuard implements CanActivate {
  constructor(
    private supermindGlobalFeedExperiment: SupermindGlobalFeedExperimentService,
    private router: Router
  ) {}

  /**
   * Whether route can be activated - will redirect to '/' if not.
   * @returns { boolean } true if route can be activated.
   */
  public canActivate(): boolean {
    if (!this.supermindGlobalFeedExperiment.isActive()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
