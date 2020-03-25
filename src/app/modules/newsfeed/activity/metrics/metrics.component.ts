import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'm-activity__metrics',
  templateUrl: 'metrics.component.html',
})
export class ActivityMetricsComponent {
  views$: Observable<number> = this.service.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity.impressions;
    })
  );

  constructor(public service: ActivityService) {}
}
