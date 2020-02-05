import { Component, Input, HostBinding } from '@angular/core';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../common/services/activity.service';

import { ActivityService } from './activity.service';

@Component({
  selector: 'm-activity',
  templateUrl: 'activity.component.html',
  providers: [
    ActivityService,
    ActivityServiceCommentsLegacySupport, // Comments service should never have been called this.
  ],
  host: {
    class: 'm-border',
  },
})
export class ActivityComponent {
  constructor(public service: ActivityService) {}

  @Input() set entity(entity) {
    this.service.setEntity(entity);
  }

  @Input() set displayOptions(options) {
    this.service.setDisplayOptions(options);
  }

  @HostBinding('class.m-activity--fixedHeight')
  get isFixedHeight(): boolean {
    return this.service.displayOptions.fixedHeight;
  }
}
