import { Component, Inject } from '@angular/core';

import { Client } from '../../../services/api';
import { UpdateMarkersService } from '../../../common/services/update-markers.service';

@Component({
  moduleId: module.id,
  selector: 'minds-card-group',
  inputs: ['group'],
  templateUrl: 'card.html',
})
export class GroupsCard {
  minds;
  group;
  $updateMarker;
  hasMarker: boolean = false;

  constructor(
    public client: Client,
    private updateMarkers: UpdateMarkersService
  ) {
    this.minds = window.Minds;
  }

  ngOnInit() {
    this.$updateMarker = this.updateMarkers.markers.subscribe(markers => {
      if (!markers) return;
      this.hasMarker = markers.filter(
        marker =>
          marker.read_timestamp < marker.updated_timestamp &&
          marker.entity_guid == this.group.guid
      ).length;
    });
  }

  ngOnDestroy() {
    this.$updateMarker.unsubscribe();
  }
}
