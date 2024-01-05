import { Component } from '@angular/core';
import {
  CheckoutPageKeyEnum,
  CheckoutTimePeriodEnum,
  Summary,
} from '../../../../../../graphql/generated.engine';
import { Observable } from 'rxjs';
import { NetworksCheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';

/**
 * Summary component for networks checkout.
 */
@Component({
  selector: 'm-networksCheckout__summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.ng.scss'],
})
export class NetworksCheckoutSummaryComponent {
  /** Enum for use in template. */
  public readonly CheckoutPageKeyEnum: typeof CheckoutPageKeyEnum = CheckoutPageKeyEnum;

  /** Enum for use in template. */
  public readonly CheckoutTimePeriodEnum: typeof CheckoutTimePeriodEnum = CheckoutTimePeriodEnum;

  /** Summary data. */
  public readonly summary$: Observable<Summary> = this.checkoutService.summary$;

  /** Selected time period.  */
  public readonly selectedTimePeriod$: Observable<CheckoutTimePeriodEnum> = this
    .checkoutService.selectedTimePeriod$;

  /** Terms markdown. */
  public readonly termsMarkdown$: Observable<string> = this.checkoutService
    .termsMarkdown$;

  /** True if a summary change in progress. */
  public readonly summaryChangeInProgress$: Observable<boolean> = this
    .checkoutService.summaryChangeInProgress$;

  /** True if navigation to a payment URL is in progress. */
  public readonly navToPaymentUrlInProgress$: Observable<boolean> = this
    .checkoutService.navToPaymentUrlInProgress$;

  /** Currently active page. */
  public readonly activePage$: Observable<CheckoutPageKeyEnum> = this
    .checkoutService.activePage$;

  constructor(
    private checkoutService: NetworksCheckoutService,
    private router: Router
  ) {}

  /**
   * Handle click on primary CTA.
   * @param { CheckoutPageKeyEnum } activePage - Currently active page.
   * @returns { void }
   */
  public onPrimaryCtaClick(activePage: CheckoutPageKeyEnum): void {
    if (activePage === CheckoutPageKeyEnum.Addons) {
      this.checkoutService.navigateToPaymentUrl();
      return;
    }
    this.router.navigateByUrl('/networks');
  }
}
