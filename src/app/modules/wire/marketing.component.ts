import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../common/api/client.service';

@Component({
  selector: 'm-wire--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WireMarketingComponent {

  minds = window.Minds;
  user = window.Minds.user;
  showSubscription: boolean = false;
  showVerify: boolean = false;

  constructor(private client: Client, private cd: ChangeDetectorRef) {
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
