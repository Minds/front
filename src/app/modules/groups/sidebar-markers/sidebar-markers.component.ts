import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { interval } from 'rxjs';
import { map, startWith, throttle } from 'rxjs/operators';

import { UpdateMarkersService } from '../../../common/services/update-markers.service';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { isPlatformBrowser } from '@angular/common';
import { GroupsService } from '../groups-service';

@Component({
  selector: 'm-group--sidebar-markers',
  templateUrl: 'sidebar-markers.component.html',
})
export class GroupsSidebarMarkersComponent
  implements OnInit, DoCheck, OnDestroy {
  @Input() showLabels: boolean = false;
  layoutMode: 'phone' | 'tablet' | 'desktop' = 'desktop';
  inProgress: boolean = false;
  $updateMarker;
  markers = [];
  groups = [];
  offset = 0;
  moreData: boolean = true;
  tooltipsAnchor: string = 'right';

  @ViewChild('list', { static: true }) list;

  @HostBinding('class.m-groupSidebarMarkers__leftSidebar')
  leftSidebar: boolean = false;

  constructor(
    private client: Client,
    public session: Session,
    private updateMarkers: UpdateMarkersService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private groupsService: GroupsService,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.onResize();
    if (isPlatformBrowser(this.platformId)) {
      this.initialize();

      this.session.getLoggedInUser(user => {
        this.initialize();
      });
    } else {
      this.inProgress = true; // Server side should start in loading spinner state
    }
  }

  async initialize() {
    await this.load(true);
    this.listenForMarkers();
    this.listenForMembershipUpdates();
  }

  /**
   * Listens and responds to membership updates emited from groupsService.
   */
  listenForMembershipUpdates(): void {
    this.groupsService.membershipUpdate$.subscribe(update => {
      if (!update.guid) {
        return;
      }
      if (update.show) {
        // if the group already exists in the list, don't re-add it
        if (this.groups.findIndex(g => g.guid == update.guid) !== -1) {
          return;
        }
        this.groupsService.load(update.guid).then(group => {
          this.groups.unshift(group);
        });
        return;
      }
      this.groups = this.groups.filter(group => group.guid !== update.guid);
    });
  }

  listenForMarkers() {
    if (this.$updateMarker) this.$updateMarker.unsubscribe();

    this.$updateMarker = this.updateMarkers.markers.subscribe(markers => {
      if (!markers) return;

      for (let i in this.groups) {
        let entity_guid = this.groups[i].guid;
        this.groups[i].hasGathering$ = interval(1000).pipe(
          throttle(() => interval(2000)), //only allow once per 2 seconds
          startWith(0),
          map(
            () =>
              markers.filter(
                marker =>
                  marker.entity_guid == entity_guid &&
                  marker.marker == 'gathering-heartbeat' &&
                  marker.updated_timestamp > Date.now() / 1000 - 60 //1 minute tollerance
              ).length > 0
          )
        );

        this.groups[i].hasMarker =
          markers.filter(
            marker =>
              marker.entity_guid == this.groups[i].guid &&
              marker.read_timestamp < marker.updated_timestamp &&
              marker.marker != 'gathering-heartbeat'
          ).length > 0;
      }
    });
  }

  ngOnDestroy() {
    if (this.$updateMarker) {
      this.$updateMarker.unsubscribe();
    }
  }

  async load(refresh: boolean = false) {
    if (this.inProgress || !this.session.getLoggedInUser()) {
      return false;
    }
    this.inProgress = true;
    try {
      const response: any = await this.client.get('api/v1/groups/member', {
        offset: this.offset,
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
      this.inProgress = false;
    }
  }

  ngDoCheck() {
    this.cd.detectChanges();
  }

  @HostListener('window:resize') onResize() {
    this.tooltipsAnchor = window.innerWidth <= 992 ? 'top' : 'right';

    if (window.innerWidth > 900) {
      this.layoutMode = 'desktop';
    } else if (window.innerWidth > 540 && window.innerWidth <= 900) {
      this.layoutMode = 'tablet';
    } else {
      this.layoutMode = 'phone';
    }
  }
}
