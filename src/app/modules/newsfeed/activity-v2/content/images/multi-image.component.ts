import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivityService } from '../../../activity/activity.service';

@Component({
  selector: 'm-activityV2Content__multiImage',
  templateUrl: './multi-image.component.html',
  styleUrls: ['./multi-image.component.ng.scss'],
})
export class ActivityV2MultiImageComponent {
  images$ = this.service.entity$.pipe(map(entity => entity.custom_data));

  count$ = this.images$.pipe(map(images => images.length));

  constructor(public service: ActivityService) {}
}
