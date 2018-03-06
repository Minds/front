import { Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';

import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';

import { AttachmentService } from '../../../../../services/attachment';

@Component({
  moduleId: module.id,
  selector: 'minds-activity-preview',
  inputs: ['object'],
  templateUrl: 'activity.html',
  host: {
    class: 'mdl-shadow--8dp'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ActivityPreview {

  minds = window.Minds;
  activity: any;
  hideTabs: boolean;

  editing: boolean = false;
  commentsToggle: boolean = false;
  showBoostOptions: boolean = false;
  translateToggle: any;
  translateEvent: any;
  childEventsEmitter: EventEmitter<any> = new EventEmitter();
  isTranslatable: boolean = false;
  menuOptions: any = [];
  canDelete: boolean = false;

  constructor(public session: Session, public client: Client, public attachment: AttachmentService, private _changeDetectorRef: ChangeDetectorRef) {
    this.hideTabs = true;
  }

  set object(value: any) {
    this.activity = value;
    if (this.activity.mature) {
      this.activity.mature_visibility = true;
    }
  }
  

  getOwnerIconTime() {
    let session = this.session.getLoggedInUser();
    if(session && session.guid === this.activity.ownerObj.guid) {
      return session.icontime;
    } else {
      return this.activity.ownerObj.icontime;
    }
  }

  toDate(timestamp) {
    return new Date(timestamp * 1000);
  }

  propagateTranslation(e?) {
    return;
  }

  save() { /* NOOP */ }

  openComments() { /* NOOP */ }

  showBoost() { /* NOOP */ }

  showWire() { /* NOOP */ }

  togglePin() { /* NOOP */ }

  menuOptionSelected(e?) { /* NOOP */ }

}
