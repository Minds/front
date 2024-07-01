import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject,
  ViewChild,
  ElementRef,
  OnDestroy,
  ViewRef,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { WalletV2Service, Wallet } from './wallet-v2.service';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import sidebarMenu from './sidebar-menu.default';
import { DataTab } from '../../../interfaces/dashboard';
import { Menu } from '../../../interfaces/menu';
import { TokenPricesService } from './components/currency-value/token-prices.service';

/**
 * Top-level container for all things wallet
 */
@Component({
  selector: 'm-walletDashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('dashboardViews')
  dashboardViewsEl: ElementRef;

  menu: Menu = sidebarMenu;
  paramsSubscription: Subscription;
  wallet: Wallet;
  inProgress: boolean;

  activeCurrencyId: string;
  activeViewId: string;

  views: any = {
    tokens: [
      { id: 'overview', label: 'Overview', display: true },
      { id: 'transactions', label: 'Transactions', display: true },
      { id: 'settings', label: 'Settings', display: true },
    ],
    cash: [
      { id: 'transactions', label: 'Transactions', display: true },
      { id: 'settings', label: 'Settings', display: true },
    ],
    eth: [{ id: 'settings', label: 'Settings', display: true }],
    btc: [{ id: 'settings', label: 'Settings', display: true }],
  };

  tabs: DataTab[] = [];

  constructor(
    protected walletService: WalletV2Service,
    protected session: Session,
    protected router: Router,
    protected route: ActivatedRoute,
    protected tokenPricesService: TokenPricesService,
    protected cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.walletService.loadWallet();

    this.inProgress = true;
    this.detectChanges();

    this.walletService.wallet$.subscribe((wallet: Wallet) => {
      this.wallet = wallet;
      this.updateTabs();
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  updateTabs() {
    this.tabs = [];
    const headerCurrencies: string[] = ['cash', 'tokens', 'eth', 'btc'];
    headerCurrencies.forEach((currency) => {
      const headerTab: DataTab = {
        id: currency,
        label: this.wallet[currency].label,
        unit: this.wallet[currency].unit,
        value: this.wallet[currency].balance,
        isLocalCurrency: false,
        routerLink: `${this.walletService.basePath}/${currency}`,
      };

      // Handle currency formatting for cash
      if (currency === 'cash') {
        if (this.wallet.cash.unit === 'cash') {
          headerTab.unit = 'usd';
        } else {
          headerTab.isLocalCurrency = true;
        }
      }
      this.tabs.push(headerTab);
      this.detectChanges();
    });
  }

  scrollToSettings(currency: string) {
    if (
      this.activeCurrencyId !== currency ||
      this.activeViewId !== 'settings'
    ) {
      this.router.navigate([`/wallet/${currency}/settings`]).then(() => {
        this.scrollToSettingsEl();
      });
    } else {
      this.scrollToSettingsEl();
    }
    this.detectChanges();
  }

  /**
   * Whether to show the token price badge.
   * @returns { boolean } true if token price badge should be shown.
   */
  shouldShowTokenPriceBadge(): boolean {
    return (
      this.router.url.includes('/wallet/tokens') &&
      this.tokenPricesService.minds > 0
    );
  }

  scrollToSettingsEl() {
    if (this.dashboardViewsEl && this.dashboardViewsEl.nativeElement)
      this.dashboardViewsEl.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
  }

  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
