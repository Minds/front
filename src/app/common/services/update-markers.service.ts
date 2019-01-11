import { Injectable } from '@angular/core';
import { HttpClient } from '../api/client.service';
import { BehaviorSubject, ReplaySubject, interval } from 'rxjs';
import { 
  map,
  filter,
  switchMap,
  reduce,
  concatAll,
  mergeAll, mergeMap, startWith, groupBy, toArray, catchError, concatMap, tap, flatMap } from 'rxjs/operators';

@Injectable()
export class UpdateMarkersService {

  markersSubject = new BehaviorSubject([]);
  markers$;
  entityGuids$ = [];
  private data = [];

  constructor(private http: HttpClient) {
  }

  get() {
    return this.http.get('api/v2/notifications/markers', {
        type: 'group',
      })
      .pipe(
        map(response => response.json()),
        map(json => json.markers),
      );
  }

  get markers() {
    if (!this.markers$) {
      interval(5000).pipe(
        startWith(0),
        switchMap(() => this.get())
      )
      .subscribe(markers => {
        this.data = markers; //cache
        this.markersSubject.next(markers);
      });
      this.markers$ = this.markersSubject.asObservable();
      this.emitToEntityGuids();  
    }
    return this.markers$;
  }

  markAsRead(opts) {
    if (!opts.entity_guid)
      throw "entity guid must be set";
    if (!opts.entity_type)
      throw "entity type must be set";
    if (!opts.marker)
      throw "marker must be set";
    
    this.http.post('api/v2/notifications/markers/read', opts)
      .pipe(map(response => response.json()))
      .subscribe(res => null, err => console.warn(err));

    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].entity_guid == opts.entity_guid) {
        this.data[i].read_timestamp = Date.now();
      }
    }

    this.markersSubject.next(this.data);
  }

  getByEntityGuid(entity_guid) {
    if (!this.entityGuids$[entity_guid])
      this.entityGuids$[entity_guid] = new BehaviorSubject({});
    return this.entityGuids$[entity_guid]; 
  }

  emitToEntityGuids() {
    this.markersSubject
      .pipe(
        concatAll(),
      )
      .subscribe(marker => {
        let subject = this.getByEntityGuid(marker.entity_guid);
        subject.next(marker);
      });
  }

}
