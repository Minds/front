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
import { Navigation as NavigationService } from '../../../../services/navigation';
import { RouterLink } from '@angular/router';
import { FeaturesService } from '../../../../services/features.service';
import { MindsUser } from '../../../../interfaces/entities';
import { UserMenuService } from './user-menu.service';

@Component({
  selector: 'm-usermenu__v3',
  templateUrl: 'user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuV3Component implements OnInit, OnDestroy {
  @Input() useAvatar: boolean = false;
  @Input() showFooterLinks: boolean = false;

  isDark: boolean = false;
  themeSubscription: Subscription;

  footerLinks: { label: string; routerLink?: string[]; href?: string }[] = [
    { label: 'Canary Mode', routerLink: ['/canary'] },
    { label: 'Content Policy', routerLink: ['/content-policy'] },
    { label: 'Mobile App', routerLink: ['/mobile'] },
    { label: 'Store', href: 'https://www.teespring.com/stores/minds' },
    { label: 'Jobs', routerLink: ['/jobs'] },
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
    public service: UserMenuService
  ) {}

  ngOnInit(): void {
    this.session.isLoggedIn(() => this.detectChanges());

    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => (this.isDark = isDark)
    );

    if (this.featuresService.has('settings-referrals')) {
      const referralsLink = {
        label: 'Referrals',
        routerLink: ['/settings/other/referrals'],
      };
      this.footerLinks.splice(1, 0, referralsLink);
    }
  }

  getCurrentUser(): MindsUser {
    return this.session.getLoggedInUser();
  }

  isAdmin(): boolean {
    return this.session.isAdmin();
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

  toggleFooterLinks(): void {
    if (this.maxFooterLinks === 5) {
      this.maxFooterLinks = Infinity;
    } else {
      this.maxFooterLinks = 5;
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
