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
import { ShadowboxHeaderTab } from '../../../interfaces/dashboard';

@Component({
  selector: 'm-walletDashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDashboardComponent implements OnInit, OnDestroy {
  menu: Menu = sidebarMenu;
  paramsSubscription: Subscription;
  wallet;

  activeCurrencyId: string;
  activeViewId: string;

  views: any = {
    tokens: [
      { id: 'overview', label: 'Overview' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'settings', label: 'Settings' },
    ],
    usd: [
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
    protected title: MindsTitle
  ) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
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
    const headerCurrencies = ['tokens', 'usd', 'eth', 'btc'];
    headerCurrencies.forEach(currency => {
      const headerTab: ShadowboxHeaderTab = {
        id: currency,
        label: this.wallet[currency].label,
        unit: this.wallet[currency].unit,
      };
      if (currency !== 'btc') {
        headerTab.value = this.wallet[currency].balance;
      }
      this.currencies.push(headerTab);
    });
  }

  ngOnDestroy() {
    // No need for this with route params
    // if (this.paramsSubscription) {
    //   this.paramsSubscription.unsubscribe();
    // }
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

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
