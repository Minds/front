import { EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ScrollService } from '../../../services/ux/scroll';
import { Subscription } from 'rxjs/Rx';

export class SignupModalService {

  defaultSubtitle: string = 'Signup to comment, upload, vote and earn 100+ free views on your content daily.';
  subtitle: string = this.defaultSubtitle;
  isOpen: EventEmitter<any> = new EventEmitter();
  display: EventEmitter<any> = new EventEmitter();

  route: string;
  scroll_listener;

  routerSubscription: Subscription;

  static _(router: Router, scroll: ScrollService) {
    return new SignupModalService(router, scroll);
  }

  constructor(private router: Router, public scroll: ScrollService) {
    console.log('modal service constructed');
    this.initOnScroll();
  }

  open(): SignupModalService {
    this.isOpen.next(true);
    return this;
  }

  close(): SignupModalService {
    this.isOpen.next(false);
    this.display.next('initial');
    this.subtitle = this.defaultSubtitle;
    return this;
  }

  setSubtitle(text: string): SignupModalService {
    this.subtitle = text;
    return this;
  }

  setDisplay(display: string): SignupModalService {
    this.display.next(display);
    return this;
  }

  private initOnScroll() {
    this.routerSubscription = this.router.events.subscribe((navigationEvent: NavigationEnd) => {
      try {
        if (navigationEvent instanceof NavigationEnd) {
          if (!navigationEvent.urlAfterRedirects) {
            return;
          }

          let url = navigationEvent.urlAfterRedirects;

          if (url.indexOf('/') === 0) {
            url = url.substr(1);
          }

          let fragments = url.replace(/\//g, ';').split(';');

          this.route = navigationEvent.urlAfterRedirects;

          switch (fragments[0]) {
            case 'register':
            case 'login':
            case 'forgot-password':
            case 'plus':
            case 'monetization':
            case 'affiliates':
            case '':
              this.close();
              break;
            default:
              if (this.scroll_listener)
                return;
              this.scroll_listener = this.scroll.listen((e) => {
                if (this.scroll.view.scrollTop > 100) {
                  if (window.localStorage.getItem('hideSignupModal'))
                    this.close();
                  else
                    this.open();
                  this.scroll.unListen(this.scroll_listener);
                }
              }, 100);
          }
        }
      } catch (e) {
        console.error('Minds: router hook(SignupModalService)', e);
      }
    });
  }
}
