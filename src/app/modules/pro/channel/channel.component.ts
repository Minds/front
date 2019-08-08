import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from "@angular/router";
import { Session } from "../../../services/session";
import { Subscription } from "rxjs";
import { MindsUser, Tag } from "../../../interfaces/entities";
import { Client } from "../../../services/api/client";
import { MindsTitle } from '../../../services/ux/title';
import { ProChannelService } from './channel.service';

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

  searchedText: string;

  routerSubscription: Subscription;

  currentURL: string;

  query: string;

  isMenuOpen: boolean = false;

  showCategories: boolean = true;

  constructor(
    protected element: ElementRef,
    protected session: Session,
    protected channelService: ProChannelService,
    protected client: Client,
    protected title: MindsTitle,
    protected router: Router,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.listen();
    this.onResize();
  }

  shouldShowCategories(type: string) {
    const routes = ['images', 'videos', 'articles', 'feed', 'groups'];
    this.showCategories = routes.indexOf(type) !== -1;
  }

  listen() {
    this.routerSubscription = this.router.events.subscribe((navigationEvent) => {
      try {
        if (navigationEvent instanceof NavigationEnd) {
          if (!navigationEvent.urlAfterRedirects) {
            return;
          }

          this.currentURL = navigationEvent.urlAfterRedirects;
          const type = this.currentURL.split('/');
          this.shouldShowCategories(type[type.length - 1]);
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

      if (this.route.children.length > 0) {
        this.shouldShowCategories(this.route.children[0].snapshot.params.type);
      }

      if (this.username && (!this.channel || this.channel.username != this.username)) {
        this.load();
      }
    });
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

      this.bindCssVariables();
      this.setTitle();
    } catch (e) {
      this.error = e.getMessage();
    }

    this.detectChanges();
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
    if (!this.currentURL) {
      this.currentURL = `/pro/${this.channel.username}/articles`; //TODO ADD /TOP when algorithm is enabled
    } else {
      if (this.currentURL.includes('query')) {
        this.currentURL = this.currentURL.split(';')[0];
      }
    }

    this.router.navigate([this.currentURL, { query: this.searchedText, period: '24h' }]);
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
    this.channelService.setSelectedHashtag(clickedTag);

    for (let tag of this.channel.pro_settings.tag_list) {
      tag.selected = tag.tag == clickedTag.tag;
    }

    this.detectChanges();
  }
}
