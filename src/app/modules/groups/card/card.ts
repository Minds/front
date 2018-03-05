import { Component, Inject } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-card-group',
  inputs: ['group'],
  templateUrl: 'card.html'
})

export class GroupsCard {

  minds;
  group;

  constructor(public client: Client) {
    this.minds = window.Minds;
  }

}
