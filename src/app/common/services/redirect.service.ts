import { Inject, Injectable } from '@angular/core';
import { RESPONSE } from '../../../express.tokens';

@Injectable()
export class RedirectService {
  public redirect(url: string): void {}
}

@Injectable()
export class BrowserRedirectService extends RedirectService {
  redirect(url: string): void {
    window.location.href = url;
  }
}

@Injectable()
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
