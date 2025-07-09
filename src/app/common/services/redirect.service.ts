import { Inject, Injectable, RESPONSE_INIT } from '@angular/core';

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
  constructor(@Inject(RESPONSE_INIT) private res: ResponseInit) {
    super();
  }

  redirect(url: string, permanent: boolean = false): void {
    const code = permanent ? 301 : 302;
    this.res.status = code;
    this.res.headers['Location'] = url;
  }
}
