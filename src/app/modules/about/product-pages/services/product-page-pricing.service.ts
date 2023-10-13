import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  ProductPageUpgradeTimePeriod,
  ProductPageUpgradesConfig,
} from '../product-pages.types';
import { Enum_Productplan_Tier as ProductPlanTier } from '../../../../../graphql/generated.strapi';
import { ConfigsService } from '../../../../common/services/configs.service';

/**
 * Service for product page pricing.
 */
@Injectable({ providedIn: 'root' })
export class ProductPagePricingService {
  /** User selected time period for their potential subscription. */
  public readonly selectedTimePeriod$: BehaviorSubject<
    ProductPageUpgradeTimePeriod
  > = new BehaviorSubject<ProductPageUpgradeTimePeriod>(
    ProductPageUpgradeTimePeriod.Annually
  );

  /** Upgrades config. */
  public readonly upgradesConfig: ProductPageUpgradesConfig;

  constructor(configs: ConfigsService) {
    this.upgradesConfig = configs.get<ProductPageUpgradesConfig>('upgrades');
  }

  /**
   * Gets monthly price for a given tier.
   * @param { ProductPlanTier } tier - the given tier.
   * @returns { Observable<number> } - monthly price.
   */
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
          case 'networks':
            // TODO: Get from config on release of networks.
            return 48;
        }
      })
    );
  }
}
