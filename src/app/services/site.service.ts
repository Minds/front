import { Injectable } from '@angular/core';

@Injectable()
export class SiteService {
  isProDomain() {
    return Boolean(window.Minds.pro);
  }

  get title() {
    return this.isProDomain() ? window.Minds.pro.title || '' : 'Minds';
  }
}
