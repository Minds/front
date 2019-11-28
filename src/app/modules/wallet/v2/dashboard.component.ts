// TODOOJM rename all the toptab stuff to 'view'

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { WalletDashboardService } from './dashboard.service';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MindsTitle } from '../../../services/ux/title';
import sidebarMenu from './sidebar-menu.default';
import { Menu } from '../../../common/components/sidebar-menu/sidebar-menu.component';
import { ShadowboxHeaderTab, TopTab } from '../../../interfaces/dashboard';

@Component({
  selector: 'm-walletDashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDashboardComponent implements OnInit, OnDestroy {
  menu: Menu = sidebarMenu;
  paramsSubscription: Subscription;

  currencies: ShadowboxHeaderTab[];
  activeCurrencyId;
  activeTabId;
  topTabOptions;
  chartData;

  topTabs = [
    {
      id: 'tokens',
      tabs: [
        { id: 'overview', label: 'Overview' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'settings', label: 'Settings' },
      ],
    },
    {
      id: 'usd',
      tabs: [
        { id: 'transactions', label: 'Transactions' },
        { id: 'settings', label: 'Settings' },
      ],
    },
    {
      id: 'eth',
      tabs: [{ id: 'settings', label: 'Settings' }],
    },
    {
      id: 'btc',
      tabs: [{ id: 'settings', label: 'Settings' }],
    },
  ];

  constructor(
    protected walletService: WalletDashboardService,
    protected session: Session,
    protected router: Router,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    protected title: MindsTitle
  ) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.title.setTitle('Wallet');
    this.currencies = this.walletService.getCurrencies();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.activeCurrencyId = params.get('currency');
      this.topTabOptions = this.topTabs.find(
        currencyTabsObj => currencyTabsObj.id === this.activeCurrencyId
      ).tabs;

      if (params.get('topTab')) {
        this.activeTabId = params.get('topTab');
      } else {
        this.activeTabId = this.topTabOptions[0];
        this.rerouteTopTab(this.activeTabId);
      }

      if (this.activeTabId === 'overview') {
        this.chartData = this.currencies.find(
          currency => currency.id === this.activeCurrencyId
        );
      }

      this.detectChanges();
    });
  }

  ngOnDestroy() {
    // No need for this with route params
    // if (this.paramsSubscription) {
    //   this.paramsSubscription.unsubscribe();
    // }
  }

  updateCurrency($event) {
    // this.walletService.updazteCurrency($event.tabId);
  }

  updateActiveTabId($event) {
    this.activeTabId = $event.tabId;
    this.rerouteTopTab(this.activeCurrencyId);
  }

  rerouteTopTab(topTabId) {
    this.router.navigate(['/v2wallet', this.activeCurrencyId, topTabId]);

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
