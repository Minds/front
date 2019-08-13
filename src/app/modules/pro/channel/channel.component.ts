import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  Injector
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

@Component({
  providers: [
    ProChannelService,
  ],
  selector: 'm-pro--channel',
  templateUrl: 'channel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProChannelComponent implements OnInit, OnDestroy {

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

  showCategories: boolean = true;

  channelSubscription$: Subscription;

  subscribers_count: number;

  type: string = 'articles';

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

  shouldShowCategories(type: string) {
    const routes = ['images', 'videos', 'articles', 'feed', 'communities'];
    this.showCategories = routes.indexOf(type) !== -1;

    if (this.showCategories) {
      this.type = type;
    }

    this.detectChanges();
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

    this.childParams$ = this.channelService.childParamsChange.subscribe((params) => {
      this.shouldShowCategories(params.type);
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

  subscribe(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/pro', this.channel.username, 'signup']);
      return false;
    }

    this.channelService.subscribe();
  }

  unsubscribe(e) {
    this.modalService
      .create(ProUnsubscribeModalComponent, this.channel,
        {
          class: 'm-overlayModal--unsubscribe'
        }, this.injector)
      .present();
  }

  bindCssVariables() {
    const styles = this.channel.pro_settings.styles;
    const modal: HTMLElement = document.querySelector('m-app m-overlay-modal');

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
      modal.style.setProperty(`--${styleAttr}`, styles[style]);
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
    this.collapseNavItems = window.innerWidth <= 992 ? true : false;
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

  selectTag(clickedTag: any) {
    for (let tag of this.channel.pro_settings.tag_list) {
      tag.selected = tag.tag == clickedTag.tag;
    }

    const params = {
      ...this.getCurrentURLParams()
    };

    params['hashtag'] = clickedTag.tag;

    this.router.navigate([this.getCurrentURL(), params]);

    this.detectChanges();
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

  getCurrentURLParams() {
    const params = {};
    if (this.currentURL) {
      const paramsArray = this.currentURL.split(';');
      for (let i: number = 1; i < paramsArray.length; ++i) {
        const p = paramsArray[i];
        let pp = p.split('=');
        params[pp[0]] = pp[1];
      }
    }
    return params;
  }
}
