import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ConfigsService } from '../../../common/services/configs.service';
import { ThemeService } from '../../../common/services/theme.service';

/**
 * A bar containing media coverage on various blockchain platforms.
 */
@Component({
  selector: 'm-marketing__asFeaturedInBlockchain',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'as-featured-in-blockchain.component.html',
  styleUrls: ['./as-featured-in-blockchain.component.ng.scss'],
})
export class MarketingAsFeaturedInBlockchainComponent extends AbstractSubscriberComponent {
  @Input() inThePress: boolean = false;

  readonly cdnAssetsUrl: string;

  constructor(
    private themeService: ThemeService,
    private cd: ChangeDetectorRef,
    configs: ConfigsService
  ) {
    super();
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.subscriptions.push(
      // Force change detection on theme switch to trigger reloads after image src change.
      this.isDarkMode$.subscribe((isDarkMode) => this.detectChanges())
    );
  }

  /**
   * Whether theme is currently set to dark mode.
   * @returns { Observable<boolean} holds true if theme is dark mode.
   */
  get isDarkMode$(): BehaviorSubject<boolean> {
    return this.themeService.isDark$;
  }

  /**
   * src for CoinDesk image based on current theme.
   * @returns { string } - src for CoinDesk image
   */
  get coinDeskLogoSrc() {
    return this.isDarkMode$.getValue()
      ? `${this.cdnAssetsUrl}assets/marketing/coindesk-wide-light.png`
      : `${this.cdnAssetsUrl}assets/marketing/coindesk-wide-dark.png`;
  }

  /**
   * src for CoinTelegraph image based on current theme.
   * @returns { string } - src for CoinTelegraph image
   */
  get coinTelegraphLogoSrc() {
    return this.isDarkMode$.getValue()
      ? `${this.cdnAssetsUrl}assets/marketing/coin-telegraph-light.png`
      : `${this.cdnAssetsUrl}assets/marketing/coin-telegraph-dark.png`;
  }

  /**
   * src for Decrypt image based on current theme.
   * @returns { string } - src for Decrypt image
   */
  get decryptLogoSrc() {
    return this.isDarkMode$.getValue()
      ? `${this.cdnAssetsUrl}assets/marketing/decrypt-light.png`
      : `${this.cdnAssetsUrl}assets/marketing/decrypt-dark.png`;
  }

  /**
   * src for Bitcoin.com image based on current theme.
   * @returns { string } - src for Bitcoin.com image
   */
  get bitcoinDotComLogoSrc(): string {
    return this.isDarkMode$.getValue()
      ? `${this.cdnAssetsUrl}assets/marketing/bitcoin-com-dark.png`
      : `${this.cdnAssetsUrl}assets/marketing/bitcoin-com-light.png`;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
