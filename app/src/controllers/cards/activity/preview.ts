import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { RouterLink } from "@angular/router-deprecated";

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { Material } from '../../../directives/material';
import { AutoGrow } from '../../../directives/autogrow';
import { Hovercard } from '../../../directives/hovercard';
import { BUTTON_COMPONENTS } from '../../../components/buttons';
import { MindsVideo } from '../../../components/video';
import { Boost } from '../../boosts/boost/boost';
import { Comments } from '../../comments/comments';
import { MINDS_PIPES } from '../../../pipes/pipes';
import { TagsLinks } from '../../../directives/tags';

import { AttachmentService } from '../../../services/attachment';

@Component({
  selector: 'minds-activity-preview',
  properties: ['object'],
  templateUrl: 'src/controllers/cards/activity/activity.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, MindsVideo, Material, RouterLink, AutoGrow, TagsLinks, Hovercard ],
  pipes: [ MINDS_PIPES ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ AttachmentService ]
})

export class ActivityPreview {
  activity : any;
  hideTabs : boolean;
  session =  SessionFactory.build();

	constructor(public client: Client, public attachment: AttachmentService){
    this.hideTabs = true;
	}

  set object(value: any) {
    this.activity = value;
    if (this.activity.mature) {
      this.activity.mature_visibility = true;
    }
  }

  toDate(timestamp){
    return new Date(timestamp*1000);
  }
}
