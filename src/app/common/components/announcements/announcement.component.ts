import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { CookieService } from '../../../common/services/cookie.service';

/**
 * Announcement banner. Located at the top of the screen.
 * Dismissable - dismiss history handled by cookies.
 */
@Component({
  selector: 'm-announcement',
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
  styleUrls: ['announcement.component.ng.scss'],
})
export class AnnouncementComponent implements OnInit {
  @Input() id: string = 'default';
  @Input() canClose: boolean = true;
  @Input() remember: boolean = true;

  @HostBinding('hidden') hidden: boolean = false;

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    if (this.cookieService.get('hide-announcement:' + this.id) === '1')
      this.hidden = true;
  }

  close() {
    if (this.remember) {
      this.cookieService.set('hide-announcement:' + this.id, '1');
    }

    this.hidden = true;
  }
}
