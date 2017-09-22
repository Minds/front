import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../../../services/api';
import { SessionFactory } from '../../../../../services/session';

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
  session = SessionFactory.build();

  editing: boolean = false;
  commentsToggle: boolean = false;
  showBoostOptions: boolean = false;
  translateToggle: any;
  translateEvent: any;

  constructor(public client: Client, public attachment: AttachmentService, private _changeDetectorRef: ChangeDetectorRef) {
    this.hideTabs = true;
  }

  set object(value: any) {
    this.activity = value;
    if (this.activity.mature) {
      this.activity.mature_visibility = true;
    }
  }

  toDate(timestamp) {
    return new Date(timestamp * 1000);
  }

  propagateTranslation(e?) {
    return;
  }

}
