import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';

@Component({
  moduleId: module.id,
  selector: 'm-media--images--tile',
  templateUrl: 'tile.component.html',
  host: {
    //'[class]': 'm-media--images--tile-' + getFlex() + '-col'
  }
})

export class MediaImagesTileComponent {

  @Input() entity;

  constructor(
    public session: Session,
    public attachment: AttachmentService
  ) {}

  getClass() {
    return 
  }

  getWidth() {
    let width = 320;

    if (!this.entity.width) 
      return width;

    //work out aspect
    let aspect = this.entity.width / this.entity.height;
    //width = width * aspect;

    return width;
  }

}
