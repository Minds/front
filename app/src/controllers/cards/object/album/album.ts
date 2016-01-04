import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../../services/api';
import { SessionFactory } from '../../../../services/session';
import { Material } from '../../../../directives/material';
import { BUTTON_COMPONENTS } from '../../../../components/buttons';


@Component({
  selector: 'minds-card-album',
  viewBindings: [ Client ],
  host: {
    'class': 'mdl-card mdl-shadow--2dp'
  },
  properties: ['object']
})
@View({
  templateUrl: 'src/controllers/cards/object/album/album.html',
  directives: [ CORE_DIRECTIVES, BUTTON_COMPONENTS, Material, RouterLink]
})

export class AlbumCard {
  entity : any;
  session = SessionFactory.build();
  minds: {};

	constructor(public client: Client){
    this.minds = window.Minds;
	}

  set object(value: any) {
    this.entity = value;
  }

}
