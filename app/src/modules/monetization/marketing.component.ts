import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../common/api/client.service';

@Component({
  selector: 'm-monetization--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MonetizationMarketingComponent {

  user = window.Minds.user;
  showOnboardingForm: boolean = false;

  constructor(private client: Client, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.user)
      this.load();
  }

  load(): Promise<any> {
    return this.client.get('api/v1/merchant/status')
      .then((response: any) => {
        console.log(response);
        return response;
      })
      .catch(e => {
        throw e;
      });
  }

  isMonetized() {
    if (this.user && this.user.merchant.id)
      return true;
    return false;
  }

  onboard() {
    this.showOnboardingForm = true;
    this.detectChanges();
  }

  onboardCompleted(response) {

    this.user.merchant = {
      id: response.id,
      service: 'stripe',
      status: 'awaiting-document',
      exclusive: {
        enabled: true,
        amount: 10
      }
    };

    this.showOnboardingForm = false;

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
