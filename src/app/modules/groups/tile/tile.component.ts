import { Component, Input } from '@angular/core';

import { interval } from 'rxjs';
import { Session } from '../../../services/session';
import { UpdateMarkersService } from '../../../common/services/update-markers.service';
import { map, startWith, throttle } from 'rxjs/operators';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * Used by `m-newsfeed__entity` component to display a preview of a group (e.g. pro site 'groups' filter)
 * or group membership notifications (e.g. if you were invited to a group)
 */
@Component({
  selector: 'm-groups--tile',
  templateUrl: 'tile.component.html',
  styleUrls: ['tile.component.ng.scss'],
})
export class GroupsTileComponent {
  cdnUrl: string;
  @Input() entity;
  $updateMarker;
  hasMarker: boolean = false;

  constructor(
    public session: Session,
    private updateMarkers: UpdateMarkersService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.$updateMarker = this.updateMarkers.markers.subscribe((markers) => {
      if (!markers) return;

      this.entity.hasGathering$ = interval(1000).pipe(
        throttle(() => interval(2000)), //only allow once per 2 seconds
        startWith(0),
        map(
          () =>
            markers.filter(
              (marker) =>
                marker.entity_guid == this.entity.guid &&
                marker.marker == 'gathering-heartbeat' &&
                marker.updated_timestamp > Date.now() / 1000 - 60 //1 minute tolerance
            ).length > 0
        )
      );

      this.hasMarker = markers.filter(
        (marker) =>
          marker.read_timestamp < marker.updated_timestamp &&
          marker.entity_guid == this.entity.guid
      ).length;
    });
  }

  onMembershipChange($event) {
    if ($event.isMember) {
      this.entity['is:member'] = true;
    }
  }

  /**
   * Prevents the click event from propagating to the parent elements.
   * This is necessary because the membership button behavior should not be
   * overridden by parent anchor tags when clicking on the button.
   * @param $event - The mouse event.
   * @returns { void }
   */
  protected onMembershipButtonClick($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
  }

  ngOnDestroy() {
    this.$updateMarker?.unsubscribe();
  }
}
