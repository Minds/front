import { Component, EventEmitter, Input, OnInit } from '@angular/core';

import { Storage } from '../../../services/storage';
import { Client } from '../../../services/api';

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
  minds: Minds = window.Minds;
  hidden: boolean = false;
  @Input() id: string = 'default';
  @Input() canClose: boolean = true;
  @Input() remember: boolean = true;

  constructor(private storage: Storage) {}

  ngOnInit() {
    if (this.storage.get('hide-announcement:' + this.id)) this.hidden = true;
  }

  close() {
    if (this.remember) {
      this.storage.set('hide-announcement:' + this.id, true);
    }

    this.hidden = true;
  }
}
