import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs/Rx';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-media--videos--tile',
  templateUrl: 'tile.component.html',
})

export class MediaVideosTileComponent {
  @Input() entity;

  constructor(public session: Session) {}
}
