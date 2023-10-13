import { Component, Input, OnInit } from '@angular/core';
import {
  FeatTableColumnEntity,
  Enum_Productplan_Tier as ProductPlanTier,
} from '../../../../../../graphql/generated.strapi';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductPagePricingService } from '../../services/product-page-pricing.service';
import { ProductPageFeatTableMobileTab } from '../../product-pages.types';

@Component({
  selector: 'm-productPage__featureTable',
  templateUrl: 'feature-table.component.html',
  styleUrls: [
    'feature-table.component.ng.scss',
    '../../stylesheets/product.pages.ng.scss',
  ],
})
export class ProductPageFeatureTableComponent implements OnInit {
  /** Title of component. */
  @Input() public readonly title: string;

  /** Subtitle of component. */
  @Input() public readonly subtitle: string;

  /** Columns of the table. */
  @Input() public readonly columns: FeatTableColumnEntity[];

  /** Mobile tabs. */
  public mobileTabs: ProductPageFeatTableMobileTab[];

  /** Index of the selected mobile tab. */
  public readonly selectedMobileTabIndex$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(0);

  constructor(private pricingService: ProductPagePricingService) {}

  ngOnInit(): void {
    this.mobileTabs = this.getMobileTabs();
  }

  /**
   * Get monthly price for a given tier.
   * @param { ProductPlanTier } tier - tier.
   * @returns { Observable<number> } monthly price.
   */
  public getMonthlyPrice(tier: ProductPlanTier): Observable<number> {
    return this.pricingService.getMonthlyPrice(tier);
  }

  /**
   * Gets mobile tabs from columns.
   * @returns { MobileTab[] } mobile tabs array.
   */
  public getMobileTabs(): ProductPageFeatTableMobileTab[] {
    return this.columns.map(
      (
        column: FeatTableColumnEntity,
        index: number
      ): ProductPageFeatTableMobileTab => {
        return {
          title: column.attributes.featTableHeader.title,
          index: index,
        };
      }
    );
  }

  /**
   * Fires on mobile tab click.
   * @param { number } index - index of the tab.
   * @returns { void }
   */
  public onMobileTabClick(index: number): void {
    this.selectedMobileTabIndex$.next(index);
  }
}
