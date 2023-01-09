import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BoostConsoleLocationFilter,
  BoostConsolePaymentMethodFilter,
  BoostConsoleStateFilter,
  BoostState,
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
export class BoostConsoleFilterBarComponent implements OnInit {
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

  constructor(public service: BoostConsoleService, private router: Router) {}

  ngOnInit(): void {}

  /**
   * Called on settings button click - navigates to settings page.
   * @param { MouseEvent } $event - click event.
   * @returns { void }
   */
  public onSettingsButtonClick($event: MouseEvent): void {
    this.router.navigate(['/settings/account/boosted-content']);
  }
}
