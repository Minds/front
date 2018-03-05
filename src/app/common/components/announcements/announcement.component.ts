import { Component, EventEmitter, Input } from '@angular/core';

import { Storage } from '../../../services/storage';
import { Client } from '../../../services/api';

@Component({
  selector: 'm-announcement',
  host: {
    '[hidden]': 'hidden'
  },
  template: `
    <div class="m-announcement">


      <div class="m-announcement--content">
        <ng-content></ng-content>
      </div>

      <div class="m-announcement--close" (click)="close()">
        <i class="material-icons">close</i>
      </div>

    </div>
  `
})

export class AnnouncementComponent {

  minds: Minds = window.Minds;
  hidden: boolean = false;
  @Input() id: string = 'default';

  constructor(private storage: Storage) {
  }

  ngOnInit() {
    if (this.storage.get('hide-announcement:' + this.id))
      this.hidden = true;
  }

  close() {
    this.storage.set('hide-announcement:' + this.id, true);
    this.hidden = true;
  }

}
