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
import { DynamicBoostExperimentService } from '../../../../modules/experiments/sub-services/dynamic-boost-experiment.service';
import { UserMenuBoostExperimentService } from '../../../../modules/experiments/sub-services/user-menu-boost-option-experiment.service';
import { BoostModalLazyService } from '../../../../modules/boost/modal/boost-modal-lazy.service';

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

  boostConsoleLink: string = '/boost/console';
  isDark: boolean = false;
  themeSubscription: Subscription;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService,
    private helpdeskRedirectService: HelpdeskRedirectService,
    private boostModalLazyService: BoostModalLazyService,
    private dynamicBoostExperiment: DynamicBoostExperimentService,
    private userMenuBoostExperiment: UserMenuBoostExperimentService
  ) {}

  ngOnInit(): void {
    this.session.isLoggedIn(() => this.detectChanges());

    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => (this.isDark = isDark)
    );

    if (this.dynamicBoostExperiment.isActive()) {
      this.boostConsoleLink = '/boost/boost-console';
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
   * Whether user menu boost experiment is active - when active we show a
   * boost channel option, when inactive we show a link to the boost console.
   * @returns { boolean }
   */
  public isUserMenuBoostExperimentActive(): boolean {
    return this.userMenuBoostExperiment.isActive();
  }

  /**
   * Opens boost modal for a boost on the sessions logged in channel.
   * @returns { Promise<void> }
   */
  public async openBoostChannelModal(): Promise<void> {
    await this.boostModalLazyService.open(this.session.getLoggedInUser());
  }
}
