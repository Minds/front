import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Injector,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Session } from "../../../services/session";
import { Subscription } from "rxjs";
import { MindsUser } from "../../../interfaces/entities";
import { Client } from "../../../services/api/client";
import { MindsTitle } from '../../../services/ux/title';
import { ProChannelService } from './channel.service';
import { SignupModalService } from '../../../modules/modals/signup/service';
import { OverlayModalService } from "../../../services/ux/overlay-modal";
import { ProUnsubscribeModalComponent } from './unsubscribe-modal/modal.component';
import { OverlayModalComponent } from '../../../common/components/overlay-modal/overlay-modal.component';

@Component({
  providers: [
    ProChannelService,
    OverlayModalService,
  ],
  selector: 'm-pro--channel',
  templateUrl: 'channel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProChannelComponent implements OnInit, AfterViewInit, OnDestroy {

  username: string;

  channel: MindsUser;

  inProgress: boolean;

  error: string;

  collapseNavItems: boolean;

  params$: Subscription;

  childParams$: Subscription;

  searchedText: string;

  routerSubscription: Subscription;

  currentURL: string;

  query: string;

  isMenuOpen: boolean = false;

  channelSubscription$: Subscription;

  subscribers_count: number;

  @ViewChild('overlayModal', { static: true }) protected overlayModal: OverlayModalComponent;

  constructor(
    protected element: ElementRef,
    protected session: Session,
    protected channelService: ProChannelService,
    protected client: Client,
    protected title: MindsTitle,
    protected router: Router,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    public modal: SignupModalService,
    protected modalService: OverlayModalService,
    protected injector: Injector,
  ) {
  }

  ngOnInit() {
    this.listen();
    this.onResize();
  }

  ngAfterViewInit() {
    this.modalService.setContainer(this.overlayModal);
  }

  listen() {
    this.routerSubscription = this.router.events.subscribe((navigationEvent) => {
      try {
        if (navigationEvent instanceof NavigationEnd) {
          if (!navigationEvent.urlAfterRedirects) {
            return;
          }

          this.currentURL = navigationEvent.urlAfterRedirects;
          this.setTitle();
        }
      } catch (e) {
        console.error('Minds: router hook(SearchBar)', e);
      }
    });

    this.params$ = this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
      }

      if (this.username && (!this.channel || this.channel.username != this.username)) {
        this.load();
      }
    });

    this.channelSubscription$ = this.channelService.subscriptionChange.subscribe((subscribers_count) => {
      this.subscribers_count = subscribers_count;
      this.load();
    })
  }

  setTitle() {
    let title = this.channel.pro_settings.title as string || this.channel.name;

    const childRoute = this.route.children.length > 0 ? this.route.children[0].snapshot : null;

    if (childRoute && childRoute.params['type']) {
      title += ` - ${childRoute.params['type']}`;
    }

    if (this.channel.pro_settings.headline) {
      title += ` - ${this.channel.pro_settings.headline}`;
    }


    this.title.setTitle(title);
  }

  ngOnDestroy() {
    this.params$.unsubscribe();
    this.childParams$.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  async load() {
    if (!this.username) {
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      this.channel = await this.channelService.load(this.username);
      this.subscribers_count = this.channel.subscribers_count;
      this.bindCssVariables();
      this.setTitle();
    } catch (e) {
      this.error = e.getMessage();
    }

    this.detectChanges();
  }

  toggleSubscription($event) {
    $event.preventDefault();
    $event.stopPropagation();

    if (!this.channel.subscribed) {
      if (!this.session.isLoggedIn()) {
        this.router.navigate(['/pro', this.channel.username, 'signup']);
        return false;
      }

      this.channelService.subscribe();
    } else {
      this.modalService
        .create(ProUnsubscribeModalComponent, this.channel,
          {
            class: 'm-overlayModal--unsubscribe'
          }, this.injector)
        .present();
    }
  }

  bindCssVariables() {
    const styles = this.channel.pro_settings.styles;

    for (const style in styles) {
      if (!styles.hasOwnProperty(style)) {
        continue;
      }

      let value = styles[style].trim();

      if (!value) {
        continue;
      }

      const styleAttr = style.replace(/_/g, "-");
      this.element.nativeElement
        .style.setProperty(`--${styleAttr}`, styles[style]);
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  @HostBinding('style.backgroundImage') get backgroundImageCssValue() {
    if (!this.channel) {
      return 'none';
    }

    return `url(${this.channel.pro_settings.background_image})`;
  }

  @HostBinding('class') get cssColorSchemeOverride() {
    if (!this.channel) {
      return '';
    }

    return `m-theme--wrapper__${this.channel.pro_settings.scheme || 'light'}`;
  }

  @HostListener('window:resize') onResize() {
    this.collapseNavItems = window.innerWidth <= 992;
  }

  get currentUser() {
    if (!this.session.isLoggedIn()) {
      return null;
    }

    return this.session.getLoggedInUser();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  search() {
    this.router.navigate([this.getCurrentURL(), { query: this.searchedText, period: '24h' }]);
  }

  clearSearch() {
    this.searchedText = '';
    const cleanUrl = this.router.url.split(';')[0];
    this.router.navigate([cleanUrl]);
  }

  get linkTo() {
    return this.channelService.linkTo.bind(this.channelService);
  }

  getCurrentURL() {
    let currentURL = this.currentURL;
    if (!currentURL) {
      currentURL = `/pro/${this.channel.username}/articles`; //TODO ADD /TOP when algorithm is enabled
    } else if (currentURL.includes(';')) {
      currentURL = this.currentURL.split(';')[0];
    }

    return currentURL;
  }
}
