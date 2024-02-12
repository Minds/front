import { Component } from '@angular/core';
import { MobileAppPreviewService } from '../../services/mobile-app-preview.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  MobileSplashScreenTypeEnum,
  MobileWelcomeScreenLogoTypeEnum,
} from '../../../../../../../../graphql/generated.engine';

/**
 * Mobile splash screen config section.
 */
@Component({
  selector: 'm-networkAdminConsole__mobileSplashConfig',
  templateUrl: './splash-config.component.html',
  styleUrls: [
    './splash-config.component.ng.scss',
    '../../stylesheets/network-admin-mobile.ng.scss',
  ],
})
export class NetworkAdminConsoleMobileSplashConfigComponent {
  // enums for use in template.
  public readonly MobileSplashScreenTypeEnum: typeof MobileSplashScreenTypeEnum = MobileSplashScreenTypeEnum;
  public readonly MobileWelcomeScreenLogoTypeEnum: typeof MobileWelcomeScreenLogoTypeEnum = MobileWelcomeScreenLogoTypeEnum;

  /** Splash screen type */
  public readonly splashScreenType$: BehaviorSubject<
    MobileSplashScreenTypeEnum
  > = this.MobileAppPreviewService.splashScreenType$;

  /** Welcome screen logo type */
  public readonly welcomeScreenLogoType$: BehaviorSubject<
    MobileWelcomeScreenLogoTypeEnum
  > = this.MobileAppPreviewService.welcomeScreenLogoType$;

  /** Whether setting mobile config is in progress */
  public readonly setMobileConfigInProgress$: Observable<boolean> = this
    .MobileAppPreviewService.setMobileConfigInProgress$;

  constructor(private MobileAppPreviewService: MobileAppPreviewService) {}

  /**
   * Set welcome screen type.
   * @param { MobileWelcomeScreenLogoTypeEnum } value - welcome screen type.
   * @returns { void }
   */
  public setWelcomeScreenType(value: MobileWelcomeScreenLogoTypeEnum): void {
    // guard against infinite-loop.
    if (!value || value === this.welcomeScreenLogoType$.getValue()) {
      return;
    }

    this.MobileAppPreviewService.setMobileConfig({
      mobileWelcomeScreenLogoType: value,
    });
  }

  /**
   * Set splash screen type.
   * @param { MobileSplashScreenTypeEnum } value - splash screen type.
   * @returns { void }
   */
  public setSplashScreenType(value: MobileSplashScreenTypeEnum): void {
    // guard against infinite-loop.
    if (!value || value === this.splashScreenType$.getValue()) {
      return;
    }

    this.MobileAppPreviewService.setMobileConfig({
      mobileSplashScreenType: value,
    });
  }
}
