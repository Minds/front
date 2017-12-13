import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs/Rx';
import { Session } from '../../../services/session';

@Component({
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
