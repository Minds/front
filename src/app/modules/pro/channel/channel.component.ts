import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
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
import { WireCreatorComponent } from '../../wire/creator/creator.component';

@Component({
  providers: [
    ProChannelService,
    OverlayModalService,
  ],
  selector: 'm-pro--channel',
  templateUrl: 'channel.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProChannelComponent implements OnInit, AfterViewInit, OnDestroy {

  username: string;

  type: string;

  query: string;

  channel: MindsUser;

  inProgress: boolean;

  error: string;

  collapseNavItems: boolean;

  params$: Subscription;

  isMenuOpen: boolean = false;

  channel$: Subscription;

  subscribersCount: number;

  @ViewChild('overlayModal', { static: true }) protected overlayModal: OverlayModalComponent;

  protected isLoggedIn$: Subscription;

  constructor(
    protected element: ElementRef,
    protected session: Session,
    protected channelService: ProChannelService,
    protected client: Client,
    protected title: MindsTitle,
    protected router: Router,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    protected modal: SignupModalService,
    protected modalService: OverlayModalService,
    protected injector: Injector,
  ) {
  }

  ngOnInit() {
    if (window.Minds.pro) {
      this.username = window.Minds.pro.user_guid;
    }

    this.listen();
    this.onResize();

    this.isLoggedIn$ = this.session.loggedinEmitter.subscribe(is => {
      if (!is && this.channel) {
        this.channel.subscribed = false;
      }

      this.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.modalService.setContainer(this.overlayModal);
  }

  listen() {
    this.params$ = this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
      }

      if (params['type']) {
        this.type = params['type'];
        this.setTitle();
      }

      if (this.username && (!this.channel || this.channel.username != this.username)) {
        this.load();
      }
    });

    this.channel$ = this.channelService.subscriptionChange.subscribe(subscribersCount => {
      this.subscribersCount = subscribersCount;
      this.load();
    })
  }

  setTitle() {
    if (!this.channel) {
      this.title.setTitle(this.username || 'Minds Pro');
      return;
    }

    const title = [this.channel.pro_settings.title as string || this.channel.name || this.channel.username];

    switch (this.type) {
      case 'feed':
        title.push('Feed');
        break;
      case 'videos':
        title.push('Videos');
        break;
      case 'images':
        title.push('Images');
        break;
      case 'articles':
        title.push('Articles');
        break;
      case 'groups':
        title.push('Groups');
        break;
      case 'donate':
        title.push('Donate');
        break;
    }

    if (this.channel.pro_settings.headline) {
      title.push(this.channel.pro_settings.headline);
    }

    this.title.setTitle(title.join(' - '));
  }

  ngOnDestroy() {
    if (this.params$) {
      this.params$.unsubscribe();
    }
    if (this.channel$) {
      this.channel$.unsubscribe();
    }

    this.isLoggedIn$.unsubscribe();
  }

  async load() {
    if (!this.username) {
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      await this.channelService.auth();
      this.channel = await this.channelService.load(this.username);
      this.subscribersCount = this.channel.subscribers_count;
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
        this.router.navigate(
          window.Minds.pro ?
            this.channelService.getRouterLink('login') :
            ['/login']
        );

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
        .style.setProperty(`--m-pro--${styleAttr}`, styles[style]);
    }
  }

  wire() {
    this.modalService.create(WireCreatorComponent,
      this.channelService.currentChannel,
      { onComplete: () => {} }
    ).present();
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  search(): Promise<boolean> {
    return this.router.navigate(this.channelService.getRouterLink('all', { query: this.query }));
  }

  clearSearch() {
    this.query = '';
    // TODO: Do this!
    // const cleanUrl = this.router.url.split(';')[0];
    // this.router.navigate([cleanUrl]);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get currentUser() {
    if (!this.session.isLoggedIn()) {
      return null;
    }

    return this.session.getLoggedInUser();
  }

  get homeRouterLink() {
    return this.channelService.getRouterLink('home');
  }

  get feedRouterLink() {
    let params;

    if (this.query) {
      params = { query: this.query };
    }

    return this.channelService.getRouterLink('feed', params);
  }

  get videosRouterLink() {
    let params;

    if (this.query) {
      params = { query: this.query };
    }

    return this.channelService.getRouterLink('videos', params);
  }

  get imagesRouterLink() {
    let params;

    if (this.query) {
      params = { query: this.query };
    }

    return this.channelService.getRouterLink('images', params);
  }

  get articlesRouterLink() {
    let params;

    if (this.query) {
      params = { query: this.query };
    }

    return this.channelService.getRouterLink('articles', params);
  }

  get groupsRouterLink() {
    return this.channelService.getRouterLink('groups');
  }

  get proSettingsLink() {
    return ['/pro/settings'];
  }

  get proSettingsHref() {
    return window.Minds.site_url + 'pro/settings';
  }

  get isStandalone() {
    return Boolean(window.Minds.pro);
  }
}
