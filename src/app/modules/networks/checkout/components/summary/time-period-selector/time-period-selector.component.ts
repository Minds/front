import { Component, Input } from '@angular/core';
import { NetworksCheckoutService } from '../../../services/checkout.service';
import { Observable, map } from 'rxjs';
import { CheckoutTimePeriodEnum } from '../../../../../../../graphql/generated.engine';

/**
 * Component for selecting the time period for the checkout summary.
 */
@Component({
  selector: 'm-networksCheckout__timePeriodSelector',
  templateUrl: './time-period-selector.component.html',
  styleUrls: ['./time-period-selector.component.ng.scss'],
})
export class NetworksCheckoutSummaryTimePeriodSelectorComponent {
  /** Enum for use in template. */
  public readonly CheckoutTimePeriodEnum: typeof CheckoutTimePeriodEnum =
    CheckoutTimePeriodEnum;

  /** Currently selected time period. */
  public readonly selectedTimePeriod$: Observable<CheckoutTimePeriodEnum> =
    this.checkoutService.selectedTimePeriod$;

  /** Total annual savings in cents. */
  public readonly totalAnnualSavingsCents$: Observable<number> =
    this.checkoutService.totalAnnualSavingsCents$;

  /** Whether to only show the currently selected time period - disables selection. */
  @Input() public readonly onlyShowSelectedTimePeriod: boolean = false;

  constructor(private checkoutService: NetworksCheckoutService) {}

  /**
   * Handle click on time period. Selects the time period.
   * @returns { void }
   */
  public onTimePeriodClick(timePeriod: CheckoutTimePeriodEnum): void {
    if (this.onlyShowSelectedTimePeriod) return;
    this.checkoutService.selectTimePeriod(timePeriod);
  }

  /**
   * Whether to show the time period.
   * @param { CheckoutTimePeriodEnum } timePeriod - Time period to check.
   * @returns { Observable<boolean> } - Whether to show the time period.
   */
  public shouldShow$(timePeriod: CheckoutTimePeriodEnum): Observable<boolean> {
    return this.selectedTimePeriod$.pipe(
      map((selectedTimePeriod: CheckoutTimePeriodEnum): boolean => {
        return this.onlyShowSelectedTimePeriod
          ? timePeriod === selectedTimePeriod
          : true;
      })
    );
  }
}
