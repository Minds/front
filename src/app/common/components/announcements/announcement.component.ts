import { Component, EventEmitter, Input, OnInit } from '@angular/core';

import { Storage } from '../../../services/storage';
import { Client } from '../../../services/api';
import { CookieService } from '../../../common/services/cookie.service';

@Component({
  selector: 'm-announcement',
  host: {
    '[hidden]': 'hidden',
  },
  template: `
    <div class="m-announcement">
      <div class="m-announcement--content">
        <ng-content></ng-content>
      </div>

      <div class="m-announcement--close" *ngIf="canClose" (click)="close()">
        <i class="material-icons">close</i>
      </div>
    </div>
  `,
})
export class AnnouncementComponent implements OnInit {
  hidden: boolean = false;
  @Input() id: string = 'default';
  @Input() canClose: boolean = true;
  @Input() remember: boolean = true;

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    if (this.cookieService.get('hide-announcement:' + this.id) === '1')
      this.hidden = true;
  }

  close() {
    if (this.remember) {
      this.cookieService.put('hide-announcement:' + this.id, '1');
    }

    this.hidden = true;
  }
}
