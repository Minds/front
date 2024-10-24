import { Inject, Injectable } from '@angular/core';
import { RESPONSE } from '../../../express.tokens';

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
  constructor(@Inject(RESPONSE) private res) {
    super();
  }

  setCode(code: number): void {
    this.res.status(code);
  }
}
