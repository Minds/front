import { Component, Input } from '@angular/core';

/**
 * Hero component.
 */
@Component({
  selector: 'm-productPage__hero',
  template: `
    <markdown ngPreserveWhitespaces [data]="text"></markdown>
  `,
  styleUrls: [
    'hero.component.ng.scss',
    '../../stylesheets/product.pages.ng.scss',
  ],
})
export class ProductPageHeroComponent {
  /** Markdown text for hero. */
  @Input() public readonly text: string;
}
