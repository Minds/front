import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Session } from '../../../services/session';
import { ScrollService } from '../../../services/ux/scroll';

@Component({
  selector: 'm-modal-signup-on-scroll',
  template: `
    <m-modal-signup open="true" *ngIf="open"></m-modal-signup>
  `
})

export class SignupOnScrollModal {
  open: boolean = false;
  route: string = '';
  scroll_listener;
  minds = window.Minds;

  display: string = 'initial';

  routerSubscription: Subscription;

  constructor(public session: Session, public router: Router, public scroll: ScrollService) {
  }

  ngOnInit() {
    this.listen();
  }

  ngOnDestroy() {
    this.unListen();
  }

  listen() {
    this.routerSubscription = this.router.events.subscribe((navigationEvent: NavigationEnd) => {
      try {
        if (navigationEvent instanceof NavigationEnd) {
          this.unlistenScroll();

          if (!navigationEvent.urlAfterRedirects) {
            return;
          }

          let url = navigationEvent.urlAfterRedirects;

          if (url.indexOf('/') === 0) {
            url = url.substr(1);
          }

          const fragments = url.replace(/\//g, ';').split(';');

          this.route = navigationEvent.urlAfterRedirects;

          switch (fragments[0]) {
            case 'register':
            case 'login':
            case 'forgot-password':
            case '':
              this.open = false;
              break;
            default:
              this.scroll_listener = this.scroll.listen((e) => {
                if (this.scroll.view.scrollTop > 20) {
                  if (window.localStorage.getItem('hideSignupModal'))
                    this.open = false;
                  else
                    this.open = true;
                }
              }, 100);
          }
        }
      } catch (e) {
        console.error('Minds: router hook(SignupOnScrollModal)', e);
      }
    });
  }

  unListen() {
    this.routerSubscription.unsubscribe();
    this.unlistenScroll();
  }

  private unlistenScroll() {
    if (this.scroll_listener) {
      this.scroll.unListen(this.scroll_listener);
    }
  }
}
