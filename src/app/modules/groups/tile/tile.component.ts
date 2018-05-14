import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'm-groups--tile',
  templateUrl: 'tile.component.html',
})

export class GroupsTileComponent {

  minds = window.Minds;
  @Input() entity;

}
