import { Component, Input } from '@angular/core';
import {
  FeatTableColumnEntity,
  Enum_Componentcommonactionbutton_Action as StrapiAction,
} from '../../../../../../graphql/generated.strapi';
import { StrapiActionResolverService } from '../../../../../common/services/strapi/strapi-action-resolver.service';

@Component({
  selector: 'm-productPage__featureTable',
  templateUrl: 'feature-table.component.html',
  styleUrls: [
    'feature-table.component.ng.scss',
    '../../stylesheets/product.pages.ng.scss',
  ],
})
export class ProductPageFeatureTableComponent {
  @Input() public readonly title: string;
  @Input() public readonly subtitle: string;
  @Input() public readonly columns: FeatTableColumnEntity[];

  constructor(private strapiActionResolver: StrapiActionResolverService) {}

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
}
