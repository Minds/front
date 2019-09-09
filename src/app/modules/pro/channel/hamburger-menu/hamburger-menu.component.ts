import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ProChannelService } from '../channel.service';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-pro__hamburger-menu',
  templateUrl: 'hamburger-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProHamburgerMenu {
  @Input() query: string = '';

  @Output() queryChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() onSearch: EventEmitter<void> = new EventEmitter<void>();

  @Output() onClearSearch: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    protected service: ProChannelService,
    protected session: Session
  ) {}

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
    if (
      document.body &&
      document.body.classList.contains('hamburger-menu--open')
    ) {
      document.body.classList.remove('hamburger-menu--open');
    }
  }

  wire() {
    this.service.wire();
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

  get items() {
    return this.service.getMenuNavItems();
  }

  get channel() {
    return this.service.currentChannel;
  }

  get currentUser() {
    if (!this.session.isLoggedIn()) {
      return null;
    }

    return this.session.getLoggedInUser();
  }
}
