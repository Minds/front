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
  showVerify: boolean = false;

  constructor(private client: Client, private cd: ChangeDetectorRef) {
  }


}
