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

@Component({
  selector: 'm-walletDashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDashboardComponent implements OnInit, OnDestroy {
  menu: Menu = sidebarMenu;
  paramsSubscription: Subscription;

  // dashboard

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

    this.route.paramMap.subscribe((params: ParamMap) => {
      const currency = params.get('currency');
      // this.updateCurrency(currency);
    });

    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      // TODO: handleUrl
      if (params['timespan']) {
        // this.updateTimespan(params['timespan']);
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  updateCurrency(currencyId) {
    // this.walletService.updateCurrency(currencyId);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
