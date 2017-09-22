import { Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';

import { Client } from '../../../../../services/api';
import { SessionFactory } from '../../../../../services/session';
import { AttachmentService } from '../../../../../services/attachment';

@Component({
  moduleId: module.id,
  selector: 'minds-remind',
  inputs: ['object', '_events: events'],
  templateUrl: '../activity/activity.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Remind {

  minds = window.Minds;

  activity: any;
  hideTabs: boolean;
  session = SessionFactory.build();

  events: EventEmitter<any>;
  eventsSubscription: any;

  editing: boolean = false;
  commentsToggle: boolean = false;
  showBoostOptions: boolean = false;
  translateToggle: any;
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

  toDate(timestamp) {
    return new Date(timestamp * 1000);
  }

  translate($event: any) {
    this.translateEvent.emit($event);
  }

  propagateTranslation(e?) {
    return;
  }
}
