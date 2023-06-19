import { Component, OnDestroy, OnInit } from '@angular/core';
import { UpdateMarkersService } from '../../../common/services/update-markers.service';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import isMobile from '../../../helpers/is-mobile';

/**
 * Page with a list of all the groups you belong to
 */
@Component({
  selector: 'm-groupsMemberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.ng.scss'],
})
export class GroupsMembershipsComponent implements OnInit, OnDestroy {
  inProgress: boolean = false;
  groups = [];
  offset = 0;
  moreData: boolean = true;
  readonly cdnUrl: string;
  $updateMarker;

  /**
   * How many recommendations to show
   */
  recommendationsListSize: number;

  constructor(
    private client: Client,
    public session: Session,
    private updateMarkers: UpdateMarkersService
  ) {}

  ngOnInit(): void {
    this.load(true);
  }

  ngOnDestroy(): void {
    if (this.$updateMarker) this.$updateMarker.unsubscribe();
  }

  async load(refresh: boolean = false): Promise<void> {
    if (this.inProgress || !this.session.getLoggedInUser()) {
      return;
    }
    this.inProgress = true;
    try {
      const response: any = await this.client.get('api/v1/groups/member', {
        offset: this.offset,
        limit: 1,
      });

      if (!response.entities && this.offset) {
        this.moreData = false;
        throw 'No entities found';
      }
      if (refresh) {
        this.groups = response.entities;
      } else {
        this.groups = this.groups.concat(response.entities);
      }

      this.listenForMarkers();

      this.offset = response['load-next'];
      this.moreData = response.entities && response.entities.length;
    } catch (e) {
    } finally {
      if (this.groups && this.groups.length) {
        this.recommendationsListSize = this.isMobile() ? 1 : 3;
      } else {
        this.recommendationsListSize = 5;
      }
      this.inProgress = false;
    }
  }

  listenForMarkers() {
    if (this.$updateMarker) this.$updateMarker.unsubscribe();

    this.$updateMarker = this.updateMarkers.markers.subscribe(markers => {
      if (!markers) return;

      for (let i in this.groups) {
        this.groups[i].hasMarker =
          markers.filter(
            marker =>
              marker.entity_guid === this.groups[i].guid &&
              marker.read_timestamp < marker.updated_timestamp &&
              marker.marker !== 'gathering-heartbeat'
          ).length > 0;
      }
    });
  }

  isMobile() {
    return isMobile();
  }
}
