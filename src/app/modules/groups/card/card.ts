import { Component, Inject } from '@angular/core';

import { Client } from '../../../services/api';
import { UpdateMarkersService } from '../../../common/services/update-markers.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'minds-card-group',
  inputs: ['group'],
  templateUrl: 'card.html',
})
export class GroupsCard {
  readonly cdnUrl: string;
  group;
  $updateMarker;
  hasMarker: boolean = false;

  constructor(
    public client: Client,
    private updateMarkers: UpdateMarkersService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
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
