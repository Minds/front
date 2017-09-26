import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../common/api/client.service';

@Component({
  selector: 'm-affiliate--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AffiliateMarketingComponent {

  minds = window.Minds;
  user = window.Minds.user;
  showOnboarding: boolean = false;
  link: string = '';

  constructor(private client: Client, private cd: ChangeDetectorRef) {
    if (this.user)
      this.link = this.minds.site_url + 'register;referrer=' + this.user.username;
  }

  isAffiliate() {
    if (!this.user)
      return false;

    for (let program of this.user.programs) {
      if (program === 'affiliate')
        return true;
    }

    return false;
  }

  join() {
    if (!this.user.merchant && !this.user.merchant.id) {
      this.showOnboarding = true;
      return;
    }
    this.user.programs.push('affiliate');
    this.client.put('api/v1/monetization/affiliates');
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
    this.showOnboarding = false;

    this.join();

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
