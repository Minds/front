import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Session } from '../../../services/session';
import { ThemeService } from '../../../common/services/theme.service';
import { Subscription } from 'rxjs';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ReferralsLinksComponent } from '../../../modules/wallet/tokens/referrals/links/links.component';

@Component({
  selector: 'm-user-menu',
  templateUrl: 'user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent implements OnInit {
  isOpen: boolean = false;

  isDark: boolean = false;
  themeSubscription: Subscription;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService,
    private overlayModal: OverlayModalService
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

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  openReferralsModal() {
    this.overlayModal
      .create(
        ReferralsLinksComponent,
        {},
        {
          class: 'm-overlay-modal--referrals-links m-overlay-modal--medium',
        }
      )
      .present();
  }
}
