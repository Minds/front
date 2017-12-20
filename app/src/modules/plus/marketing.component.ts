import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

import { PlusSubscriptionComponent } from './subscription.component';
import { Client } from '../../common/api/client.service';

@Component({
  selector: 'm-plus--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PlusMarketingComponent {
  @ViewChild('subscription') private subscription: PlusSubscriptionComponent;

  user = window.Minds.user;
  minds = window.Minds;
  showSubscription: boolean = false;
  showVerify: boolean = false;
  active: boolean = false;
  constructor(private client: Client, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.load();
  }

  load(): Promise<any> {
    return this.client.get('api/v1/plus')
      .then((response: any) => {
        this.active = response.active;
        this.detectChanges();
        return response;
      })
      .catch(e => {
        throw e;
      });
  }

  isPlus() {
    if (this.active || this.user && this.user.plus)
      return true;
    return false;
  }

  cancelSubscription() {
    this.subscription.cancel().then((response: any) => {
      this.user.plus = false;
      this.active = false;
      this.detectChanges();
    });
  }

  openSubscription() {
    this.showSubscription = true;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
