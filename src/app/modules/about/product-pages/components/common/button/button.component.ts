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

  /** Whether an action is in progress. */
  public inProgress: boolean = false;

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
  public async onClick(): Promise<void> {
    this.inProgress = true;
    // if there is a navigationUrl, navigate to it.
    if (Boolean(this.data.navigationUrl)) {
      if (
        this.data.navigationUrl.startsWith('http') ||
        this.data.navigationUrl.startsWith('/api/')
      ) {
        window.open(this.data.navigationUrl, '_blank');
      } else {
        try {
          await this.router.navigateByUrl(this.data.navigationUrl);
        } catch (e: unknown) {
          console.error(e);
        }
      }
      this.inProgress = false;
      return;
    }
    // else, if there is an action, handle it.
    if (!this.data.action) {
      console.error('Button clicked with no navigationUrl or action');
      this.inProgress = false;
      return;
    }

    let extraData: any = {};

    if (
      this.data.action === StrapiAction.OpenPlusUpgradeModal ||
      this.data.action === StrapiAction.OpenProUpgradeModal ||
      this.data.action === StrapiAction.NetworksCommunityCheckout ||
      this.data.action === StrapiAction.NetworksTeamCheckout ||
      this.data.action === StrapiAction.NetworksEnterpriseCheckout
    ) {
      extraData.upgradeInterval =
        this.pricingService.selectedTimePeriod$.getValue() ===
        ProductPageUpgradeTimePeriod.Annually
          ? 'yearly'
          : 'monthly';
    }

    if (this.data.trialUpgradeRequest) {
      extraData.trialUpgradeRequest = true;
    }

    if (this.data.stripeProductKey) {
      extraData.stripeProductKey = this.data.stripeProductKey;
    }

    await this.strapiActionResolver.resolve(this.data.action, extraData);
    this.inProgress = false;
  }

  /**
   * Whether button should be disabled.
   * @returns { boolean } true if button should be disabled.
   */
  get disabled(): boolean {
    if (this.inProgress) {
      return true;
    }
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
