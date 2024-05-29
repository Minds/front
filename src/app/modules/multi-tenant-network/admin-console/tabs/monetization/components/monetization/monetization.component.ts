import { Component } from '@angular/core';
import { StripeKeysService } from '../../services/stripe-keys.service';
import { Observable } from 'rxjs';

/**
 * Monetization tab base component.
 */
@Component({
  selector: 'm-networkAdminConsole__monetization',
  templateUrl: './monetization.component.html',
  styleUrls: ['./monetization.component.ng.scss'],
})
export class NetworkAdminMonetizationComponent {
  /** True when Stripe keys have been set. */
  protected readonly hasSetStripeKeys$: Observable<boolean> =
    this.stripeKeysService.hasSetStripeKeys$;

  constructor(private stripeKeysService: StripeKeysService) {}
}
