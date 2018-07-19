import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Client } from '../../../services/api/client';

@Component({
  selector: 'm-cookies-notice',
  templateUrl: 'notice.component.html'
})

export class DismissableNoticeComponent {
  @Input() @HostBinding('hidden') hidden: boolean = false;
  @Output('buttonClick') buttonClick: EventEmitter<any> = new EventEmitter<any>();

  cookiesEnabled: boolean = true;

  constructor(private client: Client) {
    this.checkCookies();
  }

  checkCookies() {
    this.cookiesEnabled = document.cookie.indexOf('disable_cookies') === -1;
  }

  dismiss() {
    this.hidden = true;
  }

  toggleCookies(value) {
    if (value || (!value && confirm('Are you sure you want to disable cookies?'))) {
      this.cookiesEnabled = value;
    }

    const url = 'api/v2/cookies';

    if (this.cookiesEnabled) {
      this.client.post(url);
    } else {
      this.client.delete(url);
    }
  }

}