import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class RequestUrlService {
  constructor(
    @Inject('REQUEST_URL') @Optional() protected requestUrl: string
  ) {}

  get() {
    console.log({
      isPlatformServer: isPlatformServer(PLATFORM_ID),
      requestUrl: this.requestUrl,
    });

    return isPlatformServer(PLATFORM_ID)
      ? this.requestUrl
      : window.location.toString();
  }
}
