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
import { MindsRichEmbed } from '../../../components/rich-embed/rich-embed';

@Component({
  selector: 'minds-remind',
  properties: ['object'],
  templateUrl: 'src/controllers/cards/activity/activity.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, MindsVideo, Material, RouterLink, AutoGrow, TagsLinks, MindsRichEmbed, Hovercard ],
  pipes: [ MINDS_PIPES ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ AttachmentService ]
})

export class Remind {
  activity : any;
  hideTabs : boolean;
  session =  SessionFactory.build();

	constructor(public client: Client, public attachment: AttachmentService){
    this.hideTabs = true;
	}

  set object(value: any) {
    this.activity = value;
  }

  toDate(timestamp){
    return new Date(timestamp*1000);
  }

  hideTranslation() {
    if (!this.activity.translated) {
      return;
    }

    this.activity.translated = false;
    this.activity.message = this.activity.original_message;
  }
}
