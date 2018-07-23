import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-groups--tile',
  templateUrl: 'tile.component.html',
})

export class GroupsTileComponent {

  minds = window.Minds;
  @Input() entity;

  constructor(
    public session: Session
  ) { }
}
