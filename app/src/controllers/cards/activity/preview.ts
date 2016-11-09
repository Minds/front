import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';

import { AttachmentService } from '../../../services/attachment';

@Component({
  moduleId: module.id,
  selector: 'minds-activity-preview',
  inputs: ['object'],
  templateUrl: 'activity.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ AttachmentService ]
})

export class ActivityPreview {

  minds = window.Minds;
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
