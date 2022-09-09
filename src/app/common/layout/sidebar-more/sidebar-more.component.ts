import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Session } from '../../../services/session';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { FeaturesService } from '../../../services/features.service';
import { MindsUser } from '../../../interfaces/entities';
import { Web3WalletService } from '../../../modules/blockchain/web3-wallet.service';
import { BuyTokensModalService } from '../../../modules/blockchain/token-purchase/v2/buy-tokens-modal.service';
import { EarnModalService } from '../../../modules/blockchain/earn/earn-modal.service';
import { BoostModalLazyService } from '../../../modules/boost/modal/boost-modal-lazy.service';
import { SidebarNavigationService } from '../sidebar/navigation.service';
import { HelpdeskRedirectService } from '../../services/helpdesk-redirect.service';
import { Router } from '@angular/router';

@Component({
  selector: 'm-sidebarMore',
  templateUrl: './sidebar-more.component.html',
  styleUrls: ['./sidebar-more.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMoreComponent implements OnInit, OnDestroy {
  @Input() useAvatar: boolean = false;
  @Input() showFooterLinks: boolean = false;

  isDark: boolean = false;
  themeSubscription: Subscription;

  footerLinks: { label: string; routerLink?: string[]; href?: string }[] = [
    { label: 'Content Policy', routerLink: ['/content-policy'] },
    { label: 'Privacy', routerLink: ['/p/privacy'] },
    {
      label: 'Referrals',
      routerLink: ['/settings/other/referrals'],
    },
    { label: 'Mobile App', routerLink: ['/mobile'] },
    { label: 'Store', href: 'https://www.teespring.com/stores/minds' },
    { label: 'Careers', href: 'https://jobs.lever.co/minds' },
    { label: 'Status', href: 'https://status.minds.com/' },
    { label: 'Canary Mode', routerLink: ['/canary'] },
    { label: 'Terms', routerLink: ['/p/terms'] },
    { label: 'Contact', routerLink: ['/p/contact'] },
    { label: 'Branding', routerLink: ['/branding'] },
  ];
  maxFooterLinks = 4;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService,
    protected featuresService: FeaturesService,
    private web3WalletService: Web3WalletService,
    private buyTokensModalService: BuyTokensModalService,
    private earnModalService: EarnModalService,
    private boostModalService: BoostModalLazyService,
    private sidebarNavigationService: SidebarNavigationService,
    private helpdeskRedirectService: HelpdeskRedirectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session.isLoggedIn(() => this.detectChanges());

    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => (this.isDark = isDark)
    );
  }

  getCurrentUser(): MindsUser {
    return this.session.getLoggedInUser();
  }

  isAdmin(): boolean {
    return this.session.isAdmin();
  }

  /**
   * Get helpdesk redirect URL from service.
   * @returns { string } URL to redirect to for helpdesk.
   */
  public getHelpdeskRedirectUrl(): string {
    return this.helpdeskRedirectService.getUrl();
  }

  async buyTokens(): Promise<void> {
    if (!this.web3WalletService.checkDeviceIsSupported()) {
      return null;
    }
    await this.web3WalletService.getCurrentWallet(true);
    await this.buyTokensModalService.open();
  }

  async openEarnModal() {
    await this.earnModalService.open();
  }

  async openBoostModal() {
    await this.boostModalService.open(this.session.getLoggedInUser());
  }

  /**
   * Open supermind console.
   * @returns { void }
   */
  public openSupermindConsole(): void {
    this.router.navigate(['/supermind/inbox']);
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  toggleTheme(): void {
    this.themeService.toggleUserThemePreference();
  }

  /** Only relevant for mobile widths */
  toggleSidebar(): void {
    this.sidebarNavigationService.toggle();
  }

  toggleFooterLinks(): void {
    if (this.maxFooterLinks === 4) {
      this.maxFooterLinks = Infinity;
    } else {
      this.maxFooterLinks = 4;
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
