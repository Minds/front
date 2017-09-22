import { Component } from '@angular/core';

import { Client } from '../../../../../../services/api';
import { SessionFactory } from '../../../../../../services/session';

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
  session = SessionFactory.build();
  minds: {};

  constructor(public client: Client) {
    this.minds = window.Minds;
  }

  set object(value: any) {
    this.entity = value;
  }

}
