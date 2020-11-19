import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Session } from '../../../../services/session';
import { MindsUser } from '../../../../interfaces/entities';
import { Client } from '../../../../services/api';
import { PhoneVerificationComponent } from './phone-input/input.component';
import * as moment from 'moment';
import { OnboardingV2Service } from '../../service/onboarding.service';
import { DateDropdownsComponent } from '../../../../common/components/date-dropdowns/date-dropdowns.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-onboarding__infoStep',
  templateUrl: 'info.component.html',
})
export class InfoStepComponent implements OnInit, OnDestroy {
  user: MindsUser;

  pendingItems: string[];

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
  ageError: boolean = false;

  cities: Array<any> = [];

  @ViewChild('phoneVerification')
  phoneVerification: PhoneVerificationComponent;

  @ViewChild('dateDropdowns')
  dateDropdowns: DateDropdownsComponent;

  phoneInputDisabled: boolean = false;
  locationDisabled: boolean = false;
  dobDisabled: boolean = false;
  loadingSubscription: Subscription;

  constructor(
    protected onboardingService: OnboardingV2Service,
    private session: Session,
    private client: Client
  ) {
    this.user = session.getLoggedInUser();

    this.onboardingService.setCurrentStep('info');

    this.onResize();
  }

  async ngOnInit() {
    this.loadingSubscription = this.onboardingService.finishedLoading.subscribe(
      async () => {
        this.pendingItems = this.onboardingService.getPendingItems();

        if (this.pendingItems.length > 0) {
          const channel: any = await this.getInfo();
          if (!this.pendingItems.includes('token_verification')) {
            this.phoneInputDisabled = true;
          }

          if (!this.pendingItems.includes('location')) {
            this.location = channel.city;
            this.locationDisabled = true;
          }

          if (!this.pendingItems.includes('dob')) {
            const dob = moment(channel.dob, 'YYYY-MM-DD');
            this.dateDropdowns.selectYear(dob.year(), false);
            this.dateDropdowns.selectMonth(
              this.dateDropdowns.monthNames[dob.month()],
              false
            );
            this.dateDropdowns.selectDay(dob.date().toString(), false);
            this.dobDisabled = true;
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
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

  async getInfo() {
    try {
      const response: any = await this.client.get('api/v1/channel/me');
      return response.channel;
    } catch (e) {
      console.error(e);
    }
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
    this.dateOfBirthChanged = date !== '';

    this.validate();
  }

  cancel() {
    this.phoneVerification.reset();
    this.inProgress = false;
    this.locationError = null;
    this.dateOfBirthError = null;
  }

  skip() {
    this.onboardingService.next();
  }

  continue() {
    if (this.saveData()) {
      this.onboardingService.next();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.tooltipAnchor = window.innerWidth <= 480 ? 'top' : 'left';
  }

  canContinue() {
    return this.validatePhone() && this.isDateValid();
  }

  private validatePhone(): boolean {
    if (this.phoneVerification) {
      if (this.phoneVerification.confirmed) {
        return true;
      }
      // if we're confirming the phone or the phone input is dirty
      if (
        this.phoneVerification.confirming ||
        (this.phoneVerification.input && this.phoneVerification.input.dirty)
      ) {
        return false;
      }
    }
    return true;
  }

  private isDateValid() {
    return this.dateOfBirthChanged
      ? moment().diff(moment(this.date), 'years') >= 13
      : true;
  }

  private validate(): boolean {
    if (
      !this.phoneVerification.confirmed &&
      this.phoneVerification.input.dirty
    ) {
      this.phoneVerification.error = 'verify:phonenumber';
      return false;
    }
    if (!this.isDateValid()) {
      this.ageError = true;
      return false;
    }

    this.ageError = false;
    return true;
  }

  private saveData() {
    if (!this.validate()) {
      return;
    }
    return this.updateLocation() && this.updateDateOfBirth();
  }
}
