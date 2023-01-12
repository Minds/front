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
import { FeaturesService } from '../../../../services/features.service';
import { MindsUser } from '../../../../interfaces/entities';
import { HelpdeskRedirectService } from '../../../services/helpdesk-redirect.service';
import { DynamicBoostExperimentService } from '../../../../modules/experiments/sub-services/dynamic-boost-experiment.service';

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
    protected featuresService: FeaturesService,
    private helpdeskRedirectService: HelpdeskRedirectService,
    public dynamicBoostExperiment: DynamicBoostExperimentService
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
    this.themeSubscription.unsubscribe();
  }
}
