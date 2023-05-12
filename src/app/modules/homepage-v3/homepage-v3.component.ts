import { AppPromptService } from './../app-prompt/app-prompt.service';
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Client } from '../../services/api/client';
import { Router } from '@angular/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { Session } from '../../services/session';
import { RegisterForm } from '../forms/register/register';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { AuthModalService } from '../auth/modal/auth-modal.service';
import { AuthRedirectService } from '../../common/services/auth-redirect.service';
import isMobileOrTablet from '../../../app/helpers/is-mobile-or-tablet';
import { ExperimentsService } from '../experiments/experiments.service';
import {
  SITE_URL,
  STRAPI_URL,
} from '../../common/injection-tokens/url-injection-tokens';
import { Apollo, gql } from 'apollo-angular';

/**
 * Home page component
 */
@Component({
  selector: 'm-homepage__v3',
  templateUrl: 'homepage-v3.component.html',
  styleUrls: ['homepage-v3.component.ng.scss'],
})
export class HomepageV3Component implements OnInit {
  @ViewChild('registerForm') registerForm: RegisterForm;

  readonly NEURAL_BACKGROUND_BLURHASH =
    '|03u=zF}U]rWRjt6W;s:Na=G$*F2s.jtR*xFR*s-znM{o~OrofaeWBoJWqPBoeVssUWBjYW=ogoMRibbt7R*xDR,flj?fPX9jFjYofW=oMR*n$o0bbW=n%WBoJWqj[j[ayWBoJW=fko0ayoKa}bHs.R*o0bIbIsmS2j@fk';

  data: any = {};
  loading = true;

  constructor(
    public client: Client,
    public router: Router,
    public navigation: NavigationService,
    public session: Session,
    private navigationService: SidebarNavigationService,
    private topbarService: TopbarService,
    private pageLayoutService: PageLayoutService,
    private authModal: AuthModalService,
    private authRedirectService: AuthRedirectService,
    private appPromptService: AppPromptService,
    private apollo: Apollo,
    @Inject(PLATFORM_ID) protected platformId: Object,
    @Inject(SITE_URL) protected siteUrl: string,
    @Inject(STRAPI_URL) public strapiUrl: string
  ) {}

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }

    this.apollo
      .watchQuery({
        query: gql`
          {
            homepage {
              data {
                id
                attributes {
                  hero {
                    h1
                    body
                    ctaText
                    heroStats {
                      id
                      label
                      number
                    }
                  }
                  sections {
                    id
                    leftAligned
                    title
                    body
                    image {
                      data {
                        attributes {
                          url
                        }
                      }
                    }
                  }
                  sectionTail {
                    h3
                    ctaText
                  }
                }
              }
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.loading = result.loading;
        this.data = result.data.homepage.data;
      });

    this.pageLayoutService.useFullWidth();
    this.pageLayoutService.removeTopbarBackground();
    this.pageLayoutService.removeTopbarBorder();
    this.navigationService.setVisible(false);
    this.topbarService.toggleMarketingPages(true, false, false);
    this.topbarService.toggleSearchBar(false);
    this.setVhVar();

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.appPromptService.dismiss(), 2000);
    }
  }

  ngOnDestroy() {
    this.navigationService.setVisible(true);
    this.topbarService.toggleSearchBar(true);
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.document.body.scrollTop > 52) {
      this.pageLayoutService.useTopbarBackground();
      this.pageLayoutService.useTopbarBorder();
    } else {
      this.pageLayoutService.removeTopbarBackground();
      this.pageLayoutService.removeTopbarBorder();
    }
  }

  @HostListener('window:deviceorientation')
  onResize() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.setVhVar();
  }

  /**
   * sets the vh variable to use in styles.
   * this is a workaround to the default vh not respecting OS elements https://stackoverflow.com/a/61474999/5607525
   */
  private setVhVar() {
    if (!isMobileOrTablet()) return;

    const doc = document.documentElement;
    doc.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
  }

  /**
   * Call to register the user
   * depending on feat flag will route to /register or open auth modal.
   * @returns { void }
   */
  public async onRegister(): Promise<void> {
    const user = await this.authModal.open();

    if (user) {
      const url = this.authRedirectService.getRedirectUrl();
      this.router.navigate([url]);
    }
  }
}
