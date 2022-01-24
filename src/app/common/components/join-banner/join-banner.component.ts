import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { DiscoveryOnRegisterExperimentService } from '../../../modules/experiments/sub-services/discovery-on-register-experiment.service';
import { Session } from '../../../services/session';
import { SessionsStorageService } from '../../../services/session-storage.service';
import { ConfigsService } from '../../services/configs.service';

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
    private discoveryOnRegisterExperiment: DiscoveryOnRegisterExperimentService,
    private router: Router,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.dismissed = !!this.sessionStorage.get('dismissed_join_banner');
  }

  /**
   * Whether join banner should be shown.
   * @returns { boolean } - true if banner should be shown.
   */
  public shouldShow(): boolean {
    return (
      this.discoveryOnRegisterExperiment.isActive() &&
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
    try {
      await this.authModal.open();

      if (this.router.url === '/' || this.router.url === '/about') {
        // Redirect goes to newsfeed or discovery top,
        // depending on experiment variation
        const url = this.discoveryOnRegisterExperiment.redirectUrl();
        this.router.navigate([url]);
      }
    } catch (e) {
      if (e === 'DismissedModalException') {
        return; // modal dismissed, do nothing
      }
      console.error(e);
    }
  }
}
