import { Component, ComponentFactoryResolver, ViewChild, ChangeDetectorRef } from '@angular/core';

import { UpdateMarkersService } from '../../../common/services/update-markers.service';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-group--sidebar-markers',
  templateUrl: 'sidebar-markers.component.html'
})

export class GroupsSidebarMarkersComponent {

  $updateMarker;
  markers = [];
  groups = [];

  constructor(
    private client: Client,
    public session: Session,
    private updateMarkers: UpdateMarkersService,
  ) { }
 
  ngOnInit() {
    this.$updateMarker = this.updateMarkers.markers.subscribe(markers => {
      if (!markers)
        return;
        //    this.markers = markers.filter(marker => marker.entity_type == 'group');

      for (let i in this.groups) {
        if (this.groups[i].guid == 569511221745688576)
          this.groups[i].hasGathering = true;
        this.groups[i].hasMarker = markers.filter(marker => {
          return marker.entity_guid == this.groups[i].guid
            && marker.read_timestamp < marker.updated_timestamp;
        }).length > 0;
      }

    });
    this.load();
  }

  ngOnDestroy() {
    this.$updateMarker.unsubscribe()
  }

  async load() {
    let response:any = await this.client.get('api/v1/groups/member');
    this.groups = response.entities;
  } 

}
