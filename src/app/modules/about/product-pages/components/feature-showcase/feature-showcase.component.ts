import { Component, Inject, Input } from '@angular/core';
import { ComponentDynamicProductPageFeatureShowcaseItem } from '../../../../../../graphql/generated.strapi';
import { STRAPI_URL } from '../../../../../common/injection-tokens/url-injection-tokens';

/**
 * Product page feature showcase component. Shows information on multiple
 * features in feature cards.
 */
@Component({
  selector: 'm-productPage__featureShowcase',
  templateUrl: 'feature-showcase.component.html',
  styleUrls: ['feature-showcase.component.ng.scss'],
})
export class ProductPageFeatureShowcaseComponent {
  /** Input containing data for feature showcase. */
  @Input()
  public readonly featureShowcase: ComponentDynamicProductPageFeatureShowcaseItem[];

  constructor(@Inject(STRAPI_URL) public strapiUrl: string) {}
}
