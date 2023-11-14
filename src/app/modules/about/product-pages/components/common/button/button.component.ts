import { Component, Input } from '@angular/core';
import {
  ComponentV2ProductActionButton,
  Enum_Componentv2Productfeaturehighlight_Colorscheme as ColorScheme,
  Enum_Componentv2Productactionbutton_Action as StrapiAction,
} from '../../../../../../../graphql/generated.strapi';
import { StrapiActionResolverService } from '../../../../../../common/services/strapi/strapi-action-resolver.service';
import { ProductPageUpgradeTimePeriod } from '../../../product-pages.types';
import { Session } from '../../../../../../services/session';
import { Router } from '@angular/router';
import { ProductPagePricingService } from '../../../services/product-page-pricing.service';

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
  @Input() public readonly data: ComponentV2ProductActionButton;

  /**
   * Color scheme that the button resides in - a light color scheme will provide
   * a dark button for use in a light color scheme parent.
   */
  @Input() public readonly colorScheme: ColorScheme = ColorScheme.Light;

  /** Enum for use in template. */
  public readonly ColorScheme: typeof ColorScheme = ColorScheme;

  constructor(
    private session: Session,
    private router: Router,
    private pricingService: ProductPagePricingService,
    private strapiActionResolver: StrapiActionResolverService
  ) {}

  /**
   * Handles button click events.
   * @returns { void }
   */
  public onClick(): void {
    // if there is a navigationUrl, navigate to it.
    if (Boolean(this.data.navigationUrl)) {
      if (this.data.navigationUrl.startsWith('http')) {
        window.open(this.data.navigationUrl, '_blank');
      } else {
        this.router.navigate([this.data.navigationUrl]);
      }
      return;
    }
    // else, if there is an action, handle it.
    if (!this.data.action) {
      console.error('Button clicked with no navigationUrl or action');
      return;
    }

    let extraData: any = {};

    if (
      this.data.action === StrapiAction.OpenPlusUpgradeModal ||
      this.data.action === StrapiAction.OpenProUpgradeModal
    ) {
      extraData.upgradeInterval =
        this.pricingService.selectedTimePeriod$.getValue() ===
        ProductPageUpgradeTimePeriod.Annually
          ? 'yearly'
          : 'monthly';
    }

    this.strapiActionResolver.resolve(this.data.action, extraData);
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
