import { Component, View, CORE_DIRECTIVES, NgStyle } from 'angular2/angular2';
import { RouterLink } from "angular2/router";
import { Client } from '../../../../services/api';
import { SessionFactory } from '../../../../services/session';
import { Material } from '../../../../directives/material';
import { BUTTON_COMPONENTS } from '../../../../components/buttons';

@Component({
  selector: 'minds-card-image',
  viewBindings: [ Client ],
  host: {
    'class': 'mdl-card mdl-shadow--2dp'
  },
  properties: ['object']
})
@View({
  templateUrl: 'src/controllers/cards/object/image/image.html',
  directives: [ CORE_DIRECTIVES, BUTTON_COMPONENTS, Material, RouterLink]
})

export class ImageCard {
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
