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

import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';
import { GroupsSidebarMarkersComponent } from '../../../modules/groups/sidebar-markers/sidebar-markers.component';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { SidebarNavigationService } from './navigation.service';
import { ConfigsService } from '../../services/configs.service';
import { MindsUser } from '../../../interfaces/entities';
import { FeaturesService } from '../../../services/features.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserMenuService } from '../v3-topbar/user-menu/user-menu.service';
import { BuyTokensModalService } from '../../../modules/blockchain/token-purchase/v2/buy-tokens-modal.service';
import { Web3WalletService } from '../../../modules/blockchain/web3-wallet.service';
import { UniswapModalService } from '../../../modules/blockchain/token-purchase/v2/uniswap/uniswap-modal.service';
import { EarnModalService } from '../../../modules/blockchain/earn/earn-modal.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { BoostCreatorComponent } from '../../../modules/boost/creator/creator.component';
import { BoostModalLazyService } from '../../../modules/boost/modal/boost-modal-lazy.service';
import { ModalService as ComposerModalService } from '../../../modules/composer/components/modal/modal.service';
@Component({
  selector: 'm-sidebar--navigation',
  templateUrl: 'navigation.component.html',
  styleUrls: ['./navigation.component.ng.scss'],
})
export class SidebarNavigationComponent
  implements OnInit, AfterViewInit, OnDestroy {
  readonly cdnUrl: string;
  readonly cdnAssetsUrl: string;
  readonly chatUrl: string;

  @ViewChild(DynamicHostDirective, { static: true })
  host: DynamicHostDirective;

  user;

  componentRef;
  groupsSidebar: GroupsSidebarMarkersComponent;

  layoutMode: 'phone' | 'tablet' | 'desktop' = 'desktop';
  showLabels: boolean = false;

  settingsLink: string = '/settings';

  @HostBinding('class.m-sidebarNavigation--opened')
  isOpened: boolean = false;

  @HostBinding('hidden')
  hidden: boolean = false;

  groupSelectedSubscription: Subscription = null;
  plusPageActive: boolean = false;

  routerSubscription: Subscription;

  matrixFeature: boolean = false;

  constructor(
    public navigation: NavigationService,
    public session: Session,
    private service: SidebarNavigationService,
    protected configs: ConfigsService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    @Inject(PLATFORM_ID) private platformId: Object,
    private featuresService: FeaturesService,
    private route: ActivatedRoute,
    private router: Router,
    private userMenu: UserMenuService,
    private buyTokensModalService: BuyTokensModalService,
    private web3WalletService: Web3WalletService,
    private boostModalService: BoostModalLazyService,
    private earnModalService: EarnModalService,
    private composerModalService: ComposerModalService,
    private injector: Injector
  ) {
    this.cdnUrl = this.configs.get('cdn_url');
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
    this.chatUrl = this.configs.get('matrix')?.chat_url;
    this.service.setContainer(this);
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

    this.matrixFeature = this.featuresService.has('matrix');

    this.settingsLink = '/settings';
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createGroupsSideBar();
    }
  }

  ngOnDestroy(): void {
    if (this.groupSelectedSubscription) {
      this.groupSelectedSubscription.unsubscribe();
    }
  }

  getUser() {
    this.user = this.session.getLoggedInUser(user => {
      this.user = user;
    });
  }

  createGroupsSideBar() {
    if (this.matrixFeature) {
      return;
    }
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        GroupsSidebarMarkersComponent
      ),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.groupsSidebar = this.componentRef.instance;
    this.groupsSidebar.showLabels = true;
    this.groupsSidebar.leftSidebar = true;
    this.groupSelectedSubscription = this.componentRef.instance.onGroupSelected.subscribe(
      data => {
        if (data) {
          this.toggle();
        }
      }
    );
  }

  toggle(): void {
    if (this.layoutMode === 'phone') {
      this.isOpened = !this.isOpened;
    }
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
    await this.composerModalService
      .setInjector(this.injector)
      .present()
      .toPromise();
  }

  setVisible(value: boolean): void {
    this.hidden = !value;

    if (value) {
      if (isPlatformBrowser(this.platformId)) {
        this.createGroupsSideBar();
      }
    } else {
      this.host.viewContainerRef.clear();
    }
  }

  /**
   * Closes the user menu if it's open
   */
  onSidebarNavClick(): void {
    this.userMenu.isOpen$.next(false);
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
      this.isOpened = false;
    }

    if (this.groupsSidebar) {
      this.groupsSidebar.showLabels = this.showLabels;
    }
  }
}
