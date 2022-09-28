import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupermindExperimentService } from '../sub-services/supermind-experiment.service';

/**
 * Guard to redirect if experiment is NOT active.
 */
@Injectable({ providedIn: 'root' })
export class SupermindExperimentGuard implements CanActivate {
  constructor(
    private supermindExperiment: SupermindExperimentService,
    private router: Router
  ) {}

  /**
   * Whether route can be activated - will redirect to '/' if not.
   * @returns { boolean } true if route can be activated.
   */
  public canActivate(): boolean {
    if (!this.supermindExperiment.isActive()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
