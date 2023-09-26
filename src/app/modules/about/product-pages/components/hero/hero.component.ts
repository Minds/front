import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-productPage__hero',
  template: `
    <markdown ngPreserveWhitespaces [data]="text"></markdown>
  `,
  styleUrls: ['hero.component.ng.scss'],
})
export class ProductPageHeroComponent {
  @Input() public readonly text: string;
}
