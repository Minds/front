import { Injectable } from '@angular/core';

@Injectable()
export class SiteService {
  get pro() {
    return window.Minds.pro;
  }

  get isProDomain() {
    return Boolean(this.pro);
  }

  get title() {
    return this.isProDomain ? this.pro.title || '' : 'Minds';
  }
}
