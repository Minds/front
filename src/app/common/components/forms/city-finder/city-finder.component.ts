import { Component, EventEmitter } from '@angular/core';

import { Client, Upload } from '../../../../services/api';
import { Session } from '../../../../services/session';

@Component({
  selector: 'minds-form-city-finder',
  outputs: ['done'],
  templateUrl: 'city-finder.component.html',
})
export class CityFinderComponent {
  error: string = '';
  inProgress: boolean = false;

  city: string = '';
  cities: Array<any> = [];

  done: EventEmitter<any> = new EventEmitter();

  searching;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload
  ) {}

  findCity(q: string) {
    if (this.searching) {
      clearTimeout(this.searching);
    }
    this.searching = setTimeout(() => {
      this.client
        .get('api/v1/geolocation/list', { q: q })
        .then((response: any) => {
          this.cities = response.results;
        });
    }, 100);
  }

  setCity(row: any) {
    this.cities = [];
    if (row.address.city)
      this.session.getLoggedInUser().city = row.address.city;
    if (row.address.town)
      this.session.getLoggedInUser().city = row.address.town;
    this.city = this.session.getLoggedInUser().city;
    this.inProgress = true;
    this.client
      .post('api/v1/channel/info', {
        coordinates: row.lat + ',' + row.lon,
        city: this.session.getLoggedInUser().city,
      })
      .then((response: any) => {
        this.inProgress = false;
        this.done.next(true);
      });
  }
}
