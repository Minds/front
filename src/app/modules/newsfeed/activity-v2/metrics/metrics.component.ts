import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActivityService,
  ActivityEntity,
} from '../../activity/activity.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'm-activityV2__metrics',
  templateUrl: 'metrics.component.html',
  styleUrls: ['metrics.component.ng.scss'],
})
export class ActivityV2MetricsComponent {
  entity$: Observable<ActivityEntity> = this.service.entity$;
  views$: Observable<number> = this.service.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity.impressions;
    })
  );

  constructor(public service: ActivityService) {}
}
