import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Session } from '../../../../services/session';
import { ThemeService } from '../../../../common/services/theme.service';
import { Subscription } from 'rxjs';
import { FeaturesService } from '../../../../services/features.service';
import { MindsUser } from '../../../../interfaces/entities';
import { UserMenuService } from './user-menu.service';
import { HelpdeskRedirectService } from '../../../services/helpdesk-redirect.service';

/**
 * Menu that contains important links we want to be extra accessible to users
 *
 * See it by clicking your avatar (as a logged-in user) on the topbar
 */
@Component({
  selector: 'm-usermenu__v3',
  templateUrl: 'user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuV3Component implements OnInit, OnDestroy {
  @Input() useAvatar: boolean = false;

  isDark: boolean = false;
  themeSubscription: Subscription;

  footerLinks: { label: string; routerLink?: string[]; href?: string }[] = [
    { label: 'Canary Mode', routerLink: ['/canary'] },
    {
      label: 'Referrals',
      routerLink: ['/settings/other/referrals'],
    },
    { label: 'Content Policy', routerLink: ['/content-policy'] },
    { label: 'Mobile App', routerLink: ['/mobile'] },
    { label: 'Store', href: 'https://www.teespring.com/stores/minds' },
    { label: 'Careers', href: 'https://jobs.lever.co/minds' },
    { label: 'Status', href: 'https://status.minds.com/' },
    { label: 'Terms', routerLink: ['/p/terms'] },
    { label: 'Privacy', routerLink: ['/p/privacy'] },
    { label: 'Contact', routerLink: ['/p/contact'] },
    { label: 'Branding', routerLink: ['/branding'] },
  ];
  maxFooterLinks = 5;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService,
    protected featuresService: FeaturesService,
    public service: UserMenuService,
    private helpdeskRedirectService: HelpdeskRedirectService
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

  toggleMenu(): void {
    this.service.isOpen$.next(!this.service.isOpen$.getValue());
  }

  closeMenu(): void {
    this.service.isOpen$.next(false);
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  toggleTheme(): void {
    this.themeService.toggleUserThemePreference();
  }

  ngOnDestroy(): void {
    this.closeMenu();
    this.themeSubscription.unsubscribe();
  }
}
