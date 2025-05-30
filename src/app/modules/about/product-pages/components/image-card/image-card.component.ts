import { Component, Inject, Input } from '@angular/core';
import { UploadFile } from '../../../../../../graphql/generated.strapi';
import { STRAPI_URL } from '../../../../../common/injection-tokens/url-injection-tokens';

/**
 * Image card component.
 * Just shows an image. It has margins on all sides except bottom.
 */
@Component({
  selector: 'm-productPage__imageCard',
  template: `
    <div class="m-productPageImageCard__container" *ngIf="image">
      <img
        [src]="strapiUrl + image.url"
        class="m-productPageImageCard__image"
        [alt]="image.alternativeText ?? 'Image card'"
      />
    </div>
  `,
  styleUrls: [
    'image-card.component.ng.scss',
    '../../stylesheets/product.pages.ng.scss',
  ],
})
export class ProductPageImageCardComponent {
  constructor(@Inject(STRAPI_URL) public strapiUrl: string) {}

  /** Image from strapi. */
  @Input() public readonly image: UploadFile;
}
