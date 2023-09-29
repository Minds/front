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

/**
 * Product page closing CTA component. Designed to be placed
 * at the end of product pages as a final summary, but can sit anywhere.
 */
@Component({
  selector: 'm-productPage__closingCta',
  templateUrl: 'closing-cta.component.html',
  styleUrls: ['closing-cta.component.ng.scss'],
})
export class ProductPageClosingCtaComponent {
  /** Title of the component. */
  @Input() public readonly title: string;

  /** Text body of the component. */
  @Input() public readonly body: string;

  /** Optional CTA button for the component.  */
  @Input() public readonly button: ComponentCommonActionButton;

  /** Image to be shown in the center of the top border. */
  @Input() public readonly borderImage: UploadFile;

  constructor(
    private strapiActionResolver: StrapiActionResolverService,
    @Inject(CDN_ASSETS_URL) public readonly cdnAssetsUrl: string,
    @Inject(STRAPI_URL) public readonly strapiUrl: string
  ) {}

  /**
   * Handles button click event.
   * @param { StrapiAction } $event - action.
   * @returns { void }
   */
  public handleButtonClick($event: StrapiAction): void {
    this.strapiActionResolver.resolve($event);
  }
}
