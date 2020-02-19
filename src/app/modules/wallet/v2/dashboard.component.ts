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
import { isPlatformBrowser } from '@angular/common';

import { Subscription } from 'rxjs';
import { WalletDashboardService, Wallet } from './dashboard.service';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import sidebarMenu from './sidebar-menu.default';
import { Menu } from '../../../common/components/sidebar-menu/sidebar-menu.component';
import { ShadowboxHeaderTab } from '../../../interfaces/dashboard';

@Component({
  selector: 'm-walletDashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('dashboardViews', { static: false })
  dashboardViewsEl: ElementRef;

  menu: Menu = sidebarMenu;
  paramsSubscription: Subscription;
  wallet: Wallet;
  inProgress: boolean;

  activeCurrencyId: string;
  activeViewId: string;
  tokenOnboardingComplete: boolean = false;
  hasOnchainAddress: boolean = false;
  phoneVerified: boolean = false;

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

  currencies: ShadowboxHeaderTab[] = [];

  constructor(
    protected walletService: WalletDashboardService,
    protected session: Session,
    protected router: Router,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.inProgress = true;
    this.detectChanges();

    this.phoneVerified = this.session.getLoggedInUser().rewards;
    this.hasOnchainAddress = this.session.getLoggedInUser().eth_wallet;
    if (this.phoneVerified && this.hasOnchainAddress) {
      this.tokenOnboardingComplete = true;
    }

    this.paramsSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const currencyParam = params.get('currency');
        const viewParam = params.get('view');

        this.activeCurrencyId = currencyParam;
        if (!this.views[this.activeCurrencyId]) {
          this.activeCurrencyId = 'tokens';
          this.router.navigate(['/wallet/tokens']);
        }

        if (
          viewParam &&
          this.views[this.activeCurrencyId].find(v => v.id === viewParam)
        ) {
          this.activeViewId = viewParam;
        } else {
          this.activeViewId = this.views[this.activeCurrencyId][0].id;
          this.updateView(this.activeViewId);
        }
        this.detectChanges();
      }
    );
    this.loadWallet();
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  async loadWallet() {
    try {
      this.wallet = await this.walletService.getWallet();
      if (this.wallet) {
        this.setCurrencies();
        this.inProgress = false;
      }
    } catch (e) {
      console.error(e);
    }
    this.detectChanges();
  }

  setCurrencies() {
    this.currencies = [];
    const headerCurrencies: string[] = ['tokens', 'cash', 'eth', 'btc'];
    headerCurrencies.forEach(currency => {
      const headerTab: ShadowboxHeaderTab = {
        id: currency,
        label: this.wallet[currency].label,
        unit: this.wallet[currency].unit,
        value: this.wallet[currency].balance,
        isLocalCurrency: false,
      };

      // Handle currency formatting for cash
      if (currency === 'cash') {
        if (this.wallet.cash.unit === 'cash') {
          headerTab.unit = 'usd';
        } else {
          headerTab.isLocalCurrency = true;
        }
      }
      this.currencies.push(headerTab);
      this.detectChanges();
    });
  }

  updateCurrency($event) {
    this.activeCurrencyId = $event.tabId;
    this.activeViewId = this.views[this.activeCurrencyId][0].id;
    this.router.navigate(['/wallet', this.activeCurrencyId, this.activeViewId]);
    this.detectChanges();
  }

  updateView(viewId) {
    this.activeViewId = viewId;
    this.router.navigate(['/wallet', this.activeCurrencyId, viewId]);
    this.detectChanges();
  }

  tokenOnboardingCompleted() {
    this.tokenOnboardingComplete = true;
    this.detectChanges();
  }

  onchainAddressChanged() {
    this.hasOnchainAddress = true;
    this.detectChanges();

    this.loadWallet();
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

  scrollToSettingsEl() {
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
