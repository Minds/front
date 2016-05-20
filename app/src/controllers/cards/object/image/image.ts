import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../../services/api';
import { SessionFactory } from '../../../../services/session';
import { Material } from '../../../../directives/material';
import { BUTTON_COMPONENTS } from '../../../../components/buttons';

import { AttachmentService } from '../../../../services/attachment';

@Component({
  selector: 'minds-card-image',
  host: {
    'class': 'mdl-card mdl-shadow--2dp'
  },
  inputs: ['object'],
  templateUrl: 'src/controllers/cards/object/image/image.html',
  directives: [ CORE_DIRECTIVES, BUTTON_COMPONENTS, Material, RouterLink],
  bindings: [AttachmentService]
})

export class ImageCard {
  entity : any;
  session = SessionFactory.build();
  minds: {};

	constructor(public client: Client, public attachment: AttachmentService){
    this.minds = window.Minds;
	}

  set object(value: any) {
    this.entity = value;
  }

}
