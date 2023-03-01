import {
  Component,
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
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BuyTokensModalService } from '../../../../modules/blockchain/token-purchase/v2/buy-tokens-modal.service';
import { Web3WalletService } from '../../../../modules/blockchain/web3-wallet.service';
import { EarnModalService } from '../../../../modules/blockchain/earn/earn-modal.service';
import { BoostModalLazyService } from '../../../../modules/boost/modal/boost-modal-lazy.service';
import { ComposerModalService } from '../../../../modules/composer/components/modal/modal.service';
import { ThemeService } from '../../../services/theme.service';
import { ExperimentsService } from '../../../../modules/experiments/experiments.service';

/**
 * V2 version of sidebar component.
 */
@Component({
  selector: 'm-sidebar__navigationV2',
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

  subscriptions: Subscription[] = [];

  isDarkTheme: boolean = false;

  /**
   * Sets display mode on resize.
   */
  @HostListener('window:resize')
  public onResize(): void {
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

  constructor(
    public navigation: NavigationService,
    public session: Session,
    protected configs: ConfigsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private buyTokensModalService: BuyTokensModalService,
    private web3WalletService: Web3WalletService,
    private boostModalService: BoostModalLazyService,
    private earnModalService: EarnModalService,
    private composerModalService: ComposerModalService,
    private injector: Injector,
    private themeService: ThemeService,
    private sidebarNavigationService: SidebarNavigationService,
    private experiments: ExperimentsService
  ) {
    this.cdnUrl = this.configs.get('cdn_url');
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
    this.chatUrl = this.configs.get('matrix')?.chat_url;
    this.sidebarNavigationService.setContainer(this);
    this.getUser();
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

  /**
   * Gets user and sets it to class variable.
   * @returns { void }
   */
  public getUser(): void {
    this.user = this.session.getLoggedInUser(user => {
      this.user = user;
    });
  }

  /**
   * Toggles sidebar being open on mobile.
   * @returns { void }
   */
  public toggle(): void {
    this.sidebarNavigationService.toggle();
  }

  /**
   * Open buy tokens modal after wallet connect prompt if needed.
   * @returns { Promise<void> }
   */
  public async buyTokens(): Promise<void> {
    this.toggle();
    await this.web3WalletService.getCurrentWallet(true);
    await this.buyTokensModalService.open();
  }

  /**
   * Open earn modal.
   * @returns { Promise<void> }
   */
  public async openEarnModal(): Promise<void> {
    this.toggle();
    await this.earnModalService.open();
  }

  /**
   * Open boost modal.
   * @returns { Promise<void> }
   */
  public async openBoostModal() {
    this.toggle();
    await this.boostModalService.open(this.session.getLoggedInUser());
  }

  /**
   * Open composer modal.
   * @returns { Promise<void> }
   */
  public async openComposeModal(): Promise<void> {
    this.toggle();
    await this.composerModalService.setInjector(this.injector).present();
  }

  /**
   * Set visible state.
   * @param { boolean } value - value to set visibility state to.
   * @returns { void }
   */
  public setVisible(value: boolean): void {
    this.hidden = !value;

    if (!value) {
      if (this.host && this.host.viewContainerRef) {
        this.host.viewContainerRef.clear();
      }
    }
  }

  /**
   * Don't click through the menu on mobile.
   * @returns { void }
   */
  public onSidebarNavClick($event): void {
    if (this.layoutMode === 'phone') {
      $event.stopPropagation();
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
   * when the popper is closed.
   * @param $event
   * @returns { void }
   */
  public onSidebarMoreToggle($event): void {
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
