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

import { AttachmentService } from '../../../services/attachment';
import { TranslationService } from '../../../services/translation';
import { MindsRichEmbed } from '../../../components/rich-embed/rich-embed';

@Component({
  selector: 'minds-remind',
  properties: ['object', '_events: events'],
  templateUrl: 'src/controllers/cards/activity/activity.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, MindsVideo, Material, RouterLink, AutoGrow, TagsLinks, MindsRichEmbed, Hovercard ],
  pipes: [ MINDS_PIPES ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ AttachmentService ]
})

export class Remind {
  activity : any;
  hideTabs : boolean;
  session = SessionFactory.build();
  
  events: EventEmitter<any>;
  eventsSubscription: any;

  constructor(
    public client: Client,
    public attachment: AttachmentService,
    public translation: TranslationService,
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

  translate($event: any = {}) {
    if (!$event.selected) {
      return;
    }

    if (!this.translation.isTranslatable(this.activity)) {
      return;
    }

    this.activity.translating = true;

    this.translation.translate(this.activity.guid, $event.selected)
      .then((translation: any) => {
        this.activity.translating = false;

        if (typeof translation.content !== 'undefined') {
          this.activity.translated = true;
          this.activity.original_message = this.activity.message;
          this.activity.message = translation.content;

          this.activity.source_language = '';
          this.translation.getLanguageName(translation.source)
            .then(name => this.activity.source_language = name);
        }

        this.changeDetectorRef.markForCheck();
      })
      .catch(e => {
        this.activity.translating = false;
        this.changeDetectorRef.markForCheck();

        console.error('translate()', e);
      });
  }

  hideTranslation() {
    if (!this.activity.translated) {
      return;
    }

    this.activity.translated = false;
    this.activity.message = this.activity.original_message;
    this.changeDetectorRef.markForCheck();
  }
}
