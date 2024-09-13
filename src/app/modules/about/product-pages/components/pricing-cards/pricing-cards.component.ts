import { Component, Input } from '@angular/core';
import {
  Enum_Productplan_Tier as ProductPlanTier,
  ProductPlanEntity,
  Enum_Componentv2Productfeaturehighlight_Colorscheme as ColorScheme,
} from '../../../../../../graphql/generated.strapi';
import { ProductPageUpgradeTimePeriod } from '../../product-pages.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductPagePricingService } from '../../services/product-page-pricing.service';

/**
 * Product page pricing cards component. Contains a list of pricing cards.
 */
@Component({
  selector: 'm-productPage__pricingCards',
  templateUrl: 'pricing-cards.component.html',
  styleUrls: ['pricing-cards.component.ng.scss'],
})
export class ProductPagePricingCardsComponent {
  /** Savings amount text (e.g. Save 25% annually). */
  @Input() public savingsText: string;

  /** Product plans data. */
  @Input() public productPlans: ProductPlanEntity[];

  /** Color scheme for component. */
  @Input() public readonly colorScheme: ColorScheme = ColorScheme.Light;

  /** Enum for use in template. */
  public readonly ColorScheme: typeof ColorScheme = ColorScheme;

  /** Enum for use in template. */
  public readonly ProductPageUpgradeTimePeriod: typeof ProductPageUpgradeTimePeriod =
    ProductPageUpgradeTimePeriod;

  /** Selected time period for upgrades. */
  public readonly selectedTimePeriod$: BehaviorSubject<ProductPageUpgradeTimePeriod> =
    this.pricingService.selectedTimePeriod$;

  constructor(private pricingService: ProductPagePricingService) {}

  /**
   * Track by function for ngFor loop.
   * @param { ProductPlanEntity } productPlan - product plan.
   * @returns { string } - unique id for ngFor loop to track by.
   */
  public trackByFn(productPlan: ProductPlanEntity): string {
    return productPlan.attributes.tier + productPlan.id;
  }

  /**
   * Toggle time period.
   * @param { ProductPageUpgradeTimePeriod } timePeriod - time period.
   * @returns { void }
   */
  public toggleTimePeriod(timePeriod: ProductPageUpgradeTimePeriod): void {
    this.selectedTimePeriod$.next(timePeriod);
  }

  /**
   * Gets monthly price for a given tier.
   * @param { ProductPlanTier } tier - the given tier.
   * @returns { Observable<number> } - monthly price.
   */
  public getMonthlyPrice(tier: ProductPlanTier): Observable<number> {
    return this.pricingService.getMonthlyPrice(tier);
  }
}
