import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  HostBinding,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  OnDestroy,
  Injector,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Navigation as NavigationService } from '../../../../services/navigation';
import { Session } from '../../../../services/session';
import { DynamicHostDirective } from '../../../directives/dynamic-host.directive';
import { SidebarNavigationService } from '../navigation.service';
import { ConfigsService } from '../../../services/configs.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BuyTokensModalService } from '../../../../modules/blockchain/token-purchase/v2/buy-tokens-modal.service';
import { Web3WalletService } from '../../../../modules/blockchain/web3-wallet.service';
import { EarnModalService } from '../../../../modules/blockchain/earn/earn-modal.service';
import { BoostModalLazyService } from '../../../../modules/boost/modal/boost-modal-lazy.service';
import { ComposerModalService } from '../../../../modules/composer/components/modal/modal.service';
import { AuthModalService } from '../../../../modules/auth/modal/auth-modal.service';
import { ThemeService } from '../../../services/theme.service';
import { ExperimentsService } from '../../../../modules/experiments/experiments.service';

@Component({
  selector: 'm-sidebar--navigationV2',
  templateUrl: 'navigation-v2.component.html',
  styleUrls: ['./navigation-v2.component.ng.scss'],
})
export class SidebarNavigationV2Component implements OnInit, OnDestroy {
  readonly cdnUrl: string;
  readonly cdnAssetsUrl: string;
  readonly chatUrl: string;

  @ViewChild(DynamicHostDirective, { static: true })
  host: DynamicHostDirective;

  user;

  componentRef;

  layoutMode: 'phone' | 'tablet' | 'desktop' = 'desktop';
  showLabels: boolean = false;

  settingsLink: string = '/settings';

  @HostBinding('class.m-sidebarNavigation--opened')
  isOpened: boolean = false;

  @HostBinding('hidden')
  hidden: boolean = false;

  @HostBinding('class.m-sidebarNavigation--sidebarMoreOpened')
  sidebarMoreOpened: boolean = false;

  groupSelectedSubscription: Subscription = null;
  plusPageActive: boolean = false;

  routerSubscription: Subscription;

  subscriptions: Subscription[] = [];

  isDarkTheme: boolean = false;

  constructor(
    public navigation: NavigationService,
    public session: Session,
    protected configs: ConfigsService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private buyTokensModalService: BuyTokensModalService,
    private web3WalletService: Web3WalletService,
    private boostModalService: BoostModalLazyService,
    private earnModalService: EarnModalService,
    private composerModalService: ComposerModalService,
    private injector: Injector,
    private authModal: AuthModalService,
    private themeService: ThemeService,
    private sidebarNavigationService: SidebarNavigationService,
    private experiments: ExperimentsService
  ) {
    this.cdnUrl = this.configs.get('cdn_url');
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
    this.chatUrl = this.configs.get('matrix')?.chat_url;
    this.sidebarNavigationService.setContainer(this);
    this.getUser();

    /**
     * Temporarily disable routerLinkActive class for the 'discovery' item so only 'discovery/plus' is highlighted
     * */
    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: Event) => {
        if (event['url'].slice(0, 15) === '/discovery/plus') {
          this.plusPageActive = true;
        } else {
          this.plusPageActive = false;
        }
      });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
    }

    this.settingsLink = '/settings';

    this.subscriptions.push(
      this.themeService.isDark$.subscribe(isDark => {
        this.isDarkTheme = isDark;
      })
    );

    this.subscriptions.push(
      this.sidebarNavigationService.isOpened$.subscribe(isOpened => {
        if (this.layoutMode === 'phone') {
          this.isOpened = isOpened;

          if (isOpened) {
            document.body.classList.add('m-overlay-modal--shown--no-scroll');
          }
        }

        if (this.layoutMode !== 'phone' || !isOpened) {
          document.body.classList.remove('m-overlay-modal--shown--no-scroll');
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this.groupSelectedSubscription) {
      this.groupSelectedSubscription.unsubscribe();
    }

    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getUser() {
    this.user = this.session.getLoggedInUser(user => {
      this.user = user;
    });
  }

  toggle(): void {
    this.sidebarNavigationService.toggle();
  }

  async buyTokens() {
    this.toggle();
    await this.web3WalletService.getCurrentWallet(true);
    await this.buyTokensModalService.open();
  }

  async openEarnModal() {
    this.toggle();
    await this.earnModalService.open();
  }

  async openBoostModal() {
    this.toggle();
    await this.boostModalService.open(this.session.getLoggedInUser());
  }

  async openComposeModal() {
    this.toggle();
    await this.composerModalService.setInjector(this.injector).present();
  }

  setVisible(value: boolean): void {
    this.hidden = !value;

    if (!value) {
      if (this.host && this.host.viewContainerRef) {
        this.host.viewContainerRef.clear();
      }
    }
  }

  /**
   * Don't click through the menu on mobile
   */
  onSidebarNavClick($event): void {
    if (this.layoutMode === 'phone') {
      $event.stopPropagation();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.showLabels = window.innerWidth >= 1220 ? true : false;

    if (window.innerWidth > 1040) {
      this.layoutMode = 'desktop';
    } else if (window.innerWidth >= 480) {
      this.layoutMode = 'tablet';
    } else {
      this.layoutMode = 'phone';
      this.showLabels = true;
    }

    if (this.layoutMode !== 'phone') {
      this.sidebarNavigationService.isOpened$.next(false);
    }
  }

  /**
   * Returns if link should be to discovery homepage
   * @returns { boolean } true if link should be '/'.
   */
  public shouldBeDiscoveryHomepage(): boolean {
    return !this.user; // logged out
  }

  /**
   *
   * We dynamically change the z-index when the
   * "sidebar more" popper is opened
   * So that users can still click on the top left logo
   * when the popper is closed
   */
  public onSidebarMoreToggle($event) {
    this.sidebarMoreOpened = $event;
  }

  /**
   * Experiment where we change the wording of "Discovery" to "Explore".
   * https://gitlab.com/minds/minds/-/issues/3038
   * @returns { boolean } true if experiment is to be applied.
   */
  public showExploreExperiment(): boolean {
    return this.experiments.hasVariation('minds-3038-discovery-explore', true);
  }
}
