import { Injectable } from '@angular/core';
import { HttpClient } from '../api/client.service';
import { BehaviorSubject } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

@Injectable()
export class UpdateMarkersService {

  markersSubject = new BehaviorSubject(null);
  $markers;
  private data = [];
  httpSubscription;

  constructor(private http: HttpClient) {
  }

  async get() {
    this.httpSubscription = this.http.get('api/v2/notifications/markers', {
        type: 'group',
      })
      .pipe(map(response => response.json()))
      .subscribe((response: any) => {
        this.data = response.markers;
        this.markersSubject.next(response.markers);
      });
  }

  get markers() {
    if (!this.$markers) {
      this.$markers = this.markersSubject.asObservable();
      setInterval(() => this.get(), 5000); // TODO: use sockets
    }
    return this.$markers;
  }

  markAsRead(opts) {
    if (!opts.entity_guid)
      throw "entity guid must be set";
    if (!opts.entity_type)
      throw "entity type must be set";
    if (!opts.marker)
      throw "marker must be set";

    console.log('triggering marker read');
    
    this.http.post('api/v2/notifications/markers/read', opts)
      .pipe(map(response => response.json()))
      .subscribe(res => console.log(res), err => console.log(err));

    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].entity_guid == opts.entity_guid) {
        this.data[i].read_timestamp = Date.now();
      }
    }

    this.markersSubject.next(this.data);
  }

}
