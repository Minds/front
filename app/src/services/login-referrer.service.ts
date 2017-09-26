import { Injectable } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Session, SessionFactory } from './session';

type NavigateOptions = {
  extraParams?: string,
  defaultUrl?: string
};

@Injectable()
export class LoginReferrerService {
  private static DEFAULT_URL = '/newsfeed';
  private url: string;
  private exceptions: string[] = [];

  private session: Session = SessionFactory.build();
  private _routerListener: Subscription;

  static _(router: Router) {
    return new LoginReferrerService(router);
  }

  constructor(private router: Router) { }

  listen(): this {
    this._routerListener = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.register(event.urlAfterRedirects || event.url);
      }
    });

    this.session.isLoggedIn(loggedIn => {
      if (!loggedIn) {
        this.unregister();
      }
    });

    return this;
  }

  unlisten(): this {
    this._routerListener.unsubscribe();

    return this;
  }

  register(url: string): this {
    if (!url || this.shouldBeAvoided(url)) {
      return this;
    }

    this.url = this._trim(url);
    return this;
  }

  unregister(): this {
    this.url = void 0;
    return this;
  }

  navigate(options: NavigateOptions = {}): Promise<boolean> {
    let url = this.url || options.defaultUrl || LoginReferrerService.DEFAULT_URL;

    if (options.extraParams) {
      url += `${~url.indexOf('?') ? '&' : '?'}${options.extraParams}`;
    }

    return this.router.navigateByUrl(url, { replaceUrl: true });
  }

  avoid(urls: string[]): this {
    this.exceptions = urls.map(url => this._trim(url));

    return this;
  }

  shouldBeAvoided(url: string): boolean {
    let cleanUrl = this._trim(url);

    if (~cleanUrl.indexOf(';')) {
      cleanUrl = cleanUrl.split(';')[0];
    }

    return !!~this.exceptions.indexOf(cleanUrl);
  }

  // based on: https://stackoverflow.com/a/36391166
  private _trim(s): string {
    const mask = ' /';

    while (~mask.indexOf(s[0])) {
      s = s.slice(1);
    }
    while (~mask.indexOf(s[s.length - 1])) {
      s = s.slice(0, -1);
    }
    return s;
  }
}
