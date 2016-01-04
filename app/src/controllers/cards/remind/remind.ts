import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { Material } from '../../../directives/material';
import { AutoGrow } from '../../../directives/autogrow';
import { BUTTON_COMPONENTS } from '../../../components/buttons';
import { MindsVideo } from '../../../components/video';
import { Boost } from '../../boosts/boost/boost';
import { Comments } from '../../comments/comments';
import { MINDS_PIPES } from '../../../pipes/pipes';
import { TagsLinks } from '../../../directives/tags';
import { ScrollFactory } from '../../../services/ux/scroll';


@Component({
  selector: 'minds-remind',
  viewBindings: [ Client ],
  properties: ['object']
})
@View({
  templateUrl: 'src/controllers/cards/activity/activity.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, MindsVideo, Material, RouterLink, AutoGrow, TagsLinks],
  pipes: [ MINDS_PIPES ]
})

export class Remind {
  activity : any;
  hideTabs : boolean;
  session =  SessionFactory.build();

	constructor(public client: Client){
    this.hideTabs = true;
	}

  set object(value: any) {
    this.activity = value;
  }

  toDate(timestamp){
    return new Date(timestamp*1000);
  }
}
