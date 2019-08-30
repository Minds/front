import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProChannelService } from '../channel.service';

@Component({
  selector: 'm-pro__hamburger-menu',
  templateUrl: 'hamburger-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProHamburgerMenu {
  constructor(
    protected service: ProChannelService
  ) { }

  toggleMenu() {
    if (document.body) {
      if (document.body.classList.contains('hamburger-menu--open')) {
        document.body.classList.remove('hamburger-menu--open');
      } else {
        document.body.classList.add('hamburger-menu--open');
      }
    }
  }

  closeMenu() {
    if (document.body && document.body.classList.contains('hamburger-menu--open')) {
      document.body.classList.remove('hamburger-menu--open');
    }
  }

  get homeRouterLink() {
    return this.service.getRouterLink('home');
  }

  get feedRouterLink() {
    return this.service.getRouterLink('feed');
  }

  get videosRouterLink() {
    return this.service.getRouterLink('videos');
  }

  get imagesRouterLink() {
    return this.service.getRouterLink('images');
  }

  get articlesRouterLink() {
    return this.service.getRouterLink('articles');
  }

  get groupsRouterLink() {
    return this.service.getRouterLink('groups');
  }

  wire() {
    this.service.wire();
  }

  get items() {
    return this.service.getMenuNavItems();
  }

  get channel() {
    return this.service.currentChannel;
  }
}
