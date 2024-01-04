import { Component } from '@angular/core';
import {
  AddOn,
  CheckoutPageKeyEnum,
  Plan,
} from '../../../../../../graphql/generated.engine';
import { Observable, combineLatest, distinctUntilChanged, map } from 'rxjs';
import { NetworksCheckoutService } from '../../services/checkout.service';
import { PlanCardPriceTimePeriodEnum } from '../../../../../common/components/plan-card/plan-card.component';
import { Router } from '@angular/router';

/**
 * Core plan builder section of the checkout. Contains the left hand side
 * Where add-ons and plan options are selected / displayed.
 */
@Component({
  selector: 'm-networksCheckout__planBuilder',
  templateUrl: './plan-builder.component.html',
  styleUrls: ['./plan-builder.component.ng.scss'],
})
export class NetworksCheckoutPlanBuilderComponent {
  /** Enum for use in template. */
  public readonly PlanCardPriceTimePeriodEnum: typeof PlanCardPriceTimePeriodEnum = PlanCardPriceTimePeriodEnum;

  /** Enum for use in template. */
  public readonly CheckoutPageKeyEnum: typeof CheckoutPageKeyEnum = CheckoutPageKeyEnum;

  /** AddOn's for display - when NOT on addons page returns only AddOns in basket. */
  public readonly addOnsToDisplay$: Observable<AddOn[]> = combineLatest([
    this.checkoutService.addOns$,
    this.checkoutService.activePage$,
  ]).pipe(
    map(([addOns, activePage]: [AddOn[], CheckoutPageKeyEnum]): AddOn[] => {
      if (activePage === CheckoutPageKeyEnum.Addons) {
        return addOns;
      }
      return addOns.filter((addon: AddOn): boolean => addon.inBasket);
    })
  );

  /** Title of the page. */
  public readonly pageTitle$: Observable<string> = this.checkoutService
    .pageTitle$;

  /** Description of the page. */
  public readonly pageDescription$: Observable<string> = this.checkoutService
    .pageDescription$;

  /** Selected plan. */
  public readonly plan$: Observable<Plan> = this.checkoutService.plan$;

  /** Whether a summary change is in progress (e.g. a calculation). */
  public readonly summaryChangeInProgress$: Observable<
    boolean
  > = this.checkoutService.summaryChangeInProgress$.pipe(
    distinctUntilChanged()
  );

  /** Currently active page. */
  public readonly activePage$: Observable<CheckoutPageKeyEnum> = this
    .checkoutService.activePage$;

  constructor(
    private checkoutService: NetworksCheckoutService,
    private router: Router
  ) {}

  /**
   * Handle click on plan change button. Navigates back to
   * network's about page so that a user can select a new plan.
   * @returns { void }
   */
  public onPlanChangeClick(): void {
    this.router.navigateByUrl('/about/networks');
  }

  /**
   * Toggles an AddOn's by adding or removing it to a users basket.
   * @param { AddOn } addOn - add-on to toggle.
   * @returns { void }
   */
  public toggleAddOn(addOn: AddOn): void {
    if (addOn.inBasket) {
      this.checkoutService.removeAddOn(addOn.id);
      return;
    }
    this.checkoutService.addAddOn(addOn.id);
  }

  /**
   * TrackBy function for add-ons.
   * @param { AddOn } addOn - add-on to track by.
   * @returns { string }
   */
  public trackAddOnsBy(addOn: AddOn): string {
    return addOn.id;
  }
}
