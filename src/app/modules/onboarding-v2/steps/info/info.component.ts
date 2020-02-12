import { Component, HostListener, ViewChild } from '@angular/core';
import { Session } from '../../../../services/session';
import { MindsUser } from '../../../../interfaces/entities';
import { Client } from '../../../../services/api';
import { Router } from '@angular/router';
import { PhoneVerificationComponent } from './phone-input/input.component';

@Component({
  selector: 'm-onboarding__infoStep',
  templateUrl: 'info.component.html',
})
export class InfoStepComponent {
  user: MindsUser;

  selectedMonth = 'January';
  selectedDay = '1';
  selectedYear = new Date().getFullYear();
  tooltipAnchor: 'top' | 'left' = 'left';
  inProgress: boolean = false;

  searching;
  location: string;
  coordinates: string;
  locationError: string;
  date: string;
  dateOfBirthError: string;
  dateOfBirthChanged: boolean = false;

  cities: Array<any> = [];

  @ViewChild('phoneVerification', { static: false })
  phoneVerification: PhoneVerificationComponent;

  constructor(
    private session: Session,
    private client: Client,
    private router: Router
  ) {
    this.user = session.getLoggedInUser();

    this.onResize();
  }

  locationChange(location: string) {
    this.location = location;
    this.coordinates = null;
  }

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

    this.location = row.address.city ? row.address.city : row.address.state;
    this.coordinates = row.lat + ',' + row.lon;
  }

  async updateLocation() {
    this.locationError = null;

    const opts: any = {
      city: this.location,
    };

    if (this.coordinates) {
      opts.coordinates = this.coordinates;
    }
    try {
      const response: any = await this.client.post('api/v1/channel/info', opts);
    } catch (e) {
      console.error(e);
      this.locationError = e.message;
      return false;
    }
    return true;
  }

  async updateDateOfBirth() {
    if (!this.dateOfBirthChanged) {
      return true;
    }
    this.dateOfBirthError = null;

    try {
      const response: any = await this.client.post('api/v1/channel/info', {
        dob: this.date,
      });
    } catch (e) {
      console.error(e);
      this.dateOfBirthError = e.message;
      return false;
    }
    return true;
  }

  selectedDateChange(date: string) {
    this.date = date;
    this.dateOfBirthChanged = true;
  }

  cancel() {
    this.phoneVerification.reset();
    this.inProgress = false;
    this.locationError = null;
    this.dateOfBirthError = null;
  }

  skip() {
    this.router.navigate(['/newsfeed']);
  }

  continue() {
    if (this.saveData()) {
      this.router.navigate(['/newsfeed']);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.tooltipAnchor = window.innerWidth <= 480 ? 'top' : 'left';
  }

  private saveData() {
    return this.updateLocation() && this.updateDateOfBirth();
  }
}
