import { Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
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
import { Translate } from '../../../components/translate/translate';

import { AttachmentService } from '../../../services/attachment';
import { MindsRichEmbed } from '../../../components/rich-embed/rich-embed';

@Component({
  selector: 'minds-remind',
  properties: ['object', '_events: events'],
  templateUrl: 'src/controllers/cards/activity/activity.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, MindsVideo, Material, RouterLink, AutoGrow, TagsLinks, MindsRichEmbed, Hovercard, Translate ],
  pipes: [ MINDS_PIPES ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ AttachmentService ]
})

export class Remind {

  minds = window.Minds;

  activity : any;
  hideTabs : boolean;
  session = SessionFactory.build();
  
  events: EventEmitter<any>;
  eventsSubscription: any;

  translateEvent: EventEmitter<any> = new EventEmitter(); 

  constructor(
    public client: Client,
    public attachment: AttachmentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.hideTabs = true;
  }
  
  set _events(value: any) {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }

    this.events = value;

    this.eventsSubscription = this.events.subscribe(({ action, args = [] }) => {
      switch (action) {
        case 'translate':
          this.translate.apply(this, args);
          break;
      }

      this.changeDetectorRef.markForCheck();
    });
  }

  set object(value: any) {
    this.activity = value;
  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  toDate(timestamp){
    return new Date(timestamp*1000);
  }

  translate($event: any) {
    this.translateEvent.emit($event);
  }

  propagateTranslation() { }
}
