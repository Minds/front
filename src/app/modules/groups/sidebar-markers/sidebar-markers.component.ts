import { Component, ComponentFactoryResolver, ViewChild, ChangeDetectorRef } from '@angular/core';
import { interval, timer } from 'rxjs';
import { startWith, map, tap, throttle } from 'rxjs/operators';

import { UpdateMarkersService } from '../../../common/services/update-markers.service';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-group--sidebar-markers',
  templateUrl: 'sidebar-markers.component.html'
})

export class GroupsSidebarMarkersComponent {

  inProgress: boolean = false;
  $updateMarker;
  markers = [];
  groups = [];

  constructor(
    private client: Client,
    public session: Session,
    private updateMarkers: UpdateMarkersService,
  ) { }

  async ngOnInit() {
    await this.load();
    
    this.$updateMarker = this.updateMarkers.markers.subscribe(markers => {
      if (!markers)
        return;

      for (let i in this.groups) {
        let entity_guid = this.groups[i].guid;
        this.groups[i].hasGathering$ = interval(1000).pipe(
          throttle(() => interval(2000)), //only allow once per 2 seconds
          startWith(0),
          map(() => markers.filter(marker => marker.entity_guid == entity_guid
            && marker.marker == 'gathering-heartbeat'
            && marker.updated_timestamp > (Date.now() / 1000) - 60 //1 minute tollerance
          ).length > 0)
        );

        this.groups[i].hasMarker = markers.filter(marker => marker.entity_guid == this.groups[i].guid
          && marker.read_timestamp < marker.updated_timestamp
          && marker.marker != 'gathering-heartbeat'
        ).length > 0;
      }

    });
  }

  ngOnDestroy() {
    this.$updateMarker.unsubscribe();
  }

  async load() {
    this.inProgress = true;
    const response: any = await this.client.get('api/v1/groups/member');
    this.groups = response.entities;
    this.inProgress = false;
  }

}
