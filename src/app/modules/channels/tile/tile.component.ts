import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-channels--tile',
  templateUrl: 'tile.component.html',
})

export class ChannelsTileComponent {

  @Input() entity;
  minds = window.Minds;

  constructor(
    public session: Session
  ) { }

}
