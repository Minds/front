import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StripeKeysService } from '../../services/stripe-keys.service';

/**
 * Component for network admin monetization sub-tabs.
 */
@Component({
  selector: 'm-networkAdminMonetization__tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.ng.scss'],
})
export class NetworkAdminMonetizationTabsComponent {
  /** True when Stripe keys have been set. */
  protected readonly hasSetStripeKeys$: Observable<boolean> =
    this.stripeKeysService.hasSetStripeKeys$;

  constructor(private stripeKeysService: StripeKeysService) {}
}
