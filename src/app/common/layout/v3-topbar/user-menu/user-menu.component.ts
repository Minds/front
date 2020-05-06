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
import { MindsUser } from '../../../../interfaces/entities';

@Component({
  selector: 'm-usermenu__v3',
  templateUrl: 'user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuV3Component implements OnInit, OnDestroy {
  @Input() useAvatar: boolean = false;
  @Input() showFooterLinks: boolean = false;

  isOpen: boolean = false;

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
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService
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

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
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
