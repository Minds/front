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
import { MindsUser } from '../../../interfaces/entities';
import { BoostModalLazyService } from '../../../modules/boost/modal/boost-modal-lazy.service';
import { SidebarNavigationService } from '../sidebar/navigation.service';
import { HelpdeskRedirectService } from '../../services/helpdesk-redirect.service';
import { Router } from '@angular/router';
import { SupermindExperimentService } from '../../../modules/experiments/sub-services/supermind-experiment.service';

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

  footerLinks: {
    label: string;
    routerLink?: string[];
    href?: string;
  }[] = [
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
    private boostModalService: BoostModalLazyService,
    private sidebarNavigationService: SidebarNavigationService,
    private helpdeskRedirectService: HelpdeskRedirectService,
    private supermindExperiment: SupermindExperimentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session.isLoggedIn(() => this.detectChanges());

    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => (this.isDark = isDark)
    );

    // For logged out users, remove referrals link
    if (!this.getCurrentUser()) {
      this.footerLinks = this.footerLinks.filter(link => {
        return link.label !== 'Referrals';
      });
    }
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

  /**
   * Called on earn modal click - navigates to earn blog.
   * @returns { void }
   */
  public onEarnClick(): void {
    this.router.navigateByUrl(
      '/info/blog/introducing-boost-partners-program-1477787849246904328'
    );
  }

  /**
   * Open Boost console.
   * @returns { void }
   */
  public openBoostConsole(): void {
    this.router.navigate(['/boost/boost-console']);
  }

  /**
   * Open supermind console.
   * @returns { void }
   */
  public openSupermindConsole(): void {
    this.router.navigate(['/supermind/inbox']);
  }

  /**
   * Whether Supermind option should be shown.
   * @return { boolean }
   */
  public shouldShowSupermindOption(): boolean {
    return this.supermindExperiment.isActive();
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
