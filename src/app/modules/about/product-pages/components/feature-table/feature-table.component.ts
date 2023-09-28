import { Component, Input, OnInit } from '@angular/core';
import {
  FeatTableColumnEntity,
  Enum_Componentcommonactionbutton_Action as StrapiAction,
  Enum_Productplan_Tier as ProductPlanTier,
} from '../../../../../../graphql/generated.strapi';
import { StrapiActionResolverService } from '../../../../../common/services/strapi/strapi-action-resolver.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductPagePricingService } from '../../services/product-page-pricing.service';

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
  @Input() public readonly title: string;
  @Input() public readonly subtitle: string;
  @Input() public readonly columns: FeatTableColumnEntity[];

  public mobileTabs: MobileTab[];

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

  public getMonthlyPrice(tier: ProductPlanTier): Observable<number> {
    return this.pricingService.getMonthlyPrice(tier);
  }

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

  public onMobileTabClick(index: number) {
    this.selectedMobileTabIndex$.next(index);
  }
}
