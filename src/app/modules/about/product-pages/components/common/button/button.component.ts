import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ComponentDynamicProductPageActionButton,
  Enum_Componentdynamicproductpagefeaturehighlight_Colorscheme as ColorScheme,
} from '../../../../../../../graphql/generated.strapi';
import { StrapiAction } from '../../../../../../common/services/strapi/strapi-action-resolver.service';
import { Session } from '../../../../../../services/session';
import { Router } from '@angular/router';

@Component({
  selector: 'm-productPage__button',
  template: `
    <button
      class="m-productPageButton"
      [ngClass]="{
        'm-productPageButton--outline': !data.solid,
        'm-productPageButton--rounded': data.rounded,
        'm-productPageButton--lightScheme': colorScheme === ColorScheme.Light,
        'm-productPageButton--darkScheme': colorScheme === ColorScheme.Dark
      }"
      [disabled]="disabled"
      [attr.data-ref]="data.dataRef"
      (click)="onClick()"
    >
      {{ data.text }}
    </button>
  `,
  styleUrls: ['./button.component.ng.scss'],
})
export class ProductPageButtonComponent {
  @Input() public readonly data: ComponentDynamicProductPageActionButton;
  @Input() public readonly colorScheme: ColorScheme = ColorScheme.Light;

  @Output() public readonly onAction: EventEmitter<
    StrapiAction
  > = new EventEmitter<StrapiAction>();

  public readonly ColorScheme: typeof ColorScheme = ColorScheme;

  constructor(private session: Session, private router: Router) {}

  public onClick(): void {
    if (Boolean(this.data.navigationUrl)) {
      this.router.navigate([this.data.navigationUrl]);
      return;
    }
    if (this.data.action) {
      this.onAction.emit(this.data.action);
      return;
    }
    console.error('Button clicked with no navigationUrl or action');
  }

  // TODO: Test hard
  get disabled(): boolean {
    switch (this.data.action) {
      case 'open_plus_upgrade_modal':
        return this.session.getLoggedInUser()?.plus;
      case 'open_pro_upgrade_modal':
        return this.session.getLoggedInUser()?.pro;
      case 'open_register_modal':
        return this.session.isLoggedIn();
    }
    return false;
  }
}
