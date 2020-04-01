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

@Component({
  selector: 'm-usermenu__v3',
  templateUrl: 'user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuV3Component implements OnInit, OnDestroy {
  @Input() useAvatar: boolean = false;
  @Input() showFooterLinks: boolean = false;

  isOpen: boolean = false;

  minds = window.Minds;
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
  ];
  maxFooterLinks = 5;

  constructor(
    public navigation: NavigationService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.session.isLoggedIn(() => this.detectChanges());
    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => (this.isDark = isDark)
    );
  }

  getCurrentUser() {
    return this.session.getLoggedInUser();
  }

  isAdmin() {
    return this.session.isAdmin();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  toggleTheme() {
    this.themeService.toggleUserThemePreference();
  }

  toggleFooterLinks() {
    if (this.maxFooterLinks === 5) {
      this.maxFooterLinks = Infinity;
    } else {
      this.maxFooterLinks = 5;
    }
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
