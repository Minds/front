import { Component } from '@angular/core';
import {
  BoostConsoleLocationFilter,
  BoostConsolePaymentMethodFilter,
  BoostConsoleStateFilter,
  BoostConsoleSuitabilityFilter,
} from '../../../boost.types';
import { BoostConsoleService } from '../../services/console.service';

/**
 * Filter bar component for Boost console.
 * Contains both tabs and filters
 *
 * Changing a filter/tab value changes the url query params only
 */
@Component({
  selector: 'm-boostConsole__filterBar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.ng.scss'],
})
export class BoostConsoleFilterBarComponent {
  // state filter type values.
  readonly stateFilterTypes: BoostConsoleStateFilter[] = [
    'all',
    'pending',
    'approved',
    'completed',
    'rejected',
  ];

  // location filter type values.
  readonly locationFilterTypes: BoostConsoleLocationFilter[] = [
    'all',
    'newsfeed',
    'sidebar',
  ];

  // payment method type values.
  readonly paymentMethodFilterTypes: BoostConsolePaymentMethodFilter[] = [
    'all',
    'cash',
    'offchain_tokens',
    'onchain_tokens',
  ];

  constructor(public service: BoostConsoleService) {}

  public onStateFilterChange(val: BoostConsoleStateFilter): void {
    this.service.updateQueryParams({ state: val });
  }

  public onLocationFilterChange(val: BoostConsoleLocationFilter): void {
    this.service.updateQueryParams({ location: val });
  }

  public onPaymentMethodFilterChange(
    val: BoostConsolePaymentMethodFilter
  ): void {
    this.service.updateQueryParams({ payment_method: val });
  }

  public onSuitabilityFilterChange(val: BoostConsoleSuitabilityFilter): void {
    this.service.updateQueryParams({ suitability: val });
  }
}
