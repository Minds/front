import { Component, Input } from '@angular/core';

import { interval, Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { UpdateMarkersService } from '../../../common/services/update-markers.service';
import { map, startWith, throttle } from 'rxjs/operators';

@Component({
  selector: 'm-groups--tile',
  templateUrl: 'tile.component.html',
})
export class GroupsTileComponent {
  minds = window.Minds;
  @Input() entity;
  $updateMarker;
  hasMarker: boolean = false;

  constructor(
    public session: Session,
    private updateMarkers: UpdateMarkersService
  ) {}

  ngOnInit() {
    this.$updateMarker = this.updateMarkers.markers.subscribe(markers => {
      if (!markers) return;

      this.entity.hasGathering$ = interval(1000).pipe(
        throttle(() => interval(2000)), //only allow once per 2 seconds
        startWith(0),
        map(
          () =>
            markers.filter(
              marker =>
                marker.entity_guid == this.entity.guid &&
                marker.marker == 'gathering-heartbeat' &&
                marker.updated_timestamp > Date.now() / 1000 - 60 //1 minute tolerance
            ).length > 0
        )
      );

      this.hasMarker = markers.filter(
        marker =>
          marker.read_timestamp < marker.updated_timestamp &&
          marker.entity_guid == this.entity.guid
      ).length;
    });
  }

  ngOnDestroy() {
    this.$updateMarker.unsubscribe();
  }
}
