import { Component, Input } from '@angular/core';

import { Client } from '../../../../../../services/api';
import { Session } from '../../../../../../services/session';
import { AttachmentService } from '../../../../../../services/attachment';

@Component({
  moduleId: module.id,
  selector: 'minds-card-video',
  host: {
    class: 'mdl-card mdl-shadow--2dp',
  },
  templateUrl: 'video.html',
})
export class VideoCard {
  entity: any;

  @Input('object') set object(value: any) {
    this.entity = value;
  }

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService
  ) {}
}
