import { Component } from '@angular/core';

import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { AttachmentService } from '../../../../services/attachment';

@Component({
  selector: 'm-media--grid',
  inputs: ['_object: object'],
  template: `
    <a *ngFor="let item of items"
    [routerLink]="['/media', item.guid]"
    [ngClass]="{ 'm-mature-thumbnail': attachment.shouldBeBlurred(item) }"
    >
      <img src="/fs/v1/thumbnail/{{item.guid}}/large" />
      <span class="material-icons" [hidden]="item.subtype !='video'">play_circle_outline</span>
      <i class="material-icons">explicit</i>
    </a>
    <infinite-scroll
        distance="25%"
        (load)="load()"
        [moreData]="moreData"
        [inProgress]="inProgress"
        style="width:100%">
    </infinite-scroll>
  `
})

export class MediaGridComponent {

  object: any = {};

  items: Array<any> = [];
  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';

  constructor(public session: Session, public client: Client, public attachment: AttachmentService) {
  }

  set _object(value: any) {
    this.object = value;
    this.load();
  }

  load() {
    var self = this;
    if (this.inProgress)
      return;
    this.inProgress = true;
    this.client.get('api/v1/media/albums/' + this.object.guid, { offset: this.offset })
      .then((response: any) => {
        if (!response.entities || response.entities.length === 0) {
          self.inProgress = false;
          self.moreData = false;
          return false;
        }

        self.items = self.items.concat(response.entities);
        self.offset = response['load-next'];
        self.inProgress = false;
      });
  }

}
