import {
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { TopbarService } from '../../../../../common/layout/topbar.service';
import { isPlatformBrowser } from '@angular/common';

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
    private topbarService: TopbarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.pageLayoutService.useFullWidth();
    this.topbarService.isMinimalLightMode$.next(true);

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    this.topbarService.isMinimalLightMode$.next(false);
    this.pageLayoutService.cancelFullWidth();
  }
}
