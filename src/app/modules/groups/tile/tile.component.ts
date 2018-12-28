import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { UpdateMarkersService } from '../../../common/services/update-markers.service';

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
    private updateMarkers: UpdateMarkersService,
  ) { }

  ngOnInit() {
    this.$updateMarker = this.updateMarkers.markers.subscribe(markers => {
      if (!markers)
        return;
      this.hasMarker = markers
        .filter(marker => 
          (marker.read_timestamp < marker.updated_timestamp)
          && (marker.entity_guid == this.entity.guid)
        )
        .length;
    });
  }

  ngOnDestroy() {
    this.$updateMarker.unsubscribe()
  }

}
