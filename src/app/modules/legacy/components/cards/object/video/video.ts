import { Component, Input } from '@angular/core';

import { Client } from '../../../../../../services/api';
import { Session } from '../../../../../../services/session';
import { AttachmentService } from '../../../../../../services/attachment';

@Component({
  moduleId: module.id,
  selector: 'minds-card-video',
  host: {
    'class': 'mdl-card mdl-shadow--2dp'
  },
  inputs: ['object'],
  templateUrl: 'video.html',
})

export class VideoCard {

  entity: any;
  minds: {};

  @Input() target: '_blank' | '_self' = '_self';

  @Input('object') set object(value: any) {
    this.entity = value;
  }

  constructor(public session: Session, public client: Client, public attachment: AttachmentService) {
    this.minds = window.Minds;
  }

}
