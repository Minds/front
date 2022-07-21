import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { map } from 'rxjs/operators';

/**
 * Displays view count and whether activity is boosted
 */
@Component({
  selector: 'm-activity__metrics',
  templateUrl: 'metrics.component.html',
  styleUrls: ['metrics.component.ng.scss'],
})
export class ActivityMetricsComponent {
  entity$: Observable<ActivityEntity> = this.service.entity$;
  views$: Observable<number> = this.service.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity.impressions;
    })
  );

  constructor(public service: ActivityService) {}
}
