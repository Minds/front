import { Injectable } from '@angular/core';
import { MindsHttpClient } from '../api/client.service';
import { Session } from '../../../app/services/session';
import { BehaviorSubject } from 'rxjs';
import { SocketsService } from '../../services/sockets';

import { map, concatAll } from 'rxjs/operators';

@Injectable()
export class UpdateMarkersService {
  isLoggedIn: boolean = false;
  markersSubject = new BehaviorSubject([]);
  markers$;
  entityGuids$ = [];
  entityGuidsSockets$ = [];
  private data = [];
  muted = [];

  constructor(
    private http: MindsHttpClient,
    private session: Session,
    private sockets: SocketsService
  ) {}

  get() {
    return this.http
      .get('api/v2/notifications/markers', {
        type: 'group',
      })
      .pipe(map((response: any) => response.markers));
  }

  get markers() {
    if (!this.markers$) {
      this.markers$ = this.markersSubject.asObservable();
      this.isLoggedIn = this.session.isLoggedIn((is) => {
        this.isLoggedIn = is;
        this.fetch();
      });
      this.emitToEntityGuids();
      this.fetch();
    }
    return this.markers$;
  }

  fetch() {
    if (this.isLoggedIn) {
      this.get().subscribe((markers: any) => {
        if (!markers) return;
        this.data = markers; //cache

        for (let i in this.data) {
          if (this.data[i].disabled === true)
            this.muted.push(this.data[i].entity_guid);
        }

        this.markersSubject.next(markers);
      });
    } else {
      this.clear();
    }
  }

  listen() {
    this.emitToEntityGuids();
  }

  clear() {
    // clean subscriptions
    this.entityGuidsSockets$.forEach((sub) => {
      sub.unsubscribe();
    });
    this.entityGuidsSockets$ = [];
    this.entityGuids$ = [];
    this.data = [];
  }

  markAsRead(opts) {
    if (!opts.entity_guid) throw 'entity guid must be set';
    if (!opts.entity_type) throw 'entity type must be set';
    if (!opts.marker) throw 'marker must be set';

    if (!opts.noReply) {
      this.http.post('api/v2/notifications/markers/read', opts).subscribe(
        (res) => null,
        (err) => console.warn(err)
      );
    }

    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].entity_guid == opts.entity_guid) {
        this.data[i].read_timestamp = Date.now() / 1000;
      }
    }

    this.markersSubject.next(this.data);
  }

  mute(entity_guid) {
    if (this.muted.indexOf(entity_guid) > -1) return;
    this.muted.push(entity_guid);
    console.log(this.muted);
  }

  unmute(entity_guid) {
    for (let i = 0; i < this.muted.length; i++) {
      if (this.muted[i] == entity_guid) this.muted.splice(i, 1);
    }
  }

  getByEntityGuid(entity_guid) {
    if (!this.entityGuids$[entity_guid]) {
      this.entityGuids$[entity_guid] = new BehaviorSubject({});
    }

    if (!this.entityGuidsSockets$[entity_guid]) {
      this.sockets.join(`marker:${entity_guid}`);
      this.entityGuidsSockets$[entity_guid] = this.sockets.subscribe(
        `marker:${entity_guid}`,
        (marker) => {
          marker = JSON.parse(marker);
          let entity_guid = marker.entity_guid;

          if (this.muted.indexOf(entity_guid) > -1) {
            return;
          }

          let found = false;
          for (let i in this.data) {
            if (
              this.data[i].entity_guid === entity_guid &&
              this.data[i].marker === marker.marker &&
              this.data[i].user_guid === marker.user_guid
            ) {
              this.data[i].updated_timestamp = marker.updated_timestamp;
              found = true;
            }
          }
          if (!found) {
            this.data.push(marker);
          }
          this.markersSubject.next(this.data);
        }
      );
    }

    return this.entityGuids$[entity_guid];
  }

  emitToEntityGuids() {
    this.markersSubject.pipe(concatAll()).subscribe((marker) => {
      const subject = this.getByEntityGuid(marker.entity_guid);
      subject.next(marker);
    });
  }
}
