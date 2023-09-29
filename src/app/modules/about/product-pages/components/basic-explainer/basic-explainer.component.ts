import { Component, Input } from '@angular/core';
import { ComponentCommonActionButton } from '../../../../../../graphql/generated.strapi';

/**
 * Product page basic explainer component. Contains simple title
 * body and text.
 */
@Component({
  selector: 'm-productPage__basicExplainer',
  templateUrl: 'basic-explainer.component.html',
  styleUrls: ['basic-explainer.component.ng.scss'],
})
export class ProductPageBasicExplainerComponent {
  /** Title of the component. */
  @Input() public readonly title: string;

  /** Text body of the component. */
  @Input() public readonly body: string;

  /** Optional action button for the component. */
  @Input() public readonly button: ComponentCommonActionButton;
}
