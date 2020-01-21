import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { Storage } from '../../../services/storage';
import { SiteService } from '../../services/site.service';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'm-cookies-notice',
  templateUrl: 'notice.component.html',
})
export class DismissableNoticeComponent {
  @Input() @HostBinding('hidden') hidden: boolean = false;
  @Output('buttonClick') buttonClick: EventEmitter<any> = new EventEmitter<
    any
  >();

  cookiesEnabled: boolean = true;

  constructor(
    private client: Client,
    private cookieService: CookieService,
    private site: SiteService
  ) {
    if (this.cookieService.get('cookies-notice-dismissed') === '1') {
      this.hidden = true;
    }
    this.checkCookies();
  }

  checkCookies() {
    this.cookiesEnabled = !this.cookieService.get('disable_cookies');
  }

  dismiss() {
    this.cookieService.put('cookies-notice-dismissed', '1');
    this.hidden = true;
  }

  toggleCookies(value) {
    if (
      value ||
      (!value && confirm('Are you sure you want to disable cookies?'))
    ) {
      this.cookiesEnabled = value;
    }

    const url = 'api/v2/cookies';

    if (this.cookiesEnabled) {
      this.client.post(url);
    } else {
      this.client.delete(url);
    }
  }

  get siteTitle() {
    return this.site.title;
  }
}
