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

@Component({
  selector: 'm-usermenu__v3',
  templateUrl: 'user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuV3Component implements OnInit, OnDestroy {
  @Input() useAvatar: boolean = false;

  isDark: boolean = false;
  themeSubscription: Subscription;

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

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
