import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentCommonActionButton } from '../../../../../../../graphql/generated.strapi';
import { StrapiAction } from '../../../../../../common/services/strapi/strapi-action-resolver.service';

@Component({
  selector: 'm-productPage__button',
  template: `
    <button
      class="m-productPage__cardButton"
      [ngClass]="{
        'm-productPage__cardButton--outline': !data.solid
      }"
      (click)="onAction.emit(data.action)"
    >
      <span>{{ data.text }}</span>
    </button>
  `,
  styleUrls: ['../../../stylesheets/product.pages.ng.scss'],
})
export class ProductPageButtonComponent {
  @Input() public data: ComponentCommonActionButton;
  @Output() public onAction: EventEmitter<StrapiAction> = new EventEmitter<
    StrapiAction
  >();
}
