import { Component, Input } from '@angular/core';
import {
  Enum_Productplan_Tier as ProductPlanTier,
  ProductPlanEntity,
  Enum_Componentcommonactionbutton_Action as StrapiAction,
} from '../../../../../../graphql/generated.strapi';
import { ProductPageUpgradeTimePeriod } from '../../product-pages.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { StrapiActionResolverService } from '../../../../../common/services/strapi/strapi-action-resolver.service';
import { ProductPagePricingService } from '../../services/product-page-pricing.service';

@Component({
  selector: 'm-productPage__pricingCards',
  templateUrl: 'pricing-cards.component.html',
  styleUrls: ['pricing-cards.component.ng.scss'],
})
export class ProductPagePricingCardsComponent {
  @Input() public savingsText: string;
  @Input() public productPlans: ProductPlanEntity[];

  public readonly ProductPageUpgradeTimePeriod: typeof ProductPageUpgradeTimePeriod = ProductPageUpgradeTimePeriod;

  public readonly selectedTimePeriod$: BehaviorSubject<
    ProductPageUpgradeTimePeriod
  > = this.pricingService.selectedTimePeriod$;

  constructor(
    private pricingService: ProductPagePricingService,
    private strapiActionResolver: StrapiActionResolverService
  ) {}

  public trackByFn(productPlan: ProductPlanEntity): string {
    return productPlan.attributes.tier + productPlan.id;
  }

  public toggleTimePeriod(timePeriod: ProductPageUpgradeTimePeriod): void {
    this.selectedTimePeriod$.next(timePeriod);
  }

  public getMonthlyPrice(tier: ProductPlanTier): Observable<number> {
    return this.pricingService.getMonthlyPrice(tier);
  }

  public handleButtonClick(action: StrapiAction): void {
    let extraData: any = {};

    if (
      action === StrapiAction.OpenPlusUpgradeModal ||
      action === StrapiAction.OpenProUpgradeModal
    ) {
      extraData.upgradeInterval =
        this.pricingService.selectedTimePeriod$.getValue() ===
        ProductPageUpgradeTimePeriod.Annually
          ? 'yearly'
          : 'monthly';
    }

    this.strapiActionResolver.resolve(action, extraData);
  }
}
