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
import { SidebarNavigationService } from '../sidebar/navigation.service';
import { HelpdeskRedirectService } from '../../services/helpdesk-redirect.service';
import { Router } from '@angular/router';
import { ConfigsService } from '../../services/configs.service';
import { IsTenantService } from '../../services/is-tenant.service';

@Component({
  selector: 'm-sidebarMore',
  templateUrl: './sidebar-more.component.html',
  styleUrls: ['./sidebar-more.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMoreComponent implements OnInit, OnDestroy {
  @Input() useAvatar: boolean = false;

  isDark: boolean = false;
  themeSubscription: Subscription;

  /** Whether experiment controlling reorganization of menu items variation is active */
  public showReorgVariation: boolean = false;

  public readonly chatUrl: string;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService,
    private sidebarNavigationService: SidebarNavigationService,
    private helpdeskRedirectService: HelpdeskRedirectService,
    private router: Router,
    private configs: ConfigsService
  ) {
    this.chatUrl = this.configs.get('matrix')?.chat_url;
  }

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

  /**
   * Called on earn modal click - navigates to earn blog.
   * @returns { void }
   */
  public onEarnClick(): void {
    this.router.navigateByUrl(
      '/info/blog/how-to-earn-on-minds-1486070032210333697'
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

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
