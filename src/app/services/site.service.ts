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

  get oneLineHeadline(): string {
    return this.isProDomain ? this.pro.one_line_headline || '' : '';
  }

  get isAdmin(): boolean {
    return window.Minds.Admin;
  }
}
