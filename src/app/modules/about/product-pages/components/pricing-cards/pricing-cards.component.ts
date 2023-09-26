import { Component, Input } from '@angular/core';
import {
  Enum_Componentdynamicproductpageproductplan_Tier as ProductPlanTier,
  ProductPlanEntity,
  Enum_Componentcommonactionbutton_Action as StrapiAction,
} from '../../../../../../graphql/generated.strapi';
import {
  ProductPageUpgradeTimePeriod,
  ProductPageUpgradesConfig,
} from '../../product-pages.types';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { StrapiActionResolverService } from '../../../../../common/services/strapi/strapi-action-resolver.service';

@Component({
  selector: 'm-productPage__pricingCards',
  templateUrl: 'pricing-cards.component.html',
  styleUrls: [
    'pricing-cards.component.ng.scss',
    '../../stylesheets/product.pages.ng.scss',
  ],
})
export class ProductPagePricingCardsComponent {
  @Input() public savingsText: string;
  @Input() public productPlans: ProductPlanEntity[];

  public readonly ProductPageUpgradeTimePeriod: typeof ProductPageUpgradeTimePeriod = ProductPageUpgradeTimePeriod;

  public readonly selectedTimePeriod$: BehaviorSubject<
    ProductPageUpgradeTimePeriod
  > = new BehaviorSubject<ProductPageUpgradeTimePeriod>(
    ProductPageUpgradeTimePeriod.Annually
  );

  private readonly upgradesConfig: ProductPageUpgradesConfig;

  constructor(
    private strapiActionResolver: StrapiActionResolverService,
    configs: ConfigsService
  ) {
    this.upgradesConfig = configs.get<ProductPageUpgradesConfig>('upgrades');
  }

  public toggleTimePeriod(timePeriod: ProductPageUpgradeTimePeriod): void {
    this.selectedTimePeriod$.next(timePeriod);
  }

  public trackByFn(productPlan: ProductPlanEntity): string {
    return productPlan.attributes.tier + productPlan.id;
  }

  public getMonthlyPrice(tier: ProductPlanTier): Observable<number> {
    return this.selectedTimePeriod$.pipe(
      map((timePeriod: ProductPageUpgradeTimePeriod): number => {
        switch (tier) {
          case 'free':
            return 0;
          case 'plus':
            if (timePeriod === ProductPageUpgradeTimePeriod.Annually) {
              return this.upgradesConfig.plus.yearly.usd / 12;
            }
            return this.upgradesConfig.plus.monthly.usd;
          case 'pro':
            if (timePeriod === ProductPageUpgradeTimePeriod.Annually) {
              return this.upgradesConfig.pro.yearly.usd / 12;
            }
            return this.upgradesConfig.pro.monthly.usd;
          case 'servers':
            // TODO: Get from config on release of servers.
            return 48;
        }
      })
    );
  }

  public handleButtonClick(action: StrapiAction): void {
    let extraData: any = {};

    if (
      action === StrapiAction.OpenPlusUpgradeModal ||
      action === StrapiAction.OpenProUpgradeModal
    ) {
      extraData.upgradeInterval =
        this.selectedTimePeriod$.getValue() ===
        ProductPageUpgradeTimePeriod.Annually
          ? 'yearly'
          : 'monthly';
    }

    this.strapiActionResolver.resolve(action, extraData);
  }
}
