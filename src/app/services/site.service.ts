import { Injectable } from '@angular/core';

@Injectable()
export class SiteService {
  get pro() {
    return window.Minds.pro;
  }

  get isProDomain(): boolean {
    return Boolean(this.pro);
  }

  get title(): string {
    return this.isProDomain ? this.pro.title || '' : 'Minds';
  }

  get isAdmin(): boolean {
    return window.Minds.Admin;
  }
}
