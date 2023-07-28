import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ExperimentsService } from '../experiments.service';
import { ToasterService } from '../../../common/services/toaster.service';

/**
 * Guard to disallow router navigation to claim Gift Cards
 * when the feature is off.
 */
@Injectable({ providedIn: 'root' })
export class GiftCardClaimExperimentGuard implements CanActivate {
  constructor(
    private experiments: ExperimentsService,
    private router: Router,
    private toast: ToasterService
  ) {}

  /**
   * Whether route can be activated - will redirect to '/' if not.
   * @returns { boolean } true if route can be activated.
   */
  public canActivate(): boolean {
    if (!this.experiments.hasVariation('minds-4126-gift-card-claim', true)) {
      this.toast.warn(
        'Claiming gift cards is not currently enabled, please try again later.'
      );
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
