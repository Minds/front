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
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Subscription } from 'rxjs';
import { WalletDashboardService, Wallet } from './dashboard.service';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import sidebarMenu from './sidebar-menu.default';
import { Menu } from '../../../common/components/sidebar-menu/sidebar-menu.component';
import { ShadowboxHeaderTab } from '../../../interfaces/dashboard';
import { FeaturesService } from '../../../services/features.service';

@Component({
  selector: 'm-walletDashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('tokensSettings', { static: false }) tokenSettingsEl: ElementRef;
  @ViewChild('cashSettings', { static: false }) cashSettingsEl: ElementRef;
  @ViewChild('dashboardViews', { static: false })
  dashboardViewsEl: ElementRef;

  menu: Menu = sidebarMenu;
  paramsSubscription: Subscription;
  wallet: Wallet;
  inProgress: boolean = true;

  activeCurrencyId: string;
  activeViewId: string;
  onboardingComplete = false;

  views: any = {
    tokens: [
      { id: 'overview', label: 'Overview' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'settings', label: 'Settings' },
    ],
    cash: [
      { id: 'transactions', label: 'Transactions' },
      { id: 'settings', label: 'Settings' },
    ],
    eth: [{ id: 'settings', label: 'Settings' }],
    btc: [{ id: 'settings', label: 'Settings' }],
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

    if (
      this.session.getLoggedInUser().rewards &&
      this.session.getLoggedInUser().eth_wallet
    ) {
      this.onboardingComplete = true;
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

  onboardingCompleted() {
    this.onboardingComplete = true;
    this.detectChanges();
  }

  scrollToSettings(currency: string) {
    if (this.activeCurrencyId !== currency) {
      this.router.navigate([`/wallet/${currency}/settings`]);
    } else {
      const settingsEl =
        currency === 'cash'
          ? this.cashSettingsEl.nativeElement
          : this.tokenSettingsEl.nativeElement;

      if (!settingsEl) {
        this.updateView('settings');
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(
        () =>
          this.dashboardViewsEl.nativeElement.scrollIntoView({
            behavior: 'smooth',
          }),
        0
      );
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
