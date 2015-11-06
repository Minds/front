import { Component, View, CORE_DIRECTIVES, NgStyle } from 'angular2/angular2';
import { RouterLink } from "angular2/router";
import { Client } from 'src/services/api';
import { SessionFactory } from 'src/services/session';
import { Material } from 'src/directives/material';
import { BUTTON_COMPONENTS } from 'src/components/buttons';

@Component({
  selector: 'minds-card-album',
  viewBindings: [ Client ],
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
