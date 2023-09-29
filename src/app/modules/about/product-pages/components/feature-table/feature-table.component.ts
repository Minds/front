import { Component, Input, OnInit } from '@angular/core';
import {
  FeatTableColumnEntity,
  Enum_Componentcommonactionbutton_Action as StrapiAction,
  Enum_Productplan_Tier as ProductPlanTier,
} from '../../../../../../graphql/generated.strapi';
import { StrapiActionResolverService } from '../../../../../common/services/strapi/strapi-action-resolver.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductPagePricingService } from '../../services/product-page-pricing.service';

/** Mobile tab data. */
type MobileTab = {
  title: string;
  index: number;
};

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
  public mobileTabs: MobileTab[];

  /** Index of the selected mobile tab. */
  public readonly selectedMobileTabIndex$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(0);

  constructor(
    private strapiActionResolver: StrapiActionResolverService,
    private pricingService: ProductPagePricingService
  ) {}

  ngOnInit(): void {
    this.mobileTabs = this.getMobileTabs();
  }

  /**
   * Handle button click.
   * @param { StrapiAction } action - button action.
   * @returns { void }
   */
  public handleButtonClick(action: StrapiAction) {
    let extraData: any = {};

    if (
      action === StrapiAction.OpenPlusUpgradeModal ||
      action === StrapiAction.OpenProUpgradeModal
    ) {
      extraData.upgradeInterval = 'yearly';
    }

    this.strapiActionResolver.resolve(action, extraData);
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
  public getMobileTabs(): MobileTab[] {
    return this.columns.map(
      (column: FeatTableColumnEntity, index: number): MobileTab => {
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
