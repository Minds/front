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
  selector: 'm-homepage__v3',
  templateUrl: 'homepage-v3.component.html',
  styleUrls: ['homepage-v3.component.ng.scss'],
})
export class HomepageV3Component implements OnInit {
  @ViewChild('registerForm') registerForm: RegisterForm;

  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;
  readonly headline = $localize`:@@ELEVATE_THE_GLOBAL_CONVERSATION:Elevate the global conversation`;
  readonly description = $localize`:@@HOMEPAGE__V3__SUBHEADER:Minds is an open source social network dedicated to Internet freedom. Speak freely, protect your privacy, earn crypto rewards and take back control of your social media.`;
  readonly blurhash = {
    blurhash:
      '|03u=zF}U]rWRjt6W;s:Na=G$*F2s.jtR*xFR*s-znM{o~OrofaeWBoJWqPBoeVssUWBjYW=ogoMRibbt7R*xDR,flj?fPX9jFjYofW=oMR*n$o0bbW=n%WBoJWqj[j[ayWBoJW=fko0ayoKa}bHs.R*o0bIbIsmS2j@fk',
  };

  constructor(
    public client: Client,
    public router: Router,
    public navigation: NavigationService,
    public session: Session,
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
    // if (this.pageTitle) {
    //   this.metaService.setTitle(this.pageTitle);
    // }

    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }

    this.pageLayoutService.useFullWidth();
    this.pageLayoutService.removeTopbarBackground();
    this.pageLayoutService.removeTopbarBorder();
    this.navigationService.setVisible(true);
    this.topbarService.toggleMarketingPages(true, false, false);
    this.topbarService.toggleSearchBar(false);
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
