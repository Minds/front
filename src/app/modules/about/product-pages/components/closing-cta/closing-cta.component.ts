import { Component, Inject, Input } from '@angular/core';
import {
  ComponentCommonActionButton,
  UploadFile,
} from '../../../../../../graphql/generated.strapi';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../../../../common/services/strapi/strapi-action-resolver.service';
import {
  CDN_ASSETS_URL,
  STRAPI_URL,
} from '../../../../../common/injection-tokens/url-injection-tokens';

@Component({
  selector: 'm-productPage__closingCta',
  templateUrl: 'closing-cta.component.html',
  styleUrls: ['closing-cta.component.ng.scss'],
})
export class ProductPageClosingCtaComponent {
  @Input() public readonly title: string;
  @Input() public readonly body: string;
  @Input() public readonly button: ComponentCommonActionButton;
  @Input() public readonly borderImage: UploadFile;

  constructor(
    private strapiActionResolver: StrapiActionResolverService,
    @Inject(CDN_ASSETS_URL) public readonly cdnAssetsUrl: string,
    @Inject(STRAPI_URL) public readonly strapiUrl: string
  ) {}

  public handleButtonClick($event: StrapiAction) {
    this.strapiActionResolver.resolve($event);
  }
}
