import { Component, Input } from '@angular/core';
import { ComponentCommonActionButton } from '../../../../../../graphql/generated.strapi';

/**
 * Hero component.
 */
@Component({
  selector: 'm-productPage__hero',
  template: `
    <markdown ngPreserveWhitespaces [data]="text"></markdown>
    <div class="m-productPageHero__buttonsContainer" *ngIf="buttons.length">
      <m-productPage__button
        *ngFor="let button of buttons"
        [data]="button"
      ></m-productPage__button>
    </div>
  `,
  styleUrls: [
    'hero.component.ng.scss',
    '../../stylesheets/product.pages.ng.scss',
  ],
})
export class ProductPageHeroComponent {
  /** Markdown text for hero. */
  @Input() public readonly text: string;

  /** Hero action button(s) */
  @Input() public readonly buttons: ComponentCommonActionButton[];
}
