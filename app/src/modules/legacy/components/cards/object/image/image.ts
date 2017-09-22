import { Component } from '@angular/core';

import { Client } from '../../../../../../services/api';
import { SessionFactory } from '../../../../../../services/session';
import { AttachmentService } from '../../../../../../services/attachment';

@Component({
  moduleId: module.id,
  selector: 'minds-card-image',
  host: {
    'class': 'mdl-card mdl-shadow--2dp'
  },
  inputs: ['object'],
  templateUrl: 'image.html',
})

export class ImageCard {

  entity: any;
  session = SessionFactory.build();
  minds: {};

  constructor(public client: Client, public attachment: AttachmentService) {
    this.minds = window.Minds;
  }

  set object(value: any) {
    this.entity = value;
  }

}
