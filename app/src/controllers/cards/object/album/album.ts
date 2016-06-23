import { Component } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { RouterLink } from "@angular/router-deprecated";

import { Client } from '../../../../services/api';
import { SessionFactory } from '../../../../services/session';
import { Material } from '../../../../directives/material';
import { BUTTON_COMPONENTS } from '../../../../components/buttons';


@Component({
  selector: 'minds-card-album',
  host: {
    'class': 'mdl-card mdl-shadow--2dp'
  },
  inputs: ['object'],
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
