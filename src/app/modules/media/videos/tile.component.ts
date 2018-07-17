import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';

@Component({
  selector: 'm-media--videos--tile',
  templateUrl: 'tile.component.html',
})

export class MediaVideosTileComponent {
  @Input() entity;

  constructor(public session: Session,
    public attachment: AttachmentService) {}
}
