import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NetworksCheckoutService } from '../../../services/checkout.service';
import { CheckoutPageKeyEnum } from '../../../../../../../graphql/generated.engine';

/**
 * Stepper component for top of checkout summary.
 * Highlights the step a user is currently on.
 */
@Component({
  selector: 'm-networksCheckout__summaryStepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.ng.scss'],
})
export class NetworksCheckoutSummaryStepperComponent {
  /** Enum for use in template. */
  public readonly CheckoutPageKeyEnum: typeof CheckoutPageKeyEnum =
    CheckoutPageKeyEnum;

  /** Currently active page / step. */
  public activePage$: Observable<CheckoutPageKeyEnum> =
    this.checkoutService.activePage$;

  constructor(private checkoutService: NetworksCheckoutService) {}
}
