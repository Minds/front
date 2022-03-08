import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Client } from '../../services/api/client';
import { Router } from '@angular/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { Session } from '../../services/session';
import { RegisterForm } from '../forms/register/register';
import { FeaturesService } from '../../services/features.service';
import { ConfigsService } from '../../common/services/configs.service';
import { OnboardingV2Service } from '../onboarding-v2/service/onboarding.service';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { AuthModalService } from '../auth/modal/auth-modal.service';
import { AuthRedirectService } from '../../common/services/auth-redirect.service';

@Component({
  selector: 'm-homepage__v2',
  templateUrl: 'homepage-v2.component.html',
})
export class HomepageV2Component implements OnInit {
  @ViewChild('registerForm') registerForm: RegisterForm;

  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;
  readonly headline = $localize`:@@HOMEPAGE_V2__TAKE_BACK_CONTROL:Take back control of your social media`;
  readonly description = $localize`:@@HOMEPAGE__V2__SUBHEADER:A place to have open conversations and bring people together. Free your mind and get paid for creating content, driving traffic and referring friends.`;

  constructor(
    public client: Client,
    public router: Router,
    public navigation: NavigationService,
    public session: Session,
    private featuresService: FeaturesService,
    configs: ConfigsService,
    private onboardingService: OnboardingV2Service,
    private navigationService: SidebarNavigationService,
    private topbarService: TopbarService,
    private pageLayoutService: PageLayoutService,
    private authModal: AuthModalService,
    private authRedirectService: AuthRedirectService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }

    this.navigationService.setVisible(false);
    this.topbarService.toggleMarketingPages(true, false, false);
    this.topbarService.toggleSearchBar(false);

    this.pageLayoutService.useFullWidth();
    this.pageLayoutService.removeTopbarBackground();
    this.pageLayoutService.removeTopbarBorder();
  }

  ngOnDestroy() {
    this.navigationService.setVisible(true);
  }

  @HostListener('window:scroll')
  onScroll() {
    if (window.document.body.scrollTop > 52) {
      this.pageLayoutService.useTopbarBackground();
      this.pageLayoutService.useTopbarBorder();
    } else {
      this.pageLayoutService.removeTopbarBackground();
      this.pageLayoutService.removeTopbarBorder();
    }
  }

  registered() {
    if (this.onboardingService.shouldShow()) {
      this.router.navigate(['/onboarding']);
      return;
    }

    this.router.navigate(['/' + this.session.getLoggedInUser().username]);
  }

  /**
   * Call to register the user
   * depending on feat flag will route to /register or open auth modal.
   * @returns { void }
   */
  public async register(): Promise<void> {
    try {
      await this.authModal.open();

      const url = this.authRedirectService.getRedirectUrl();
      this.router.navigate([url]);
      return;
    } catch (e) {
      if (e === 'DismissedModalException') {
        return; // modal dismissed, do nothing
      }
      console.error(e);
    }
  }

  isMobile() {
    return window.innerWidth <= 540;
  }
}
