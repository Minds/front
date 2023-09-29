import { Component, Input } from '@angular/core';
import { ComponentCommonActionButton } from '../../../../../../graphql/generated.strapi';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../../../../common/services/strapi/strapi-action-resolver.service';

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

  constructor(private strapiActionResolver: StrapiActionResolverService) {}

  /**
   * Handles button click event.
   * @param { StrapiAction } $event - action.
   * @returns { void }
   */
  public handleButtonClick($event: StrapiAction): void {
    this.strapiActionResolver.resolve($event);
  }
}
