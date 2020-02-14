import { Inject, Injectable } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';

export class RedirectService {
  public redirect(url: string): void {}
}

export class BrowserRedirectService extends RedirectService {
  redirect(url: string): void {
    window.location.href = url;
  }
}

export class ServerRedirectService extends RedirectService {
  constructor(@Inject(RESPONSE) private res) {
    super();
  }

  redirect(url: string, permanent: boolean = false): void {
    const code = permanent ? 301 : 302;
    this.res.redirect(code, url);
    this.res.end();
  }
}
