import { Component, Input } from '@angular/core';
import { ComponentCommonActionButton } from '../../../../../../graphql/generated.strapi';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../../../../common/services/strapi/strapi-action-resolver.service';

@Component({
  selector: 'm-productPage__basicExplainer',
  templateUrl: 'basic-explainer.component.html',
  styleUrls: ['basic-explainer.component.ng.scss'],
})
export class ProductPageBasicExplainerComponent {
  @Input() public readonly title: string;
  @Input() public readonly body: string;
  @Input() public readonly button: ComponentCommonActionButton;

  constructor(private strapiActionResolver: StrapiActionResolverService) {}

  public handleButtonClick($event: StrapiAction) {
    this.strapiActionResolver.resolve($event);
  }
}
