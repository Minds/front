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

  translation = {
    translated: false,
    target: '',
    error: false,
    message: '',
    title: '',
    source: ''
  };
  translationInProgress: boolean;

  constructor(
    public client: Client,
    public attachment: AttachmentService,
    public translationService: TranslationService,
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

    if (!this.translationService.isTranslatable(this.activity)) {
      return;
    }

    this.translation.target = '';
    this.translationService.getLanguageName($event.selected)
      .then(name => {
        this.translation.target = name;
        this.changeDetectorRef.markForCheck();
      });
    
    this.translationInProgress = true;

    this.changeDetectorRef.markForCheck();

    this.translationService.translate(this.activity.guid, $event.selected)
      .then((translation: any) => {
        this.translationInProgress = false;
        this.translation.source = null;

        for (let field in translation) {
          this.translation.translated = true;
          this.translation[field] = translation[field].content;

          if (this.translation.source === null && translation[field].source) {
            this.translation.source = '';
            this.translationService.getLanguageName(translation[field].source)
              .then(name => {
                this.translation.source = name;
                this.changeDetectorRef.markForCheck();
              });
          }
        }

        this.changeDetectorRef.markForCheck();
      })
      .catch(e => {
        this.translationInProgress = false;
        this.translation.error = true;
        this.changeDetectorRef.markForCheck();

        console.error('translate()', e);
      });
  }

  hideTranslation() {
    if (!this.translation.translated) {
      return;
    }

    this.translation.translated = false;
    this.changeDetectorRef.markForCheck();
  }
}
