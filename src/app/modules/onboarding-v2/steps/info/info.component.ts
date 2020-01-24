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

  location: string;
  locationError: string;
  date: string;
  dateOfBirthError: string;

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

  async updateLocation() {
    this.locationError = null;
    try {
      const response: any = await this.client.post('api/v1/channel/info', {
        city: this.location,
      });
    } catch (e) {
      console.error(e);
      this.locationError = e.message;
      return false;
    }
    return true;
  }

  async updateDateOfBirth() {
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
  }

  cancel() {
    this.phoneVerification.reset();
    this.inProgress = false;
    this.locationError = null;
    this.dateOfBirthError = null;
  }

  skip() {
    this.router.navigate(['/onboarding', 'groups']);
  }

  continue() {
    if (this.saveData()) {
      this.router.navigate(['/onboarding', 'groups']);
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
