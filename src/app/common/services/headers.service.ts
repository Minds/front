import { Inject, Injectable, RESPONSE_INIT } from '@angular/core';

@Injectable()
export class HeadersService {
  public setCode(code: number): void {}
}

@Injectable()
export class BrowserHeadersService extends HeadersService {
  setCode(code: number): void {
    // nothing to do
  }
}

@Injectable()
export class ServerHeadersService extends HeadersService {
  constructor(@Inject(RESPONSE_INIT) private res: ResponseInit) {
    super();
  }

  setCode(code: number): void {
    this.res.status = code;
  }
}
