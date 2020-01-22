import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Session } from '../../../services/session';
import { ScrollService } from '../../../services/ux/scroll';
import { SignupModal } from './signup';
import { Storage } from '../../../services/storage';

@Component({
  selector: 'm-modal-signup-on-scroll',
  template: `
    <m-modal-signup (onClose)="onModalClosed()" #modal></m-modal-signup>
  `,
})
export class SignupOnScrollModal implements OnInit, OnDestroy {
  // paths for scroll listener to ignore.
  public static excludedPaths: Array<string> = [
    '/login',
    '/register',
    '/forgot-password',
    '/',
  ];

  open: boolean = false;
  route: string = '';
  scroll_listener;
  minds = window.Minds;

  display: string = 'initial';

  routerSubscription: Subscription;

  @Input() disableScrollListener = false;

  @ViewChild('modal', { static: true }) modal: SignupModal;

  constructor(
    public session: Session,
    public router: Router,
    public scroll: ScrollService,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.listen();
  }

  ngOnDestroy() {
    this.unListen();
  }

  listen() {
    if (
      this.disableScrollListener ||
      this.session.getLoggedInUser() ||
      this.storage.get('hideSignupModal')
    ) {
      return;
    }

    this.routerSubscription = this.router.events.subscribe(
      (navigationEvent: NavigationEnd) => {
        try {
          if (navigationEvent instanceof NavigationEnd) {
            this.unlistenScroll(); // unlisten to any previous listeners.

            let url = navigationEvent.urlAfterRedirects;

            if (!url) {
              return;
            }

            this.route = url;

            // return if we're on an excluded path.
            for (let excludedPath of SignupOnScrollModal.excludedPaths) {
              if (excludedPath.indexOf(this.route) > -1) {
                this.open = false;
                this.modal.open = false;
                return;
              }
            }

            // set up scroll listener to trigger modal.
            this.scroll_listener = this.scroll.listen(e => {
              if (this.scroll.view.scrollTop > 20) {
                this.open = true;
                this.modal.open = true;
              }
            }, 100);
          }
        } catch (e) {
          console.error('Minds: router hook(SignupOnScrollModal)', e);
        }
      }
    );
  }

  unListen() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    this.unlistenScroll();
  }

  private unlistenScroll() {
    if (this.scroll_listener) {
      this.scroll.unListen(this.scroll_listener);
    }
  }

  onModalClosed() {
    if (this.open) {
      this.storage.set('hideSignupModal', '1');
      this.open = false;
    }
  }
}
