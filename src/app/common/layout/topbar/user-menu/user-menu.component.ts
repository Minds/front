import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Session } from '../../../../services/session';
import { ThemeService } from '../../../services/theme.service';
import { Subscription } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';
import { HelpdeskRedirectService } from '../../../services/helpdesk-redirect.service';
import { BoostModalV2LazyService } from '../../../../modules/boost/modal-v2/boost-modal-v2-lazy.service';
import { PermissionsService } from '../../../services/permissions.service';

/**
 * Menu that contains important links we want to be extra accessible to users
 *
 * See it by clicking your avatar (as a logged-in user) on the topbar
 */
@Component({
  selector: 'm-userMenu',
  templateUrl: 'user-menu.component.html',
  styleUrls: ['user-menu.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent implements OnInit, OnDestroy {
  @Input() useAvatar: boolean = false;

  isDark: boolean = false;
  themeSubscription: Subscription;

  /** Whether the user has permission to boost. */
  protected hasBoostPermission: boolean = false;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService,
    private helpdeskRedirectService: HelpdeskRedirectService,
    private boostModalLazyService: BoostModalV2LazyService,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    this.session.isLoggedIn(() => this.detectChanges());

    this.hasBoostPermission = this.permissionsService.canBoost();
    this.themeSubscription = this.themeService.isDark$.subscribe(
      (isDark) => (this.isDark = isDark)
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

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  toggleTheme(): void {
    this.themeService.toggleUserThemePreference();
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  /**
   * Opens boost modal for a boost on the sessions logged in channel.
   * @returns { Promise<void> }
   */
  public async openBoostChannelModal(): Promise<void> {
    await this.boostModalLazyService.open(this.session.getLoggedInUser());
  }
}
