import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class RequestUrlService {
  protected requestUrl: string;

  constructor(@Inject('REQUEST_URL') @Optional() requestUrl: string) {
    this.requestUrl = isPlatformServer(PLATFORM_ID)
      ? requestUrl
      : window.location.toString();
  }

  get() {
    console.log({
      isPlatformServer: isPlatformServer(PLATFORM_ID),
      requestUrl: this.requestUrl,
    });

    return this.requestUrl;
  }
}
