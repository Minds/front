import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { TopbarService } from '../../../../../common/layout/topbar.service';

/**
 * Page component for networks checkout. Wrapper around the base component
 * that sets page layout and minimal light-mode topbar, such that the base
 * component can be used on a full page.
 */
@Component({
  selector: 'm-networksCheckout__checkoutPage',
  styleUrls: ['./checkout-page.component.ng.scss'],
  template: `
    <m-networksCheckout__base></m-networksCheckout__base>
  `,
})
export class NetworksCheckoutPageComponent implements OnInit, OnDestroy {
  /** Force light-mode. */
  @HostBinding('class')
  get classes(): Record<string, boolean> {
    return {
      'm-theme--wrapper': true,
      'm-theme--wrapper__light': true,
    };
  }

  constructor(
    private pageLayoutService: PageLayoutService,
    private topbarService: TopbarService
  ) {}

  ngOnInit(): void {
    this.pageLayoutService.useFullWidth();
    this.topbarService.isMinimalLightMode$.next(true);
  }

  ngOnDestroy(): void {
    this.topbarService.isMinimalLightMode$.next(false);
    this.pageLayoutService.cancelFullWidth();
  }
}
