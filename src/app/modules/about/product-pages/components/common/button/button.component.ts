import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ComponentDynamicProductPageActionButton,
  Enum_Componentdynamicproductpagefeaturehighlight_Colorscheme as ColorScheme,
} from '../../../../../../../graphql/generated.strapi';
import { StrapiAction } from '../../../../../../common/services/strapi/strapi-action-resolver.service';
import { Session } from '../../../../../../services/session';
import { Router } from '@angular/router';

/**
 * Common product page button component, with various configurable states.
 */
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
  /** Button data */
  @Input() public readonly data: ComponentDynamicProductPageActionButton;

  /**
   * Color scheme that the button resides in - a light color scheme will provide
   * a dark button for use in a light color scheme parent.
   */
  @Input() public readonly colorScheme: ColorScheme = ColorScheme.Light;

  /** Fires on click. Named onAction to avoid conflicts with native click event. */
  @Output() public readonly onAction: EventEmitter<
    StrapiAction
  > = new EventEmitter<StrapiAction>();

  /** Enum for use in template. */
  public readonly ColorScheme: typeof ColorScheme = ColorScheme;

  constructor(private session: Session, private router: Router) {}

  /**
   * On button click.
   * @returns { void }
   */
  public onClick(): void {
    // if there is a navigationUrl, navigate to it.
    if (Boolean(this.data.navigationUrl)) {
      this.router.navigate([this.data.navigationUrl]);
      return;
    }
    // else, if there is an action, emit it.
    if (this.data.action) {
      this.onAction.emit(this.data.action);
      return;
    }
    console.error('Button clicked with no navigationUrl or action');
  }

  /**
   * Whether button should be disabled.
   * @returns { boolean } true if button should be disabled.
   */
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
