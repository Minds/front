import { Component } from '@angular/core';

import { Client } from '../../../../../../services/api';
import { Session } from '../../../../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-card-album',
  host: {
    'class': 'mdl-card mdl-shadow--2dp'
  },
  inputs: ['object'],
  templateUrl: 'album.html'
})

export class AlbumCard {

  entity: any;
  minds: {};

  constructor(public session: Session, public client: Client) {
    this.minds = window.Minds;
  }

  set object(value: any) {
    this.entity = value;
  }

}
