import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { GuestModeExperimentService } from '../../../modules/experiments/sub-services/guest-mode-experiment.service';
import { Session } from '../../../services/session';
import { SessionsStorageService } from '../../../services/session-storage.service';
import { AuthRedirectService } from '../../services/auth-redirect.service';
import { ConfigsService } from '../../services/configs.service';
import { ThemeService } from '../../services/theme.service';

/**
 * Join banner, full width and fixed to bottom of page.
 */
@Component({
  selector: 'm-joinBanner',
  templateUrl: './join-banner.component.html',
  styleUrls: ['./join-banner.component.ng.scss'],
})
export class JoinBannerComponent implements OnInit {
  // asset url for logo.
  public readonly cdnAssetsUrl: string = '';

  // whether modal has been dismissed in this session.
  public dismissed = true;

  constructor(
    private session: Session,
    private sessionStorage: SessionsStorageService,
    private authModal: AuthModalService,
    private guestModeExperiment: GuestModeExperimentService,
    private router: Router,
    private authRedirectService: AuthRedirectService,
    private themes: ThemeService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.dismissed = !!this.sessionStorage.get('dismissed_join_banner');
  }

  /**
   * Gets logo URL dependent on theme.
   * @returns { Observable<string> } Observable logo url.
   */
  get logoUrl(): Observable<string> {
    return this.themes.isDark$.pipe(
      map((isDarkTheme: boolean) => {
        return `${this.cdnAssetsUrl}${
          !isDarkTheme
            ? 'assets/logos/logo-dark-mode.svg'
            : 'assets/logos/logo-light-mode.svg'
        }`;
      })
    );
  }

  /**
   * Whether join banner should be shown.
   * @returns { boolean } - true if banner should be shown.
   */
  public shouldShow(): boolean {
    return (
      this.guestModeExperiment.isActive() &&
      !this.session.getLoggedInUser() &&
      !this.dismissed
    );
  }

  /**
   * Dismisses banner and sets record in session storage.
   * @returns { void }
   */
  public dismiss(): void {
    this.dismissed = true;
    this.sessionStorage.set('dismissed_join_banner', true);
  }

  /**
   * Join button clicked - fires auth modal
   * @returns { Promise<void> }
   */
  public async join(): Promise<void> {
    const user = await this.authModal.open();

    if (user) {
      if (this.router.url === '/' || this.router.url === '/about') {
        this.router.navigate([this.authRedirectService.getRedirectUrl()]);
      }
    }
  }
}
