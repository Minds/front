import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { Subscription } from 'rxjs';
import { WalletDashboardService } from './dashboard.service';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MindsTitle } from '../../../services/ux/title';
import sidebarMenu from './sidebar-menu.default';
import { Menu } from '../../../common/components/sidebar-menu/sidebar-menu.component';
import { ShadowboxHeaderTab } from '../../../interfaces/dashboard';

// TODOOJM DON"T USE THIS BC SSR??
import { Storage } from '../../../services/storage';

@Component({
  selector: 'm-walletDashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDashboardComponent implements OnInit {
  menu: Menu = sidebarMenu;
  paramsSubscription: Subscription;
  wallet = {};

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
    protected title: MindsTitle,
    protected storage: Storage,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (
      this.storage.get('walletOnboardingComplete') ||
      (this.session.getLoggedInUser().rewards &&
        this.session.getLoggedInUser().eth_wallet)
    ) {
      this.onboardingComplete = true;
    }

    this.title.setTitle('Wallet');
    this.wallet = this.walletService.getWallet();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.activeCurrencyId = params.get('currency');

      if (
        params.get('view') &&
        this.views[this.activeCurrencyId].find(v => v.id === params.get('view'))
      ) {
        this.activeViewId = params.get('view');
      } else {
        this.activeViewId = this.views[this.activeCurrencyId][0].id;
        this.updateView(this.activeViewId);
      }
      this.detectChanges();
    });
    this.setCurrencies();
    this.detectChanges();
  }

  setCurrencies() {
    const headerCurrencies = ['tokens', 'cash', 'eth', 'btc'];
    headerCurrencies.forEach(currency => {
      const headerTab: ShadowboxHeaderTab = {
        id: currency,
        label: this.wallet[currency].label,
        unit: this.wallet[currency].unit,
        isLocalCurrency: currency === 'cash' ? true : false,
      };
      if (currency !== 'btc') {
        headerTab.value = this.wallet[currency].balance;
      }
      this.currencies.push(headerTab);
    });
    console.log(this.currencies);
  }

  updateCurrency($event) {
    this.activeCurrencyId = $event.tabId;
    this.activeViewId = this.views[this.activeCurrencyId][0].id;
    this.router.navigate([
      '/v2wallet',
      this.activeCurrencyId,
      this.activeViewId,
    ]);
    this.detectChanges();
  }

  updateView(viewId) {
    this.activeViewId = viewId;
    this.router.navigate(['/v2wallet', this.activeCurrencyId, viewId]);
    this.detectChanges();
  }

  onboardingCompleted() {
    this.storage.set('walletOnboardingComplete', true);
    this.onboardingComplete = true;
    this.detectChanges();
  }

  scrollToSettings(currency: string) {
    if (this.activeCurrencyId !== currency) {
      // TODOOJM change 'v2wallet' once url is changed in wallet module
      this.router.navigate([`/v2wallet/${currency}/settings`]);
    } else {
      const settingsEl = document.getElementById(`${currency}Settings`);
      if (!settingsEl) {
        this.updateView('settings');
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(
        () =>
          document.getElementById('dashboardViewsTabs').scrollIntoView({
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
